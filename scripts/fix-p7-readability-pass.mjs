#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
let sourceText = fs.readFileSync(DATA_PATH, "utf8");
const sf = ts.createSourceFile(DATA_PATH, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const replacements = [];
let questionUpdates = 0;
let correctOptionUpdates = 0;

const questionMap = new Map(Object.entries({
  "p7vc4-6": "Which bacterial STI causes painful urination and a yellowish-white discharge?",
  "p7ag4-9": "A good apiary site should be quiet, shaded, near flowers and water, and protected from pests and strong winds.",
  "p7ag4-12": "What dance do worker bees use to show other bees where food is found?",
  "p7cp1-6": "Read this excerpt: 'Dr. David Livingstone explored Africa for many years and campaigned against slave trade.' What is he remembered for?",
  "p7cp2-1": "Use the Kampala to Gulu bus timetable to answer the question.",
  "p7cp2-4": "Read the school announcement about the PLE Dedication and Briefing Ceremony. What event is being announced?",
  "p7cp2-10": "Read the job advertisement for a Primary 7 Mathematics teacher. What position is being advertised?",
  "p7vc4-2": "Which method gives unmarried Primary 7 learners complete protection from HIV/AIDS and other STIs?",
  "p7vc4-4": "Why should sharp skin-piercing instruments never be shared without proper sterilization?",
  "p7vc4-8": "What is the voluntary blood test and counselling service for checking HIV status called?",
  "p7vc4-12": "Which daily medicines help people living with HIV suppress the virus and stay healthy?",
  "p7vc4-13": "Why are opportunistic infections common in people with advanced AIDS?",
  "p7ec1-8": "Which iodine test shows that a green leaf has made starch?",
  "p7ag4-4": "Which modern beehive allows easy inspection and clean honey harvesting without destroying the colony?",
  "p7ag4-5": "Which tool produces cool smoke to calm bees during honey harvesting?",
  "p7ag4-8": "What structure on a worker bee's hind leg carries pollen?",
  "p7gm1-6": "Choose the past tense of 'hang' when it means suspending a picture or clothes.",
}));

const correctOptionMap = new Map(Object.entries({
  "p7ah4-10": "Returning African soldiers demanded equal rights and freedom",
  "p7or2-8": "Economic imbalance, ideological differences, and political tension",
  "p7or3-4": "Africa needed a new union focused on development, peace, and democracy",
  "p7cm3-1": "It increased Libya's oil income and national development",
  "p7cm3-6": "The dam traps fertile silt behind Lake Nasser",
  "p7cr2-2": "The Holy Spirit descended like a dove and God spoke",
  "p7el1-10": "To break the circuit when too much current flows",
  "p7el2-6": "It carries lightning safely into the ground",
  "p7el2-10": "Water and sweat conduct electricity",
  "p7ls3-6": "Light bends as it leaves water, making the pool look shallow",
  "p7ls4-13": "The lens changes shape to focus near and far objects",
  "p7ex1-10": "Drink enough clean water and avoid holding urine for long",
  "p7ex2-4": "Blood vessels narrow and hairs stand to conserve heat",
  "p7ex2-10": "Bathe daily, use a personal towel, wash clothes, and trim nails",
  "p7ex3-4": "It changes harmful substances into safer compounds",
  "p7ex3-10": "Tobacco smoke damages the lungs and causes disease",
  "p7ex3-13": "Eat well, drink clean water, exercise, bathe, and avoid alcohol and tobacco",
  "p7ci1-4": "It pumps blood to the whole body under high pressure",
  "p7ci2-1": "Arteries have thick elastic walls and carry blood under high pressure",
  "p7ci2-6": "Blood passes through the heart twice in one complete circulation",
  "p7ci2-10": "Leg muscles squeeze veins and valves stop blood flowing backward",
  "p7ci2-13": "Muscles need more oxygen and glucose during exercise",
  "p7ci3-10": "Blood lacks clotting factors, so bleeding continues",
  "p7ci3-13": "It returns excess tissue fluid to the bloodstream",
  "p7vc2-2": "Use tsetse traps, clear bushes carefully, and control flies",
  "p7vc2-4": "It vomits saliva onto food, then sucks up the liquid food",
  "p7vc2-6": "8 level teaspoons of sugar and 1 level teaspoon of salt in 1 litre of clean water",
  "p7vc3-10": "Wash the bite wound with running water and soap, then seek treatment",
  "p7vc4-4": "They may transfer infected blood from one person to another",
  "p7vc4-13": "HIV destroys CD4 white blood cells that help defend the body",
  "p7ec1-4": "Animals get oxygen, food, medicine, timber, and shade from plants",
  "p7ec1-6": "Plants get carbon dioxide, pollination, and seed dispersal from animals",
  "p7ec1-10": "The plant wilts and dies",
  "p7ec2-10": "Soil would run out of nutrients without decomposers",
  "p7ec3-2": "A tapeworm living in the human intestine",
  "p7ec3-4": "Nutrient pollution causes algae and water weeds to overgrow",
  "p7ag2-1": "The removal of fertile topsoil by water, wind, or animals",
  "p7ag3-1": "A leguminous crop used for food, soil fertility, and income",
  "p7ag4-1": "To lay eggs for the colony",
  "p7ag4-4": "Kenya Top-Bar Hive",
  "p7ag4-6": "The old queen leaves with many workers to start a new colony",
  "p7gm1-6": "hung",
  "p7cp3-1": "To silver pearls",
  "p7s1-8-copy2": "2, 4, 5, 3, 1",
  "p7s1-10-copy2": "A ∩ B",
  "p7ci3-1": "The liquid part of blood",
  "p7ci3-4": "They engulf germs or produce antibodies",
  "p7vc1-1": "Plasmodium",
  "p7vc2-10": "To prevent fecal matter from contaminating water sources",
  "p7ec3-1": "Mutualism",
  "p7-sci-v1-1": "Green plants make food using sunlight, water, and carbon dioxide",
}));

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
function isQuestionObject(node) { return !!(getStringProp(node, "id") && getStringProp(node, "type") && getStringProp(node, "question")); }
function replaceStringLiteral(initializer, nextValue) { replacements.push({ start: initializer.getStart(sf), end: initializer.getEnd(), text: JSON.stringify(nextValue) }); }

function walk(node) {
  if (ts.isObjectLiteralExpression(node) && isQuestionObject(node)) {
    const id = getStringProp(node, "id");
    if (id && questionMap.has(id)) {
      const qProp = getProp(node, "question");
      if (qProp && stringValue(qProp.initializer) !== questionMap.get(id)) {
        replaceStringLiteral(qProp.initializer, questionMap.get(id));
        questionUpdates += 1;
      }
    }
    if (id && correctOptionMap.has(id)) {
      for (const opt of objectElementsFromArrayProp(node, "options")) {
        if (getBoolProp(opt, "correct") === true) {
          const textProp = getProp(opt, "text");
          if (textProp && stringValue(textProp.initializer) !== correctOptionMap.get(id)) {
            replaceStringLiteral(textProp.initializer, correctOptionMap.get(id));
            correctOptionUpdates += 1;
          }
        }
      }
    }
  }
  ts.forEachChild(node, walk);
}
walk(sf);

replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) sourceText = sourceText.slice(0, r.start) + r.text + sourceText.slice(r.end);
fs.writeFileSync(DATA_PATH, sourceText);
console.log(`P7 questions shortened: ${questionUpdates}`);
console.log(`P7 correct options shortened: ${correctOptionUpdates}`);
