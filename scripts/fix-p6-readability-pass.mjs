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
  "p6cm2-1": "Which East African vegetation zone has dense evergreen forests with tall hardwood trees?",
  "p6cm3-9": "Human-wildlife conflict near national parks can be reduced using trenches, fences, compensation, and community conservation education.",
  "p6po2-3": "Pre-colonial Kenya and mainland Tanzania were mostly organized under clans, age-sets, chiefs, and councils of elders rather than large centralized kingdoms.",
  "p6po3-3": "Sultan Seyyid Said moved his capital to Zanzibar in 1840 because of trade, harbour, fertile soils, and cloves.",
  "p6fr1-9": "European explorers came to East Africa to learn geography, open trade routes, spread Christianity, and prepare for colonial control.",
  "p6fr2-1": "Which two missionaries were the first Europeans to see Mount Kilimanjaro and Mount Kenya?",
  "p6fr3-3": "Before the British government took direct control, a private company administered British interests in Uganda and Kenya.",
  "p6fr3-8": "Which 1900 agreement was signed between Sir Harry Johnston and the Buganda Regents?",
  "p6fr3-9": "Semei Kakungulu helped the British spread colonial rule and Kiganda administration in Eastern Uganda.",
  "p6fr4-1": "Which Omukama of Bunyoro fought a six-year guerrilla war against British rule?",
  "p6fr4-3": "Chief Mkwawa of the Hehe resisted German colonial rule in Tanganyika.",
  "p6fr4-4": "Which Nandi leader resisted British invasion and the Uganda Railway in Kenya?",
  "p6fr4-9": "The Abushiri Rebellion was a coastal resistance against German control in Tanganyika.",
  "p6in1-6": "Who founded the Uganda African Farmers Union in 1947?",
  "p6in2-6": "Which Kenyan trade unionist organized East African student airlifts to study abroad?",
  "p6in3-3": "In 1962, UPC formed an alliance with Kabaka Yekka before Uganda's independence.",
  "p6er2-3": "Commercial oil discoveries around Lake Albert are being developed through major oil projects and pipelines.",
  "p6er2-9": "Fish can be preserved by sun-drying, smoking, salting, chilling, freezing, or canning.",
  "p6er2-12": "Which floating aquatic weed blocked parts of Lake Victoria in the 1990s?",
  "p6er3-3": "Hydroelectric power is a major clean energy source in East Africa.",
  "p6ea3-9": "One East African tourist visa can allow travel through Uganda, Kenya, and Rwanda under the regional visa arrangement.",
  "p6an2-9": "Poisonous snakes use fangs to inject venom, while non-poisonous snakes kill or escape in other ways.",
  "p6an3-9": "Soldier termites are sterile termites that defend the colony.",
  "p6eh3-3": "Pitch depends on the frequency of sound vibrations.",
  "p6sn3-3": "To stop severe bleeding, apply firm direct pressure on the wound using a clean cloth or dressing.",
  "p6sn3-12": "What is the safe side-lying position for an unconscious but breathing casualty called?",
  "p6ag4-9": "A good apiary site should be quiet, shaded, near flowers and water, and protected from pests and strong winds.",
  "p6ag4-12": "What dance do worker bees use to show other bees where food is found?",
  "p6cp1-6": "Read this excerpt: 'Dr. David Livingstone explored Africa for many years and campaigned against slave trade.' What is he remembered for?",
  "p6cp2-1": "Use the Kampala to Gulu bus timetable to answer the question.",
  "p6cp2-4": "Read the school announcement about Speech Day. What important event is being announced?",
  "p6cp2-10": "Read the job advertisement for a Primary 6 English teacher. What position is being advertised?",
  "p6bd1-1": "Which path does air follow during inhalation?",
  "p6bd2-6": "Where is digestion completed and nutrients absorbed into the blood?",
  "p6sn1-1": "Why should latrines be built downhill and away from wells or springs?",
  "p6ec2-4": "What relationship exists between Rhizobium bacteria and leguminous plants?",
  "p6ag4-8": "What structure on a worker bee's hind leg carries pollen?",
}));

const correctOptionMap = new Map(Object.entries({
  "p6lc3-10": "They are in hot closed basins with high evaporation",
  "p6lc4-1": "A long sunken valley formed by faulting",
  "p6lc4-10": "They support spices, fishing, tourism, and ocean shipping",
  "p6cm1-4": "They are dry because of rain shadow, distance from the ocean, and hot winds",
  "p6cm3-4": "A national park protects wildlife in its natural habitat",
  "p6fr3-8": "1900 Buganda Agreement",
  "p6in3-3": "UPC formed an alliance with Kabaka Yekka",
  "p6er2-3": "Using fine-mesh nets that catch immature fish",
  "p6er2-9": "Sun-drying, smoking, salting, chilling, freezing, and canning",
  "p6er3-3": "Hydroelectric power is clean and renewable",
  "p6ea3-9": "One visa can allow travel through Uganda, Kenya, and Rwanda",
  "p6an2-9": "Poisonous snakes inject venom using fangs",
  "p6an3-9": "Soldier termites defend the colony",
  "p6eh3-3": "Higher frequency gives higher pitch",
  "p6sn3-3": "Apply firm direct pressure on the wound",
  "p6ag4-9": "A quiet shaded place near flowers and water",
  "p6lc4-10": "They support spices, fishing, tourism, and shipping",
  "p6pf3-1": "A long valley with steep sides formed by faulting",
  "p6pf3-11": "The rift valley floor is lower, warmer, and drier",
  "p6cv1-6": "To protect instruments while allowing air to circulate",
  "p6cv1-12": "Convectional rainfall",
  "p6cv2-2": "Double maxima rainfall",
  "p6cv2-11": "Deforestation reduces rainfall and increases heat",
  "p6cv3-2": "Tall evergreen trees with dense canopies",
  "p6cv3-5": "To reduce water loss during drought",
  "p6er1-1": "Most people depend on land for farming and settlement",
  "p6er1-6": "The Cattle Corridor",
  "p6er2-2": "Fishermen use lights to attract Mukene at night",
  "p6er3-1": "Tourism earns foreign exchange",
  "p6gc1-1": "Transferring power and services to local councils",
  "p6pb3-8": "Pupa stage",
  "p6ms2-1": "The space occupied by an object or substance",
  "p6bd1-1": "Nose, pharynx, larynx, trachea, bronchi, bronchioles, alveoli",
  "p6bd1-11": "The nasal cavity filters, warms, and moistens air",
  "p6bd2-6": "In the small intestine",
  "p6sn1-1": "To prevent fecal matter from contaminating water sources",
  "p6sn1-10": "Rain washes feces and germs into water sources",
  "p6sn2-1": "Communicable diseases can spread from person to person",
  "p6ec3-4": "Eutrophication harms aquatic life",
  "p6ag4-8": "Pollen basket",
  "p6gm1-6": "hung",
  "p6cp3-1": "To silver pearls",
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
console.log(`P6 questions shortened: ${questionUpdates}`);
console.log(`P6 correct options shortened: ${correctOptionUpdates}`);
