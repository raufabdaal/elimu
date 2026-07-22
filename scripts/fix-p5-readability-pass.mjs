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
  "p5-fi2-3": "Which explorer visited Kabaka Mutesa I at Mengo in 1875 and wrote a letter inviting missionaries to Buganda?",
  "p5-fi3-6": "The 1900 Buganda Agreement introduced Mailo land ownership in Buganda.",
  "p5-fi3-9": "Which colonial system used local kings and chiefs to help the British govern Uganda?",
  "p5-fi3-10": "Why did the British not encourage large-scale white settler farming in Uganda as they did in Kenya?",
  "p5-fi3-12": "What was the colonial railway from Mombasa to Uganda nicknamed?",
  "p5-fi4-1": "Which Muganda general helped the British extend colonial rule in Eastern Uganda?",
  "p5-fi4-2": "Which Omukama of Bunyoro resisted British colonial rule for about six years?",
  "p5-fi4-4": "The Lamogi Rebellion of 1911 was an Acholi resistance against British colonial rule.",
  "p5-fi4-7": "The 1897 Sudanese Mutiny happened when Sudanese troops in Uganda rebelled over poor pay and conditions.",
  "p5-fi4-10": "What was the forced unpaid communal labour system introduced under British colonial rule called?",
  "p5-in3-5": "Uganda enacted a new Constitution in 1995.",
  "p5-er1-7": "What dairy farming practice keeps cows in sheds and feeds them cut grass?",
  "p5-er1-8": "Oil palm growing is an important agricultural activity on Bugala Island in Kalangala District.",
  "p5-er2-3": "Which illegal fishing practice uses very fine nets that catch young fish?",
  "p5-er2-12": "Unregulated mining can damage land, water sources, and wetlands.",
  "p5-er3-2": "Which national park in south-western Uganda is famous for mountain gorillas?",
  "p5-er3-4": "Which national park in north-eastern Uganda is famous for wild savannah scenery and ostriches?",
  "p5-er3-9": "Which expressway connects Kampala to Entebbe International Airport?",
  "p5-er3-11": "Commercial forestry provides timber and raw materials for paper industries.",
  "p5-er3-12": "Which regional trade bloc has its headquarters in Lusaka and includes Uganda?",
  "p5-gc2-10": "Which court hears petitions about whether a law or government action violates Uganda's Constitution?",
  "p5-gc3-4": "Children have rights, but they also have responsibilities such as respecting parents, teachers, and elders.",
  "p5-gc3-6": "Which duty requires adult citizens who earn income to pay government revenue?",
  "p5-gc3-7": "Child labour that keeps children from school or puts them in danger is illegal in Uganda.",
  "p5-gc3-12": "A foreigner who has lived legally in Uganda for many years may apply for citizenship by naturalization.",
  "p5-pb2-5": "A farmer can judge brooder temperature by observing how chicks behave.",
  "p5-pb2-7": "Which poultry disease spreads through dirty droppings and causes bloody diarrhoea?",
  "p5-pb2-13": "Egg candling helps a farmer check whether an incubated egg is developing.",
  "p5-pb3-2": "Which bee caste is made up of infertile female bees that do most hive work?",
  "p5-pb3-7": "A beehive should be placed in a quiet shaded area near water and flowering plants.",
  "p5-pb3-10": "What nutritious food made by nurse bees is fed to young larvae and the queen?",
  "p5-pb3-12": "Honey bees use dances to communicate food direction and distance to other worker bees.",
  "p5-pb4-2": "What protective headgear with a mesh face cover is worn when opening a beehive?",
  "p5-pb4-5": "Beeswax is useful for making candles, polish, cosmetics, and other products.",
  "p5-ms3-7": "Liquids arrange themselves in layers according to density, with the densest at the bottom.",
  "p5-ms3-12": "Most substances expand when heated and contract when cooled.",
  "p5-im1-4-copy2": "Natural active immunity can be acquired after a person gets a disease and recovers.",
  "p5-im1-7-copy2": "Vaccines must be kept cold in the Cold Chain to remain effective.",
  "p5-im1-10-copy2": "Which child health card records a baby's growth and immunization dates?",
  "p5-ms2-12": "When water and alcohol are mixed, their total volume may be slightly less than expected.",
  "p5-dg2-1": "Which acid in the stomach kills germs and helps digestion?",
  "p5-dg2-12": "The liver makes bile and helps process newly absorbed food nutrients.",
  "p5-mh2-4": "Mercury is used in thermometers because it is visible and expands evenly when heated.",
  "p5-mh2-5": "Why is alcohol used in thermometers for very cold places?",
  "p5-ms2-2-copy2": "Which useful fungus helps dough rise during bread making?",
  "p5-ms2-8-copy2": "Which fungus commonly causes thrush infection?",
}));

