#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
let sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const replacements = [];
let changedOptions = 0;
let changedOrderingItems = 0;
let changedMatchingPairs = 0;

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

function getBoolProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop) return undefined;
  if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (prop.initializer.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

function arrayProp(obj, key) {
  const prop = getProp(obj, key);
  if (!prop || !ts.isArrayLiteralExpression(prop.initializer)) return [];
  return prop.initializer.elements;
}

function objectElementsFromArrayProp(obj, key) {
  return arrayProp(obj, key).filter(ts.isObjectLiteralExpression);
}

function isQuestionObject(node) {
  return !!(getStringProp(node, "id") && getStringProp(node, "type") && getStringProp(node, "question"));
}

function replaceStringLiteral(initializer, nextValue) {
  replacements.push({ start: initializer.getStart(sf), end: initializer.getEnd(), text: JSON.stringify(nextValue) });
}

function explanatoryParen(chunk) {
  return /because|since|e\.g\.|i\.e\.|=|×|÷|\+|formula|check|final|elements|subsets|probability|divide|multiply|subtract|add|solved|converted|answer|therefore|which|where|while|who|called|showing|measured|calculated|contains|example/i.test(chunk);
}

function removeExplanatoryParentheses(text) {
  let out = "";
  let depth = 0;
  let chunk = "";
  let changed = false;
  for (const ch of text) {
    if (ch === "(") {
      if (depth === 0) chunk = "(";
      else chunk += ch;
      depth += 1;
      continue;
    }
    if (ch === ")" && depth > 0) {
      depth -= 1;
      chunk += ")";
      if (depth === 0) {
        if (chunk.length > 18 && explanatoryParen(chunk)) {
          changed = true;
          // Drop the explanatory bracket.
        } else {
          out += chunk;
        }
        chunk = "";
      }
      continue;
    }
    if (depth > 0) chunk += ch;
    else out += ch;
  }
  if (chunk) out += chunk;
  return { text: tidy(out), changed };
}

function tidy(text) {
  return String(text)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+-\s*$/g, "")
    .replace(/\s+;\s*$/g, "")
    .replace(/\s+,\s*$/g, "")
    .trim();
}

function conciseCorrectOption(text) {
  let next = text;
  let changed = false;

  const noParens = removeExplanatoryParentheses(next);
  next = noParens.text;
  changed ||= noParens.changed;

  const beforeSquare = next;
  next = next.replace(/\s*\[[^\]]*(?:=|because|since|members|elements|answer|check)[^\]]*\]/gi, "");
  changed ||= next !== beforeSquare;

  const beforeBecause = next;
  next = next.replace(/^\s*Because\s+/i, "");
  changed ||= next !== beforeBecause;

  // Remove common contrast/explanation tails from correct options.
  const splitters = [
    /;\s*(?:whereas|while|if|this|it|they|the|and)\b/i,
    /,\s*whereas\b/i,
    /,\s*while\b/i,
    /\s+whereas\s+/i,
  ];
  for (const splitter of splitters) {
    const m = next.search(splitter);
    if (m > 24) {
      next = next.slice(0, m);
      changed = true;
      break;
    }
  }

  // If still huge, keep the first clear sentence/clause. The explanation field teaches the detail after checking.
  if (next.length > 210) {
    const sentenceEnd = next.search(/\.\s+[A-Z0-9]/);
    if (sentenceEnd > 40) {
      next = next.slice(0, sentenceEnd + 1);
      changed = true;
    } else {
      const semicolon = next.indexOf(";");
      if (semicolon > 40) {
        next = next.slice(0, semicolon);
        changed = true;
      }
    }
  }

  next = tidy(next);
  return { text: next || text, changed: changed && next.length > 0 };
}

function conciseDistractor(text) {
  let next = text;
  let changed = false;
  const noParens = removeExplanatoryParentheses(next);
  next = noParens.text;
  changed ||= noParens.changed;
  if (next.length > 230) {
    const sentenceEnd = next.search(/\.\s+[A-Z0-9]/);
    if (sentenceEnd > 40) {
      next = next.slice(0, sentenceEnd + 1);
      changed = true;
    }
  }
  next = tidy(next);
  return { text: next || text, changed: changed && next.length > 0 };
}

function conciseOrderingItem(text) {
  let next = text;
  let changed = false;
  const noParens = removeExplanatoryParentheses(next);
  next = noParens.text;
  changed ||= noParens.changed;
  // Ordering item should not show final values/counts after a colon if that value gives away order.
  next = next.replace(/\s*[-–]\s*(?:solved|answer|final|check|count|value).*$/i, "");
  if (next !== text) changed = true;
  next = tidy(next);
  return { text: next || text, changed: changed && next.length > 0 };
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) {
    for (const opt of objectElementsFromArrayProp(node, "options")) {
      const textProp = getProp(opt, "text");
      if (!textProp) continue;
      const text = stringValue(textProp.initializer);
      if (!text) continue;
      const isCorrect = getBoolProp(opt, "correct") === true;
      const result = isCorrect ? conciseCorrectOption(text) : conciseDistractor(text);
      if (result.changed && result.text !== text) {
        replaceStringLiteral(textProp.initializer, result.text);
        changedOptions += 1;
      }
    }

    for (const item of objectElementsFromArrayProp(node, "items")) {
      const textProp = getProp(item, "text");
      if (!textProp) continue;
      const text = stringValue(textProp.initializer);
      if (!text) continue;
      const result = conciseOrderingItem(text);
      if (result.changed && result.text !== text) {
        replaceStringLiteral(textProp.initializer, result.text);
        changedOrderingItems += 1;
      }
    }

    for (const pair of objectElementsFromArrayProp(node, "pairs")) {
      for (const key of ["left", "right"]) {
        const textProp = getProp(pair, key);
        if (!textProp) continue;
        const text = stringValue(textProp.initializer);
        if (!text) continue;
        const result = conciseDistractor(text);
        if (result.changed && result.text !== text) {
          replaceStringLiteral(textProp.initializer, result.text);
          changedMatchingPairs += 1;
        }
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
fs.writeFileSync(DATA_PATH, sourceText);

console.log(`Options cleaned: ${changedOptions}`);
console.log(`Ordering items cleaned: ${changedOrderingItems}`);
console.log(`Matching pair sides cleaned: ${changedMatchingPairs}`);
