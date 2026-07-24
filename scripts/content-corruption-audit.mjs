#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
const REPORT_PATH = path.join(ROOT, "docs/CONTENT_CORRUPTION_AUDIT.md");
const sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const findings = [];

function propName(prop) {
  if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) return undefined;
  const name = prop.name;
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}
function getProp(obj, key) { return obj.properties.find((p) => propName(p) === key && ts.isPropertyAssignment(p)); }
function stringValue(expr) { return ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr) ? expr.text : undefined; }
function getStringProp(obj, key) { const prop = getProp(obj, key); return prop ? stringValue(prop.initializer) : undefined; }
function getBoolProp(obj, key) { const prop = getProp(obj, key); if (!prop) return undefined; if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) return true; if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) return false; return undefined; }
function arrayProp(obj, key) { const prop = getProp(obj, key); return prop && ts.isArrayLiteralExpression(prop.initializer) ? prop.initializer.elements : []; }
function objectElementsFromArrayProp(obj, key) { return arrayProp(obj, key).filter(ts.isObjectLiteralExpression); }
function lineOf(node) { return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1; }
function isQuestionObject(node) { return !!(getStringProp(node, "id") && getStringProp(node, "type") && getStringProp(node, "question")); }
function clean(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

function add(q, category, message, snippet, line) {
  findings.push({ line, id: q.id, type: q.type, question: clean(q.question), category, message, snippet: clean(snippet) });
}

function isMathOrSetQuestion(q) {
  const text = `${q.id} ${q.question}`.toLowerCase();
  return /math|set|sets|subset|union|intersection|complement|venn|element|empty set|universal set|number|calculate|convert|evaluate|arrange|sequence|order|jumbled|roman|base|fraction|decimal|angle|algebra|probability|mean|median|mode|range|ratio|percentage|profit|loss|interest/.test(text);
}

function isSequenceQuestion(q) {
  return /sequence|order|arrange|jumbled|chronological|which sequence|correct order|timetable|steps/i.test(q.question);
}

function isNumericQuestion(q) {
  return /number|calculate|convert|evaluate|how many|what is the value|amount|cost|price|ugx|time|date|year|percent|percentage|angle|area|volume|perimeter|mean|median|mode|range|probability|ratio|interest|profit|loss/i.test(q.question);
}

function auditQuestion(node) {
  const q = { id: getStringProp(node, "id"), type: getStringProp(node, "type"), question: getStringProp(node, "question") };
  if (!q.id || !q.type || !q.question) return;
  const options = objectElementsFromArrayProp(node, "options").map((opt) => ({
    id: getStringProp(opt, "id"),
    text: getStringProp(opt, "text"),
    correct: getBoolProp(opt, "correct"),
    line: lineOf(opt),
  }));

  for (const opt of options) {
    if (!opt.text) continue;
    const text = opt.text.trim();
    const line = opt.line;
    const normalized = text.toLowerCase();

    if (/\b(undefined|null|nan|copy\d|correctorder|local_event_id|topicid|moduleid)\b/i.test(text)) {
      add(q, "code_artifact", "Option contains code/data artifact text.", text, line);
    }
    if (/^[ibp]\d$/i.test(text)) {
      add(q, "id_artifact", "Option is only an internal item/pair id.", text, line);
    }
    if (/^[A-Z]\s*[∩∪]\s*[A-Z]$/.test(text) && !isMathOrSetQuestion(q)) {
      add(q, "set_symbol_mismatch", "Set notation appears in a non-set question.", text, line);
    }
    if (/[{}∩∪Ø]/.test(text) && !isMathOrSetQuestion(q)) {
      add(q, "set_notation_mismatch", "Set notation appears where the question is not about sets/math.", text, line);
    }
    if (/^\d+(\s*,\s*\d+){2,}$/.test(text) && !isSequenceQuestion(q) && !isNumericQuestion(q)) {
      add(q, "random_number_sequence", "Option looks like an ordering sequence in a non-sequence question.", text, line);
    }
    if (opt.correct && /^(?:[a-d]|option\s+[a-d])$/i.test(text)) {
      add(q, "option_letter_answer", "Correct option is only a letter, likely corrupted.", text, line);
    }
    if (opt.correct && normalized.includes("a ∩ b") && !isMathOrSetQuestion(q)) {
      add(q, "known_corruption", "Known corrupted option pattern A ∩ B.", text, line);
    }
  }

  // Compare option language against question for suspicious all-options mismatch.
  if (q.type === "multiple_choice" && options.length >= 3) {
    const correct = options.find((o) => o.correct);
    if (correct?.text) {
      const qText = q.question.toLowerCase();
      const cText = correct.text.toLowerCase();
      const geographyWords = /lake|river|mountain|district|border|uganda|kenya|tanzania|congo|rwanda|sudan|park|airport|road|expressway|equator|nile/.test(qText);
      const mathWordsInCorrect = /[{}∩∪Ø]|^\d+(\s*,\s*\d+){2,}$|set\s+[a-z]/i.test(correct.text);
      if (geographyWords && mathWordsInCorrect && !isMathOrSetQuestion(q)) {
        add(q, "geo_math_mismatch", "Geography/SST question has math/set-looking correct option.", correct.text, correct.line);
      }
    }
  }
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) auditQuestion(node);
  ts.forEachChild(node, walk);
}
walk(sf);

findings.sort((a,b)=>a.line-b.line);
const rows = findings.map((f, i) => `| ${i+1} | ${f.line} | ${f.id} | ${f.category} | ${f.message.replace(/\|/g,'/')} | ${f.question.replace(/\|/g,'/')} | ${f.snippet.replace(/\|/g,'/')} |`).join("\n");
const report = `# Content Corruption Audit\n\nThis audit looks for likely corrupted answer options introduced by bulk transformations, such as set notation in geography questions or random ordering sequences in ordinary multiple-choice questions.\n\nFindings: **${findings.length}**\n\n| # | Line | ID | Category | Issue | Question | Snippet |\n|---:|---:|---|---|---|---|---|\n${rows || "| - | - | - | - | No suspicious corruption found | - | - |"}\n`;
fs.writeFileSync(REPORT_PATH, report);
console.log(`Corruption findings: ${findings.length}`);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
