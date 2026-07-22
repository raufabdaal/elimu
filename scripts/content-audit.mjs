#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
const SRC_ROOT = path.join(ROOT, "src");
const DOCS_DIR = path.join(ROOT, "docs");
const REPORT_PATH = path.join(DOCS_DIR, "CONTENT_AUDIT_REPORT.md");
const CSV_PATH = path.join(DOCS_DIR, "content-audit-findings.csv");

const sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

/** @type {Array<{severity:string, category:string, file:string, line:number|string, id:string, type:string, message:string, snippet:string, suggestion:string}>} */
const findings = [];
/** @type {Array<any>} */
const questions = [];

const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };

function addFinding({ severity = "medium", category, file = "src/lib/data.ts", line = "", id = "", type = "", message, snippet = "", suggestion = "" }) {
  findings.push({
    severity,
    category,
    file,
    line,
    id,
    type,
    message,
    snippet: cleanSnippet(snippet),
    suggestion,
  });
}

function cleanSnippet(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

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

function getStringProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop) return undefined;
  return stringValue(prop.initializer);
}

function getBoolProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop) return undefined;
  if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

function stringValue(expr) {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  return undefined;
}

function arrayProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop || !ts.isArrayLiteralExpression(prop.initializer)) return [];
  return prop.initializer.elements;
}

function lineOf(node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

function objectElementsFromArrayProp(obj, key) {
  return arrayProp(obj, key).filter(ts.isObjectLiteralExpression);
}

function extractQuestion(node) {
  const id = getStringProp(node, "id");
  const type = getStringProp(node, "type");
  const question = getStringProp(node, "question");
  if (!id || !type || !question) return null;

  const q = {
    id,
    type,
    question,
    hint: getStringProp(node, "hint") || "",
    answer: getStringProp(node, "answer") || "",
    explanation: getStringProp(node, "explanation") || "",
    deepDive: getStringProp(node, "deepDive") || "",
    line: lineOf(node),
    node,
    hasKeywords: !!getProp(node, "keywords"),
    keywordCount: arrayProp(node, "keywords").length,
    hasOptions: !!getProp(node, "options"),
    options: objectElementsFromArrayProp(node, "options").map((opt) => ({
      id: getStringProp(opt, "id") || "",
      text: getStringProp(opt, "text") || "",
      correct: getBoolProp(opt, "correct"),
      line: lineOf(opt),
    })),
    items: objectElementsFromArrayProp(node, "items").map((item) => ({
      id: getStringProp(item, "id") || "",
      text: getStringProp(item, "text") || "",
      line: lineOf(item),
    })),
    pairs: objectElementsFromArrayProp(node, "pairs").map((pair) => ({
      id: getStringProp(pair, "id") || "",
      left: getStringProp(pair, "left") || "",
      right: getStringProp(pair, "right") || "",
      line: lineOf(pair),
    })),
    correctOrder: arrayProp(node, "correctOrder").map(stringValue).filter(Boolean),
  };
  return q;
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const q = extractQuestion(node);
    if (q) questions.push(q);
  }
  ts.forEachChild(node, walk);
}
walk(sf);

const byId = new Map();
for (const q of questions) {
  if (byId.has(q.id)) {
    addFinding({
      severity: "critical",
      category: "duplicate_id",
      line: q.line,
      id: q.id,
      type: q.type,
      message: `Duplicate question id. First seen on line ${byId.get(q.id).line}.`,
      snippet: q.question,
      suggestion: "Every question id must be globally unique before tracking, analytics, and parent reports are added.",
    });
  } else {
    byId.set(q.id, q);
  }
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9?!.']/g, "");
}

function looksMathOrNumeric(q) {
  const id = q.id.toLowerCase();
  const numericAnswer = /\d/.test(q.answer) && /^[\d\s+\-*/.,=()^%°$€£¥:;\/]+$/.test(q.answer.trim());
  return numericAnswer || /^p[4-7]-(st|nm|am|fm|dm|im|gm|me)\d/.test(id) || /^p[4-7](st|nm|am|fm|dm|im|gm|me)\d/.test(id) || id.includes("math");
}