const correctOptionMap = new Map(Object.entries({
  "p5-sl1-11": "The Equator receives nearly equal day and night throughout the year",
  "p5-sl2-6": "Join regional blocs and build transport links",
  "p5-sl2-11": "Smuggling denies government tax revenue and harms local industries",
  "p5-sl3-3": "To bring government services closer to the people",
  "p5-sl3-11": "European powers divided Africa without consulting African leaders",
  "p5-pf1-2": "By faulting, where a block of land was pushed upward",
  "p5-pf3-1": "A long valley formed when land sank between parallel faults",
  "p5-pf3-11": "The rift valley floor is lower and hotter than nearby highlands",
  "p5-cv1-6": "To protect instruments from direct sun and rain while allowing air circulation",
  "p5-cv1-12": "Convectional rainfall",
  "p5-cv2-2": "Double maxima rainfall",
  "p5-cv2-11": "Deforestation reduces rainfall and makes temperatures hotter",
  "p5-cv3-2": "Tall evergreen hardwood trees with dense canopies and buttress roots",
  "p5-cv3-5": "To conserve water during dry seasons",
  "p5-ph1-11": "Fertile soils, reliable rainfall, and moderate temperatures",
  "p5-ph3-1": "They were ruled by councils of elders and other community leaders",
  "p5-fi2-11": "He entered Buganda from the East, which violated a local prophecy",
  "p5-fi4-5": "The Banyoro refused Baganda chiefs appointed by the British",
  "p5-fi4-11": "To help African farmers earn money for taxes and supply raw materials",
  "p5-in1-1": "The colonial law-making body",
  "p5-in2-11": "He admired Uganda's natural beauty and called it the Pearl of Africa",
  "p5-in3-3": "Tanzania and Ugandan exiles fought Amin after the Kagera invasion",
  "p5-in3-9": "To fight corruption and abuse of public office",
  "p5-er1-1": "Most Ugandans depend on land for farming and settlement",
  "p5-er1-6": "The Cattle Corridor",
  "p5-er2-2": "Fishermen use lights to attract Mukene at night",
  "p5-er3-1": "Tourism earns Uganda foreign exchange",
  "p5-er3-6": "Internal trade happens within Uganda using UGX",
  "p5-er3-7": "Railway transport",
  "p5-gc1-1": "Transferring power and services from central government to local councils",
  "p5-gc1-11": "To give women, youth, and PWDs representation in local government",
  "p5-gc2-11": "Judges must decide cases fairly without pressure or bribery",
  "p5-gc3-1": "By birth, registration, naturalization, or adoption",
  "p5-pb1-5": "To absorb moisture and keep the poultry house dry",
  "p5-pb1-11": "To allow chickens to roost off the ground at night",
  "p5-pb2-3": "Providing warmth, humidity, and turning until eggs hatch",
  "p5-pb3-8": "Pupa stage",
  "p5-pb4-3": "When most honeycomb cells are sealed with wax caps",
  "p5-ms2-1": "The space occupied by an object or substance",
  "p5-im1-1-copy2": "The body's ability to resist disease germs",
  "p5-im1-2-copy2": "By receiving ready-made antibodies from the mother",
  "p5-im1-5-copy2": "A preparation that trains the body to fight a disease",
  "p5-im2-2-copy2": "It is caused by poliovirus and can paralyse children",
  "p5-im3-5": "They practise hygiene, use mosquito nets, and report outbreaks",
  "p5-dg1-1": "The breakdown of food into small soluble molecules",
  "p5-dg1-5": "It closes the windpipe during swallowing",
  "p5-dg2-5": "Bile is made by the liver and helps digest fats",
  "p5-dg2-11": "To increase surface area for nutrient absorption",
  "p5-dg3-1": "To reabsorb water and form feces",
  "p5-dg4-6": "Goitre is caused by lack of iodine",
  "p5-dg4-11": "Bacteria in plaque produce acid from sugar",
  "p5-ss2-1": "Loam soil",
  "p5-ss2-2": "It has fine particles and holds water well",
  "p5-ss3-1": "The removal of fertile topsoil by water, wind, or animals",
  "p5-mh1-2": "Gas particles are far apart and move freely",
  "p5-mh2-1": "Heat is thermal energy that flows from hot to cold bodies",
  "p5-mh2-3": "It stops mercury from flowing back quickly",
  "p5-mh2-5": "Alcohol remains liquid at very low temperatures",
  "p5-mh2-11": "Water freezes and boils too easily and is hard to see",
  "p5-mh3-1": "Heat moves through solids by conduction",
  "p5-mh3-2": "Heat moves through fluids by convection currents",
  "p5-rc1-11": "Raised mounds loosen soil for root tubers to expand",
  "p5-rc2-2": "It causes yellow leaves and brown rot inside cassava roots",
  "p5-rc2-5": "It is a serious viral sweet potato disease",
  "p5-rc3-11": "Diffused light storage prevents weak potato sprouts",
  "p5-ms1-1-copy2": "Tiny living organisms seen only with a microscope",
  "p5-ms1-11-copy2": "Bacteria break down waste inside the septic tank",
  "p5-ms3-1-copy2": "Keeping the environment clean and safely disposing waste",
  "p5-ms3-11-copy2": "Open feces contaminate water, attract flies, and spread worms",
  "p5-eg2-6": "A word with the same spelling but a different meaning",
  "p5-rc1-7-copy2": "Solar boreholes provide clean water during dry seasons",
  "p5-rc1-11-copy2": "Reading questions first gives clear targets",
  "p5-rc3-11-copy2": "To emphasize the poem's main message",
  "p5-cw1-11": "Mixing open and closed punctuation in one address is wrong",
  "p5-cw2-3": "To confirm whether the invited person will attend",
  "p5-cw2-10": "To show the correct format of a poster or invitation card",
  "p5-cw3-1": "Speaker names are written on the left, followed by a colon",
  "p5-cw3-3": "An official written record of a meeting",
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
console.log(`P5 questions shortened: ${questionUpdates}`);
console.log(`P5 correct options shortened: ${correctOptionUpdates}`);
