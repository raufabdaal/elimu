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

const questionMap = new Map(Object.entries({
  "p4-cr1-10": "Which police unit protects children and families?",
  "p4-cr1-11": "Why is any sexual abuse of a child below 18 treated as a very serious crime in Uganda?",
  "p4-cr2-11": "Why should P4 pupils avoid bad company and friends who encourage wrong behaviour?",
  "p4-lg1-10": "What is the official name for local laws made by a District Council or Sub-County Council?",
  "p5-fi1-2": "What two valuable items did Arab and Swahili traders seek from Ugandan kingdoms in the 19th century?",
  "p5-fi2-11": "Why did Kabaka Mwanga II order the death of Bishop James Hannington in 1885?",
  "p5-fi3-4": "Who was the first British Imperial Commissioner sent to Uganda in 1893?",
  "p5-fi1-4_alt": "Which political party was founded in 1956 and later led by Benedicto Kiwanuka?",
  "p5-in3-2": "Which army commander took power in Uganda in January 1971?",
  "p5-gc1-12": "District Councils and Sub-Counties can make local laws called By-laws.",
  "p5-gc2-7": "The High Court handles serious criminal cases and major civil cases in Uganda.",
  "p5-gc3-3": "Which of the following is a basic right of every child in Uganda?",
  "p6fr2-6": "Which Anglican Bishop died in Busoga in 1885 after approaching Buganda from the East?",
  "p6fr3-4": "Which German agent signed treaties with local chiefs in Tanganyika in 1884?",
  "p6sn2-9": "An epidemic affects many people in one area, while a pandemic spreads across many countries.",
  "p6sn3-2": "What should a first aider wear before touching a bleeding wound?",
  "p6gm1-6": "Identify the correct past tense of 'hang' when it means suspending a picture on a wall.",
  "p7ex3-6": "Which liver disease can be caused by long-term heavy alcohol abuse?",
  "p7vc4-3": "A person cannot get HIV through casual contact such as shaking hands, hugging, sharing meals, or mosquito bites.",
  "p7vc4-5": "Which bacterial STI may begin with a painless sore and can cause serious illness if untreated?",
  "p7vc4-7": "Match each STI or reproductive tract infection with its cause or common feature:",
  "p7vc4-11": "Arrange the stages of HIV infection from early infection to advanced disease:",
  "p7vc4-12": "Which daily medicines help people living with HIV suppress the virus and stay healthy?",
  "p7vc4-13": "Why are opportunistic infections common in people with advanced AIDS?",
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
  }
  ts.forEachChild(node, walk);
}
walk(sf);
replacements.sort((a, b) => b.start - a.start);
for (const r of replacements) sourceText = sourceText.slice(0, r.start) + r.text + sourceText.slice(r.end);

const exactReplacements = [
  ["The FCPU provides a safe, child-friendly environment inside police stations (separate from hardened adult criminal cells). Police officers inside the FCPU work with social workers to ensure traumatized children receive medical care (PF3 examination) and psycho-social counseling while perpetrators are brought to justice.", "The FCPU provides a safe, child-friendly place where trained officers and social workers can protect children and connect them to medical and counselling support."],
  ["minors below 18 years cannot legally consent", "Children below 18 must be protected by law"],
  ["Because defilement makes children turn into fish", "Because children are allowed to make adult decisions"],
  ["Because the police want to collect fines from parents", "Because it is a small family disagreement"],
  ["The Queen bee (or simply Queen) has a long, slender abdomen extending far past her wings and can live for 3 to 5 years (fed exclusively on protein-rich Royal Jelly by nurse worker bees).", "The queen bee lays eggs for the colony and is fed by worker bees."],
  ["Because Drones do no work (they do not collect nectar, build combs, or defend the hive - they just eat stored honey), when the dry season arrives and honey stores run low, worker bees ruthlessly stop feeding the Drones, drag them out of the hive entrance, and leave them to starve to death outside (Drone expulsion!).", "Drones do not collect nectar or defend the hive, so worker bees may push them out when food stores are low."],
  ["If you open a hive under scorching 1:00 PM equatorial sun (when thousands of active field foragers are flying in and out), the entire colony will explode in a furious, blinding defensive attack!", "At hot midday hours, many bees are active and more defensive, so harvesting becomes unsafe."],
  ["The toxic chemical spray kills thousands of foraging worker bees directly on the flowers", "The spray can kill foraging worker bees"],
  ["As he faced his executioners, Bishop Hannington's famous last words were: 'Go tell Mwanga I have purchased the road to Uganda with my blood!'", "Bishop Hannington's death became an important event in the history of Christianity in Uganda."],
  ["Missionary societies laid 100% of the foundations for formal secondary boarding education across East Africa (long before the colonial governments built schools).", "Missionary societies helped establish many early schools and hospitals in East Africa."],
  ["HIV is strictly transmitted via exchange of infected body fluids: 1. Unprotected sexual intercourse with an infected person (the primary mode of spread), 2. Sharing unsterilized sharp skin-piercing instruments (needles, syringes, razor blades, circumcising knives, ear-piercing needles, tattoo needles), 3. Transfusion of unscreened infected blood, and 4. Mother-to-Child Transmission (MTCT) during pregnancy, delivery, or breastfeeding (prevented by PMTCT ARV drugs).", "HIV is spread through infected body fluids, sharing unsterilized sharp instruments, unsafe blood transfusion, and mother-to-child transmission. It is not spread by ordinary friendship or classroom contact."],
  ["What bacterial Sexually Transmitted Infection (STI) caused by Treponema pallidum begins with a painless, hard sore (chancre) on the genitals or mouth during the primary stage, later causing skin rashes across palms and soles during the secondary stage, and eventually destroying the brain, heart, and bones if untreated (tertiary stage)?", "Which bacterial STI may begin with a painless sore and can cause serious illness if untreated?"],
  ["If a pregnant mother has untreated syphilis, it can cross the placenta causing miscarriage, stillbirth, or congenital blindness and deafness in the baby.", "Untreated syphilis can seriously harm a mother and baby, so early testing and treatment are important."],
  ["Gonorrhea can also infect the eyes of newborn babies (Ophthalmia neonatorum) during delivery through an infected birth canal, causing newborn blindness unless antibiotic eye drops are applied immediately after birth.", "Gonorrhea is treatable at a health facility, and early treatment prevents serious complications."],
  ["Retrovirus attacking CD4 white blood cells; leads to opportunistic TB and Kaposi's sarcoma", "Virus that weakens body defence cells"],
  ["Bacterium (Treponema pallidum); causes painless hard chancre sores, palm rashes, and heart/brain damage", "Bacterium that can begin with a painless sore"],
  ["Bacterium (Neisseria gonorrhoeae); causes burning urination, thick pus discharge, and tubal infertility", "Bacterium that can cause painful urination"],
  ["Yeast fungus (Candida albicans); causes intense genital itching and thick white curd-like discharge when normal vaginal flora is disrupted by antibiotics or poor hygiene", "Yeast fungus that can cause itching and discomfort"],
  ["Knowing one's status early allows immediate enrollment on life-saving ARV treatment if positive, or reinforcement of strict abstinence/prevention if negative", "Knowing one's status early helps a person get correct health advice and treatment."],
  ["Uganda encourages routine HCT/VCT across health centers to achieve the UNAIDS 95-95-95 targets (95% knowing status, 95% on ARVs, 95% virally suppressed).", "HIV testing and counselling helps people know their status and receive proper support from health workers."],
  ["For Primary 7 pupils, 'A' (Abstinence) is the primary, absolute focus of character education.", "For Primary 7 learners, abstinence and wise decision-making are the key focus."],
  ["Full-Blown AIDS (CD4 cell count drops severely below 200; immune system collapses completely allowing fatal opportunistic infections like pulmonary TB and brain meningitis to take over)", "Advanced AIDS"],
  ["Provided free of charge at government hospitals and health centers across Uganda (e.g., TLD / Dolutegravir-based regimens)", "These medicines are provided at health facilities and must be taken as advised by a health worker."],
  ["Adherence (never skipping a dose) ensures viral load suppression (undetectable equals untransmittable U=U), enabling a normal lifespan.", "Taking ARVs consistently helps suppress HIV and keeps the person healthier."],
  ["Because ARV medicines directly inject TB germs into the patient's lungs", "Because ARVs create the infections"],
  ["Because AIDS patients drink too much cold water during the rainy season", "Because cold water causes every infection"],
  ["Because the red blood cells turn into bone marrow during full-blown AIDS", "Because red blood cells turn into germs"],
  ["The destruction of the immune system's cellular command structure allows benign environmental microbes (opportunists) to cause systemic, life-threatening disease.", "When the immune system is weak, ordinary germs can cause serious illness."],
  ["What irreversible, fatal liver disease known as Liver Cirrhosis is caused by years of chronic alcoholism (excessive drinking of alcoholic beverages)?", "Which liver disease can be caused by long-term heavy alcohol abuse?"],
  ["while preserving our rich indigenous heritage (Empisa z'abajja).", "while preserving cultural heritage."],
  ["a violent coup d'état", "a coup"],
  ["ruling Uganda as a military dictator", "ruling Uganda under military government"],
  ["ruthless German imperial agent", "German colonial agent"],
  ["tricking illiterate local chiefs", "persuading some local chiefs"],
  ["captured and murdered", "killed"],
  ["murder of the newly appointed", "death of the newly appointed"],
];
for (const [oldText, newText] of exactReplacements) {
  sourceText = sourceText.split(oldText).join(newText);
}

fs.writeFileSync(DATA_PATH, sourceText);
console.log(`Sensitive questions rewritten: ${questionUpdates}`);
console.log("Sensitive-content trust cleanup complete.");
