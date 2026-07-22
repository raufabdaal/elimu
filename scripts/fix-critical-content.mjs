#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
let sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const replacements = [];
const seenIds = new Map();
let renamedDuplicateIds = 0;
let fixedOrdering = 0;

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
  replacements.push({
    start: initializer.getStart(sf) + 1,
    end: initializer.getEnd() - 1,
    text: nextValue,
  });
}

function replaceNode(node, nextText) {
  replacements.push({
    start: node.getStart(sf),
    end: node.getEnd(),
    text: nextText,
  });
}

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) {
    const idProp = getProp(node, "id");
    const type = getStringProp(node, "type");
    const id = getStringProp(node, "id");

    if (idProp && id && ts.isStringLiteralLike(idProp.initializer)) {
      const count = (seenIds.get(id) || 0) + 1;
      seenIds.set(id, count);
      if (count > 1) {
        const uniqueId = `${id}-copy${count}`;
        replaceStringLiteral(idProp.initializer, uniqueId);
        renamedDuplicateIds += 1;
      }
    }

    if (type === "ordering") {
      const items = objectElementsFromArrayProp(node, "items").map((item) => getStringProp(item, "id")).filter(Boolean);
      const orderProp = getProp(node, "correctOrder");
      const order = arrayProp(node, "correctOrder").map(stringValue).filter(Boolean);
      if (orderProp && ts.isArrayLiteralExpression(orderProp.initializer) && items.length > 0) {
        const itemSet = new Set(items);
        const validExisting = order.filter((itemId) => itemSet.has(itemId));
        const hasExactSameIds = order.length === items.length && order.every((itemId) => itemSet.has(itemId)) && new Set(order).size === itemSet.size;
        if (!hasExactSameIds) {
          const nextOrder = validExisting.length === items.length && new Set(validExisting).size === itemSet.size
            ? validExisting
            : items;
          replaceNode(orderProp.initializer, `[${nextOrder.map((itemId) => `"${itemId}"`).join(", ")}]`);
          fixedOrdering += 1;
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

console.log(`Renamed duplicate question IDs: ${renamedDuplicateIds}`);
console.log(`Fixed ordering correctOrder arrays: ${fixedOrdering}`);
