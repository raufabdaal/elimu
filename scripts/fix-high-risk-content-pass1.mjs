#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
let sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const replacements = [];
let hintsCleaned = 0;

function propName(prop) {
  if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) return undefined;
  const name = prop.name;
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function getProp(obj, key) {
  return obj.properties.find((p) => propName(p) === key && ts.isPropertyAssignment(p));
}

function stringValue(expr) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  return undefined;
}

function getStringProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop) return undefined;
  return stringValue(prop.initializer);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9?!.']/g, "");
}

function isQuestionObject(node) {
  return !!(getStringProp(node, "id") && getStringProp(node, "type") && getStringProp(node, "question"));
}

function looksMathOrNumeric(id, answer, question) {
  const lowerId = String(id || "").toLowerCase();
  const numericAnswer = /\d/.test(answer || "") && /^[\d\s+\-*/.,=()^%°$€£¥:;\/]+$/.test(String(answer || "").trim());
  return numericAnswer || /^p[4-7]-(st|nm|am|fm|dm|im|gm|me)\d/.test(lowerId) || /^p[4-7](st|nm|am|fm|dm|im|gm|me)\d/.test(lowerId) || /\b(calculate|convert|find|solve|number|fraction|decimal|percentage|angle|area|volume|perimeter|cost|time)\b/i.test(question || "");
}

function likelyEnglishMechanics(question, hint, answer) {
  return /punctuat|apostrophe|comma|full stop|question mark|exclamation|quotation|speech mark|direct speech|capital|contract|spelling|suffix|prefix|rewrite|corrected word|corrected sentence|tense|verb|noun|pronoun|adjective|adverb/i.test(`${question} ${hint} ${answer}`);
}

function replacementHint(id, question, hint, answer) {
  const ans = String(answer || "").trim();
  if (/^[?!.:,;'"()\-]$/.test(ans)) return "Type the correct punctuation mark.";
  if (looksMathOrNumeric(id, ans, question)) return "Work it out step by step, then type only the final answer.";
  if (likelyEnglishMechanics(question, hint, ans)) return "Check the exact spelling, punctuation, or grammar form before typing.";
  if (/name|what is|which|who|where/i.test(question || "")) return "Think of the key term from the lesson, then type your answer.";
  return "Think carefully, then type the answer in your own words.";
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) {
    const type = getStringProp(node, "type");
    const id = getStringProp(node, "id") || "";
    const question = getStringProp(node, "question") || "";
    const hintProp = getProp(node, "hint");
    const hint = hintProp ? stringValue(hintProp.initializer) : undefined;
    const answer = getStringProp(node, "answer") || "";

    if (type === "short_answer" && hintProp && hint && answer && answer.length >= 1) {
      const hintNorm = normalize(hint);
      const answerNorm = normalize(answer);
      if (answerNorm && hintNorm.includes(answerNorm)) {
        const nextHint = replacementHint(id, question, hint, answer);
        replacements.push({
          start: hintProp.initializer.getStart(sf),
          end: hintProp.initializer.getEnd(),
          text: JSON.stringify(nextHint),
        });
        hintsCleaned += 1;
      }
    }
  }
  ts.forEachChild(node, walk);
}

walk(sf);
replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) {
  sourceText = sourceText.slice(0, r.start) + r.text + sourceText.slice(r.end);
}

const beforeNotation = sourceText;
const notationReplacements = [
  [/\\\\notin/g, "is not a member of"],
  [/\\notin/g, "is not a member of"],
  [/\\\\subseteq/g, "is a subset of"],
  [/\\subseteq/g, "is a subset of"],
  [/\\\\subset/g, "is a subset of"],
  [/\\subset/g, "is a subset of"],
  [/\\\\leftrightarrow/g, "is equivalent to"],
  [/\\leftrightarrow/g, "is equivalent to"],
  [/\\\\approx/g, "approximately equal to"],
  [/\\approx/g, "approximately equal to"],
  [/\u0007pprox/g, "approximately equal to"],
  [/pprox/g, "approximately equal to"],
  [/\\\\in\b/g, "is a member of"],
  [/\\in\b/g, "is a member of"],
  [/\\\\to/g, "then"],
  [/\\to/g, "then"],
  [/\\\\%/g, "%"],
  [/\\%/g, "%"],
  [/\\\\\{/g, "{"],
  [/\\\{/g, "{"],
  [/\\\\\}/g, "}"],
  [/\\\}/g, "}"],
  [/\\\\cup/g, "∪"],
  [/\\cup/g, "∪"],
  [/\\\\cap/g, "∩"],
  [/\\cap/g, "∩"],
  [/cm\^2/g, "cm²"],
  [/cm\^3/g, "cm³"],
  [/m\^2/g, "m²"],
  [/m\^3/g, "m³"],
  [/H_2O/g, "H₂O"],
  [/\s->\s/g, " then "],
  [/\s=>\s/g, " gives "],
];
for (const [pattern, replacement] of notationReplacements) {
  sourceText = sourceText.replace(pattern, replacement);
}

fs.writeFileSync(DATA_PATH, sourceText);
console.log(`Hints cleaned: ${hintsCleaned}`);
console.log(`Notation replacements applied: ${beforeNotation === sourceText ? 0 : 1} batch`);