function likelyEnglishMechanics(q) {
  return /punctuat|apostrophe|comma|full stop|question mark|exclamation|quotation|speech mark|direct speech|capital|contract|spelling|suffix|prefix|rewrite|corrected word|corrected sentence/i.test(
    `${q.question} ${q.hint} ${q.answer}`
  );
}

function textAudit(q, field, text, line = q.line) {
  if (!text) return;
  const checks = [
    { re: /`/, severity: "high", category: "weird_notation", message: "Backtick/code-style mark visible in learner-facing text.", suggestion: "Remove code formatting from learner-facing content." },
    { re: /\$[^\s]?|[^\\]\$/, severity: "high", category: "weird_notation", message: "Dollar/LaTeX-style symbol may be visible in learner-facing text.", suggestion: "Use plain text or normal currency text such as UGX only." },
    { re: /\\[A-Za-z]+/, severity: "high", category: "weird_notation", message: "LaTeX command/backslash notation is present.", suggestion: "Replace with plain language or a familiar symbol." },
    { re: /\^\d|cm\^2|m\^2|cm\^3|m\^3/i, severity: "medium", category: "weird_notation", message: "Caret exponent notation is present.", suggestion: "Use superscripts such as 2², cm², or m³." },
    { re: /->|=>/, severity: "medium", category: "weird_notation", message: "Arrow-style notation may look technical or code-like.", suggestion: "Use words like 'then', 'gives', or a simple comma-separated sequence." },
  ];
  for (const check of checks) {
    if (check.re.test(text)) {
      addFinding({
        severity: check.severity,
        category: check.category,
        line,
        id: q.id,
        type: q.type,
        message: `${check.message} Field: ${field}.`,
        snippet: text,
        suggestion: check.suggestion,
      });
    }
  }

  const heavyTerms = /physiological|anatomical|hemorrhagic|metabolic|pathogen|cardiovascular|photosynthetic|constitutional|jurisdiction|consolidated fund|symbiotic|morphology|eutrophication|microbiome|pheromone|inter-tropical convergence|scientific definition|geographical definition/i;
  if (heavyTerms.test(text)) {
    addFinding({
      severity: "low",
      category: "age_readability_review",
      line,
      id: q.id,
      type: q.type,
      message: `Potentially heavy vocabulary for P4–P7. Field: ${field}.`,
      snippet: text,
      suggestion: "Keep if curriculum-required; otherwise simplify to Primary-level wording and move advanced detail to explanation/deepDive.",
    });
  }
}

function parentheticalWorking(text) {
  const matches = String(text || "").match(/\([^)]{30,}\)/g) || [];
  return matches.some((m) => /because|since|=|×|÷|\+|formula|check|probability|elements|subsets|answer|therefore|divide|multiply|subtract|add/i.test(m));
}

for (const q of questions) {
  textAudit(q, "question", q.question);
  textAudit(q, "hint", q.hint);
  textAudit(q, "answer", q.answer);
  textAudit(q, "explanation", q.explanation);
  textAudit(q, "deepDive", q.deepDive);

  if (q.question.length > 620) {
    addFinding({ severity: "high", category: "question_too_long", line: q.line, id: q.id, type: q.type, message: "Question stem is extremely long.", snippet: q.question, suggestion: "Shorten the actual question; move context and teaching detail into explanation/deepDive." });
  } else if (q.question.length > 360) {
    addFinding({ severity: "medium", category: "question_too_long", line: q.line, id: q.id, type: q.type, message: "Question stem is long for mobile and for Primary learners.", snippet: q.question, suggestion: "Reduce to the minimum information required to answer." });
  }

  if (q.hint && q.answer && q.answer.length >= 3 && normalize(q.hint).includes(normalize(q.answer))) {
    addFinding({ severity: "high", category: "hint_reveals_answer", line: q.line, id: q.id, type: q.type, message: "Hint appears to contain the model answer.", snippet: q.hint, suggestion: "Rewrite hint to guide thinking without giving the exact answer." });
  }

  if (q.type === "short_answer") {
    if (!q.answer) {
      addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: "Short-answer question has no answer.", snippet: q.question, suggestion: "Add a model answer or change the question type." });
    }
    if (q.hasOptions) {
      addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: "Short-answer question has options.", snippet: q.question, suggestion: "Remove options from short-answer questions." });
    }
    if (looksMathOrNumeric(q) && q.hasKeywords) {
      addFinding({ severity: "high", category: "marking_risk", line: q.line, id: q.id, type: q.type, message: "Math/numeric short answer has keywords, which can loosen scoring incorrectly.", snippet: q.question, suggestion: "Use strict numeric/exact marking; move alternatives into acceptedAnswers later if needed." });
    }
    if (likelyEnglishMechanics(q) && q.hasKeywords) {
      addFinding({ severity: "medium", category: "marking_risk", line: q.line, id: q.id, type: q.type, message: "English mechanics/punctuation question has keywords. This may mark missing punctuation as correct.", snippet: q.question, suggestion: "Use exact/punctuation-aware marking instead of loose keywords." });
    }
  }

  if (q.type !== "short_answer" && q.hasKeywords) {
    addFinding({ severity: "low", category: "unused_data", line: q.line, id: q.id, type: q.type, message: "Keywords are present on a non-short-answer question and are not used by scoring.", snippet: q.question, suggestion: "Remove unused keywords or convert the item if it is meant to be open-answer." });
  }

  if (q.type === "multiple_choice") {
    const correct = q.options.filter((o) => o.correct === true);
    if (correct.length !== 1) {
      addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: `Multiple-choice question has ${correct.length} correct options.`, snippet: q.question, suggestion: "Multiple-choice should have exactly one correct option; use multi_select if more than one answer is required." });
    }
  }

  if (q.type === "multi_select") {
    const correct = q.options.filter((o) => o.correct === true);
    if (correct.length < 1) {
      addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: "Multi-select question has no correct options.", snippet: q.question, suggestion: "Mark at least one option as correct." });
    }
  }

  if (q.type === "true_false" && !["true", "false"].includes(q.answer)) {
    addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: "True/false answer must be exactly 'true' or 'false'.", snippet: q.question, suggestion: "Set answer to true or false." });
  }

  if (q.type === "ordering") {
    const itemIds = new Set(q.items.map((i) => i.id));
    const orderIds = new Set(q.correctOrder);
    const mismatch = q.correctOrder.length !== q.items.length || [...orderIds].some((id) => !itemIds.has(id));
    if (mismatch) {
      addFinding({ severity: "critical", category: "schema_logic", line: q.line, id: q.id, type: q.type, message: "Ordering question item IDs do not match correctOrder IDs.", snippet: q.question, suggestion: "Ensure correctOrder lists exactly the IDs in items." });
    }
  }

  for (const opt of q.options) {
    textAudit(q, "option", opt.text, opt.line);
    if (opt.text.length > 240) {
      addFinding({ severity: "high", category: "option_too_long", line: opt.line, id: q.id, type: q.type, message: "Option text is extremely long.", snippet: opt.text, suggestion: "Keep options short; move explanation to the explanation field." });
    } else if (opt.text.length > 155) {
      addFinding({ severity: "medium", category: "option_too_long", line: opt.line, id: q.id, type: q.type, message: "Option text is long and may crowd mobile screens.", snippet: opt.text, suggestion: "Shorten the option to the essential answer only." });
    }
    if (opt.correct && (/\b(because|since|therefore|formula|check:|divide|multiply|subtract|add|align|convert|LCM|GCF)\b/i.test(opt.text) || parentheticalWorking(opt.text))) {
      addFinding({ severity: "high", category: "answer_leakage", line: opt.line, id: q.id, type: q.type, message: "Correct option appears to contain working/explanation.", snippet: opt.text, suggestion: "Correct options should contain only the answer; put reasoning in explanation." });
    }
  }

  if (q.type === "multiple_choice" && q.options.length >= 3) {
    const correct = q.options.find((o) => o.correct);
    const wrongLengths = q.options.filter((o) => !o.correct).map((o) => o.text.length).sort((a, b) => a - b);
    const medianWrong = wrongLengths[Math.floor(wrongLengths.length / 2)] || 0;
    if (correct && correct.text.length > 95 && correct.text.length > medianWrong * 2.4) {
      addFinding({ severity: "medium", category: "answer_pattern_risk", line: correct.line, id: q.id, type: q.type, message: "Correct option is much longer than distractors, which may reveal the answer by pattern.", snippet: correct.text, suggestion: "Balance option lengths or shorten the correct answer." });
    }
  }

  for (const item of q.items) {
    textAudit(q, "ordering_item", item.text, item.line);
    if (item.text.length > 200) {
      addFinding({ severity: "medium", category: "option_too_long", line: item.line, id: q.id, type: q.type, message: "Ordering item is long and may be hard to drag/read on mobile.", snippet: item.text, suggestion: "Shorten ordering items; move detail to explanation." });
    }
    if (parentheticalWorking(item.text)) {
      addFinding({ severity: "high", category: "answer_leakage", line: item.line, id: q.id, type: q.type, message: "Ordering item appears to include result/working that may give away the order.", snippet: item.text, suggestion: "Remove counts, final values, and reasoning from draggable items." });
    }
  }

  for (const pair of q.pairs) {
    textAudit(q, "matching_left", pair.left, pair.line);
    textAudit(q, "matching_right", pair.right, pair.line);
    if (pair.left.length > 120 || pair.right.length > 170) {
      addFinding({ severity: "medium", category: "option_too_long", line: pair.line, id: q.id, type: q.type, message: "Matching pair text is long and can crowd small screens.", snippet: `${pair.left} => ${pair.right}`, suggestion: "Shorten matching labels; move explanations after answer." });
    }
  }

  if (/defilement|sexual intercourse|HIV|AIDS|alcohol|drug abuse|gambling|murder|treason|armed robbery|female genital mutilation/i.test(`${q.question} ${q.answer} ${q.explanation} ${q.deepDive}`)) {
    addFinding({ severity: "low", category: "sensitive_content_review", line: q.line, id: q.id, type: q.type, message: "Sensitive topic appears in Primary content.", snippet: q.question, suggestion: "Keep only if curriculum-required; ensure tone is age-appropriate and not graphic." });
  }
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "dist", "build", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkFiles(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) results.push(full);
  }
  return results;
}

for (const file of walkFiles(SRC_ROOT)) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((lineText, i) => {
    if (/\bPupil\b|\bpupil\b/.test(lineText) && !rel.includes("lib/data.ts")) {
      addFinding({ severity: "low", category: "ui_language", file: rel, line: i + 1, message: "UI still uses pupil language outside curriculum content.", snippet: lineText, suggestion: "Use Student in UI unless quoting curriculum text." });
    }
    if (/4,435|4,436|4,396|4,363/.test(lineText)) {
      addFinding({ severity: "low", category: "ui_clutter", file: rel, line: i + 1, message: "Large question-bank count is visible in UI/source text.", snippet: lineText, suggestion: "Avoid intimidating learners with huge counts; use gentle progress language." });
    }
    if (/Switch to Parent Portal|Back to Onboarding \/ Profile Setup|Student Home|Pupil Home/.test(lineText)) {
      addFinding({ severity: "medium", category: "navigation_clutter", file: rel, line: i + 1, message: "Potentially cluttered or outdated navigation copy found.", snippet: lineText, suggestion: "Keep menus role-aware and minimal." });
    }
  });
}

const counts = findings.reduce((acc, f) => {
  acc.bySeverity[f.severity] = (acc.bySeverity[f.severity] || 0) + 1;
  acc.byCategory[f.category] = (acc.byCategory[f.category] || 0) + 1;
  return acc;
}, { bySeverity: {}, byCategory: {} });

findings.sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) || String(a.category).localeCompare(String(b.category)) || Number(a.line || 0) - Number(b.line || 0));

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

const csvHeader = ["severity", "category", "file", "line", "id", "type", "message", "snippet", "suggestion"];
const csv = [csvHeader.join(",")]
  .concat(findings.map((f) => csvHeader.map((k) => csvEscape(f[k])).join(",")))
  .join("\n");

fs.mkdirSync(DOCS_DIR, { recursive: true });
fs.writeFileSync(CSV_PATH, csv);

const categoryTable = Object.entries(counts.byCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, count]) => `| ${cat} | ${count} |`)
  .join("\n");

const severityTable = ["critical", "high", "medium", "low"]
  .map((sev) => `| ${sev} | ${counts.bySeverity[sev] || 0} |`)
  .join("\n");

const topFindings = findings.slice(0, 80).map((f, idx) => {
  return `| ${idx + 1} | ${f.severity} | ${f.category} | ${f.file}:${f.line} | ${f.id || "—"} | ${f.message.replace(/\|/g, "/")} | ${f.snippet.replace(/\|/g, "/")} |`;
}).join("\n");

const report = `# Elimu Content & UX Hardening Audit Report

Generated by \`scripts/content-audit.mjs\`.

## Purpose

This is not a final judgement of the curriculum. It is a launch-readiness audit designed to find the places most likely to damage trust before authentication, pricing, free trials, async tracking, and parent payments are added.

The standard used here is strict:

- A Primary learner should understand the question without adult-level wording.
- A correct answer option should not teach the solution before the learner answers.
- Hints should guide, not reveal.
- Math and numeric marking should be strict.
- English punctuation/mechanics should not be scored using loose keywords.
- SST and Science open answers should be flexible only where the marking guide would allow alternatives.
- UI should be calm, role-aware, and non-intimidating.

## Scope scanned

- Question bank file: \`src/lib/data.ts\`
- UI/source scan: \`src/**/*.ts(x)\`
- Question objects detected: **${questions.length}**
- Findings detected: **${findings.length}**

## Findings by severity

| Severity | Count |
| --- | ---: |
${severityTable}

## Findings by category

| Category | Count |
| --- | ---: |
${categoryTable}

## Top priority findings

The full CSV is saved at \`docs/content-audit-findings.csv\`. The table below shows the first 80 findings sorted by severity.

| # | Severity | Category | Location | ID | Issue | Snippet |
| ---: | --- | --- | --- | --- | --- | --- |
${topFindings}

## How to use this report

### Critical
Fix immediately. These are usually schema or logic issues that can break scoring, tracking, or user trust.

### High
Fix during the content hardening cycle before launch. These include answer leakage, hints revealing answers, wrong marking risks, and strange notation.

### Medium
Usually readability, mobile crowding, or age-fit issues. These should be cleaned subject-by-subject.

### Low
Human review required. These may be valid curriculum content, but the wording or tone should be checked carefully.

## Recommended next cleanup order

1. Critical schema/logic issues.
2. High-risk answer leakage in options, ordering items, and hints.
3. Weird notation and visible technical artifacts.
4. English punctuation and grammar marking risk.
5. Overlong questions and options.
6. Age-level vocabulary simplification.
7. Sensitive content tone review.
8. Parent dashboard/value audit after student content is hardened.
`;

fs.writeFileSync(REPORT_PATH, report);

console.log(`Questions scanned: ${questions.length}`);
console.log(`Findings: ${findings.length}`);
console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
console.log(`CSV: ${path.relative(ROOT, CSV_PATH)}`);
console.log("Severity counts:", counts.bySeverity);
