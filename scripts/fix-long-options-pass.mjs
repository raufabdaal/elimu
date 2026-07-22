#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
let sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const replacements = [];
let optionsShortened = 0;
let pairsShortened = 0;
let itemsShortened = 0;

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
function arrayProp(obj, key) { const prop = getProp(obj, key); return prop && ts.isArrayLiteralExpression(prop.initializer) ? prop.initializer.elements : []; }
function objectElementsFromArrayProp(obj, key) { return arrayProp(obj, key).filter(ts.isObjectLiteralExpression); }
function isQuestionObject(node) { return !!(getStringProp(node, "id") && getStringProp(node, "type") && getStringProp(node, "question")); }
function replaceStringLiteral(initializer, nextValue) { replacements.push({ start: initializer.getStart(sf), end: initializer.getEnd(), text: JSON.stringify(nextValue) }); }

function removeLongParentheses(text) {
  return text.replace(/\s*\([^)]{20,}\)/g, "");
}

function removeExamples(text) {
  return text
    .replace(/\s*,?\s*such as\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*for example\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*like\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*including\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*managed by\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*under Article\s+[^.;]+/gi, "")
    .replace(/\s*,?\s*demonstrated by\s+[^.;]+/gi, "");
}

function tidy(text) {
  return text
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/\s+/g, " / ")
    .replace(/[;,]\s*$/g, "")
    .trim();
}

function hardShorten(text, max = 210) {
  if (text.length <= max) return text;
  const preferred = ["; ", ". ", ", and ", ", while ", ", which ", ", where ", ", so ", ", to "];
  for (const token of preferred) {
    const idx = text.indexOf(token);
    if (idx > 55 && idx < max) return tidy(text.slice(0, idx));
  }
  const cut = text.lastIndexOf(" ", max);
  const shortened = text.slice(0, cut > 80 ? cut : max).trim();
  return tidy(shortened.replace(/[,:;-]?$/, ""));
}

function simplify(text, max = 210) {
  const original = text;
  let next = removeLongParentheses(text);
  next = removeExamples(next);
  next = tidy(next);
  next = hardShorten(next, max);
  next = tidy(next);
  if (next.length < original.length && next.length >= 18) return next;
  return original;
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) {
    for (const opt of objectElementsFromArrayProp(node, "options")) {
      const textProp = getProp(opt, "text");
      const text = textProp ? stringValue(textProp.initializer) : undefined;
      if (text && text.length > 220) {
        const next = simplify(text, 205);
        if (next !== text) { replaceStringLiteral(textProp.initializer, next); optionsShortened += 1; }
      }
    }
    for (const pair of objectElementsFromArrayProp(node, "pairs")) {
      for (const key of ["left", "right"]) {
        const textProp = getProp(pair, key);
        const text = textProp ? stringValue(textProp.initializer) : undefined;
        if (text && text.length > 180) {
          const next = simplify(text, 165);
          if (next !== text) { replaceStringLiteral(textProp.initializer, next); pairsShortened += 1; }
        }
      }
    }
    for (const item of objectElementsFromArrayProp(node, "items")) {
      const textProp = getProp(item, "text");
      const text = textProp ? stringValue(textProp.initializer) : undefined;
      if (text && text.length > 180) {
        const next = simplify(text, 165);
        if (next !== text) { replaceStringLiteral(textProp.initializer, next); itemsShortened += 1; }
      }
    }
  }
  ts.forEachChild(node, walk);
}

walk(sf);
replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) sourceText = sourceText.slice(0, r.start) + r.text + sourceText.slice(r.end);
fs.writeFileSync(DATA_PATH, sourceText);
console.log(`Long options shortened: ${optionsShortened}`);
console.log(`Long matching sides shortened: ${pairsShortened}`);
console.log(`Long ordering items shortened: ${itemsShortened}`);
