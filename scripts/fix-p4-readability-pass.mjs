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
  "p4-pc2-3": "In the Kintu and Nambi legend, why were Kintu and Nambi warned not to return to Heaven for any forgotten item?",
  "p4-pc2-4": "Who did Ggulu send to capture Walumbe?",
  "p4-pc2-6": "Which West Nile settlement is associated with River-Lake Nilotic migration into Uganda?",
  "p4-pc3-3": "What traditional wrap-around cloth is worn by many pastoralist cattle herders?",
  "p4-pc3-4": "Which staple food is made from steamed and mashed green bananas wrapped in banana leaves?",
  "p4-pc3-5": "Which traditional staple food is made by mingling millet or sorghum flour in boiling water?",
  "p4-pc3-6": "What is the famous traditional royal dance of the Baganda people?",
  "p4-pc3-10": "What is the traditional introduction and dowry ceremony in Buganda called?",
  "p4-pc3-12": "How should a host traditionally welcome a visitor at home?",
  "p4-ec1-3": "Which major cash crop is Uganda's leading agricultural foreign exchange earner?",
  "p4-ec1-4": "Which cash crop is grown on large plantations in Lugazi, Kakira, and Kinyara?",
  "p4-ec1-12": "Why are farmers encouraged to join cooperative societies?",
  "p4-ec2-3": "What is the dairy farming practice where cows are kept in a shed and fed cut grass?",
  "p4-ec2-6": "Which livestock disease attacks cattle, goats, sheep, and pigs and causes mouth and foot sores?",
  "p4-ec2-7": "What are the three common poultry housing systems?",
  "p4-ec2-10": "Which incurable pig disease can kill many pigs in a short time?",
  "p4-ec2-12": "Why are goats and sheep useful small livestock for farmers?",
  "p4-ec3-4": "Why do fishermen preserve fresh fish by smoking, salting, or sun-drying?",
  "p4-ec3-7": "What is craftsmanship or small-scale cottage industry?",
  "p4-ec3-12": "What is aquaculture?",
  "p4-lg1-4": "How many members are on an LC1 Executive Committee?",
  "p4-lg1-12": "How do religious leaders help communities in a district?",
  "p4-lg2-4": "What is the work of the District Education Officer?",
  "p4-lg2-7": "What is the District Technical Planning Committee?",
  "p4-lg2-10": "Which district body appoints and disciplines local government workers?",
  "p4-lg3-4": "What happens during a campaign period before an election?",
  "p4-lg3-12": "Why are electoral malpractices dangerous?",
  "p4-ss1-6": "Which health programme gives free vaccines to children in Uganda?",
  "p4-ss1-7": "How do religious bodies and private groups support social services?",
  "p4-ss2-2": "Why is railway transport good for carrying heavy goods over long distances?",
  "p4-ss2-3": "Which expressway connects Kampala to Entebbe International Airport?",
  "p4-ss2-6": "Which mass media service broadcasts news and messages through FM radio?",
  "p4-ss2-10": "Which airport is Uganda's main international airport?",
  "p4-ss3-1": "Who provides clean piped water in major urban centres in Uganda?",
  "p4-ss3-2": "Which community water source protects an underground spring from dirty surface water?",
  "p4-ss3-4": "Which police unit protects children and families?",
  "p4-ss3-6": "Which government agency keeps convicted prisoners in custody?",
  "p4-ss3-12": "How does Neighborhood Watch help a community?",
  "p4-cr2-3": "How should a pupil care for public and school property?",
  "p4-cr2-4": "How does a disciplined pupil keep personal hygiene?",
  "p4-cr2-7": "Why should pupils respect classmates from different tribes or religions?",
  "p4-cr2-12": "What should a pupil do after finding a lost item at school?",
  "p4-cr3-3": "How can citizens help law enforcement keep peace and order?",
  "p4-cr3-4": "How can citizens protect and conserve the environment?",
  "p4-cr3-6": "Which official document allows a Ugandan citizen to travel outside the country?",
  "p4-cr3-7": "Why should citizens protect public property?",
  "p4-cr3-10": "What is the crime of stealing or misusing public money called?",
  "p4-cr3-11": "Why is the Constitution called the supreme law of Uganda?",
  "p4-cr3-12": "Why should P4 pupils learn Social Studies and citizenship?",
}));

const correctOptionMap = new Map(Object.entries({
  "p4-gm2-1": "Perimeter is distance around; area is space inside",
  "p4-gm3-5": "The space occupied by a solid object",
  "p4-lr2-1": "A hill is raised land lower than a mountain",
  "p4-lr2-5": "Hilltops gave security, fresh air, and good drainage",
  "p4-lr2-11": "The rift valley floor is lower and hotter than highlands",
  "p4-wv1-11": "Weather forecasts help farmers plan farm work",
  "p4-wv2-11": "Rotational grazing lets pasture regrow",
  "p4-wv3-1": "Natural plant life growing in an area",
  "p4-wv3-2": "Tropical savannah grassland",
  "p4-wv3-5": "Planting trees on bare land",
  "p4-pc1-1": "A group of related tribes with a common origin and culture",
  "p4-pc1-2": "The Bantu",
  "p4-ec1-2": "A food crop is mainly grown for home consumption",
  "p4-ec1-5": "A hoe",
  "p4-ec2-2": "They are hardy and survive hot, dry conditions",
  "p4-ec2-11": "To store water for livestock during the dry season",
  "p4-ec3-3": "They catch young fish before they reproduce",
  "p4-ec3-11": "They raise local revenue for market services",
  "p4-lg3-1": "Through democratic general elections",
  "p4-lg3-5": "Honest, hardworking, accountable, and fair",
  "p4-ss1-1": "Services that improve people's welfare",
  "p4-ss2-2": "It carries heavy goods cheaply over long distances",
  "p4-ss2-11": "Overspeeding, drunk driving, bad vehicles, overloading, and ignoring traffic rules",
  "p4-ss3-5": "To interpret laws and settle disputes fairly",
  "p4-ss3-11": "To stop sewage from contaminating underground water",
  "p4-cr1-5": "Health care, food, shelter, clothing, identity, care, and protection",
  "p4-cr2-2": "Doing helpful home chores",
  "p4-cr2-5": "Punctuality shows respect and helps learners avoid missing lessons",
  "p4-cr3-5": "To defend Uganda when lawfully called upon",
  "p4-hs-m2-4": "Houseflies carry germs from feces or rubbish to uncovered food",
  "p4-wa-m2-4": "The candle uses up oxygen, so the flame goes out",
  "p4-wa-m3-11": "Trees release water vapour that helps form rain clouds",
  "p4-ws-m2-4": "Let mud settle, then decant or filter the clear water",
  "p4-ws-m3-4": "Build a concrete apron and soak-away pit",
  "p4-al-m2-4": "A hard sloping floor, clean water trough, and daily cleaning",
  "p4-me-m1-4": "A liquid has fixed volume but no fixed shape",
  "p4-me-m2-4": "An opaque object blocks light and forms a shadow",
  "p4-me-m3-4": "An echo is reflected sound",
  "p4-hb-m1-8": "It supports the body, protects organs, and works with muscles",
  "p4-hb-m2-8": "Hard force can crack enamel and expose sensitive dentine",
  "p4-hb-m2-11": "It scrubs teeth and helps keep breath fresh",
  "p4-hb-m3-4": "Apply firm pressure with a clean cloth and raise the injured part",
  "p4-hb-m3-8": "Moving it can worsen bleeding, nerve damage, or the fracture",
  "p4-hb-m3-11": "Give quick inward and upward abdominal thrusts",
  "p4-egs-m1-4": "Double the final consonant before adding -ed or -ing",
  "p4-egs-m2-11": "The verb changes from singular to plural",
  "p4-egc-m2-11": "Tone shows the speaker's feelings and attitude",
  "p4-egc-m3-8": "To inform the school community about important dates",
  "p4-egw-m1-1": "A sentence that states the main idea of a paragraph",
  "p4-egw-m1-8": "To finish the story and give the lesson learned",
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
console.log(`P4 questions shortened: ${questionUpdates}`);
console.log(`P4 correct options shortened: ${correctOptionUpdates}`);
