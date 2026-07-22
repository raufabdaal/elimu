#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/lib/data.ts");
const PARENT_PATH = path.join(ROOT, "src/app/parent/page.tsx");
const PRACTICE_PATH = path.join(ROOT, "src/app/practice/page.tsx");

function replaceAllExact(text, replacements) {
  let changed = 0;
  for (const [oldText, newText] of replacements) {
    const before = text;
    text = text.split(oldText).join(newText);
    if (text !== before) changed += 1;
  }
  return { text, changed };
}

let data = fs.readFileSync(DATA_PATH, "utf8");

const exactReplacements = [
  // Remaining answer-leakage options: keep the answer, move teaching detail to explanation.
  ["They are Equivalent Sets because both sets contain exactly 4 members, even though the actual items inside are completely different", "They are Equivalent Sets"],
  ["The seeds suffocated because respiration could not occur without soil air", "The seeds suffocated"],
  ["They shrivel up, dry, and fall off because their stored food has been completely consumed by the growing seedling", "They shrivel up, dry, and fall off"],
  ["Salting and sun-drying to remove water content so that putrefying bacteria and moulds cannot multiply", "Salting and sun-drying"],
  ["it contains a DOUBLE COMPARATIVE error; since 'taller' is already in the comparative form ending in '-er', adding the word 'more' in front of it is redundant and wrong", "It contains a double comparative error"],
  ["We should never despise or underestimate the weak and small, because even the smallest person can provide lifesaving help in times of trouble", "We should never despise or underestimate the weak and small"],
  ["They are Equivalent Sets because both contain exactly 3 members", "They are Equivalent Sets"],
  ["The perforated vertical pole acts as an AERATION CHIMNEY", "The perforated vertical pole lets air into the compost heap"],
  ["Nyangire (meaning 'I have refused / I reject' in Runyoro) erupted because the Banyoro fiercely protested and rejected the imposition of foreign Baganda chiefs", "Nyangire"],
  ["The plant wilts and dies because the petroleum jelly blocks all microscopic leaf stomata pores, preventing carbon dioxide entry for photosynthesis, oxygen entry for respiration, and water evaporation during transpiration", "The plant wilts and dies"],
  ["The plant wilts and dies because the petroleum jelly blocks all microscopic leaf pores", "The plant wilts and dies"],
  ["Mosquito larvae populations explode rapidly (causing severe malaria outbreaks) because their fish predators are gone", "Mosquito larvae populations increase rapidly"],
  ["Mosquito larvae populations explode rapidly because their fish predators are gone", "Mosquito larvae populations increase rapidly"],
  ["The soil becomes exhausted of the specific mineral nutrients (like nitrogen and phosphorus) needed by maize, and soil-borne pest/disease populations multiply out of control", "The soil becomes exhausted and pests or diseases multiply"],
  ["To conserve soil moisture by stopping evaporation, buffer falling raindrops to prevent splash erosion, suppress weed germination by blocking sunlight, and eventually rot down to add rich organic humus to the soil", "To conserve moisture, reduce erosion, suppress weeds, and add humus"],
  ["To cool their body temperatures down (thermoregulation / basking) since reptiles are cold-blooded", "To cool their body temperatures"],
  ["Time must always be converted into years in the standard formula", "Convert time into years"],
  ["To convert UGX into US Dollars, you divide the UGX amount by the dollar rate", "Divide the UGX amount by the dollar rate"],
  ["It appears pitch black because the green dye absorbs the red light entirely and has zero green light available to reflect", "It appears pitch black"],
  ["stopping dosage early leaves surviving, hardy Plasmodium parasites inside the liver and blood which multiply again to cause dangerous drug-resistant malaria relapse", "Stopping dosage early can cause drug-resistant malaria relapse"],
  ["Akello has been revising her mathematics notes since 8:00 AM.", "Akello started revising her mathematics notes at 8:00 AM and is still revising."],
  ["Peter has been revising his English notes since 8:00 AM.", "Peter started revising his English notes at 8:00 AM and is still revising."],

  // Remaining weird notation and intimidating symbols.
  ["(\\sum f)", "(total frequency)"],
  ["\\sum f = N", "total frequency = N"],
  ["(\\sum X / N)", "the total of all values divided by the number of values"],
  ["(\\xi)", "(Universal Set)"],
  ["\\xi", "Universal Set"],
  ["\\sqrt{144}", "√144"],
  ["\\sqrt{81}", "√81"],
  ["\\sqrt{225}", "√225"],
  ["\\implies", "so"],
  ["\\neq", "is not equal to"],
  ["(n+1)^2", "(n + 1)²"],
  ["(10k + 5)^2", "(10k + 5)²"],
  ["100k^2", "100k²"],
  ["(-1)^3", "(-1)³"],
  ["(-1)^4", "(-1)⁴"],
  ["(-2)^4", "(-2)⁴"],
  ["(p - q)^2", "(p - q)²"],
  ["(5 - 2)^2", "(5 - 2)²"],
  ["(2r)^2", "(2r)²"],
  ["4r^2", "4r²"],
  ["side^2", "side²"],
  ["6s^2", "6s²"],
  ["Radius^2", "Radius²"],
  ["4y^2", "4y²"],
  ["p^3", "p³"],
  ["k^3", "k³"],
  ["p^2", "p²"],
  ["k^2", "k²"],
  ["5(3)^2", "5(3)²"],
  ["m/s^2", "m/s²"],
  ["<->", "and"],
  ["now->then", "now to then"],
  ["today->that day", "today to that day"],
  ["here->there", "here to there"],
  ["{Carbon dioxide} + {Water} ->{{Sunlight + Chlorophyll}} {Glucose} + {Oxygen}", "carbon dioxide and water use sunlight and chlorophyll to make glucose and oxygen"],
  ["Akello => him", "Akello gives him"],
  [" ext{Density} = rac{ ext{Mass}}{ ext{Volume}}", "Density = Mass ÷ Volume"],
  [" ext{ g/cm}^3", " g/cm³"],
];

let result = replaceAllExact(data, exactReplacements);
data = result.text;
let exactChanged = result.changed;

// Remove unused keywords from non-short-answer variant items flagged by the audit.
const idsToRemoveKeywords = ["p7-sst-v1-3", "p7-sst-v1-5", "p7-sci-v1-6", "p6-mix-v1-9"];
for (const id of idsToRemoveKeywords) {
  const re = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?)(\\n\\s*keywords:\\s*\\[[^\\]]*\\],)`, "m");
  data = data.replace(re, "$1");
}

// Numeric mixed-number question should be strictly scored; remove loose keywords and keep the clean question wording.
data = data.replace(/(id:\s*"p6-mix-v1-3"[\s\S]*?question:\s*"If Kato has 3\/4 of a sugarcane and Akello gives him another 1\/2 of a sugarcane, express their sum as a mixed number\."),\n\s*keywords:\s*\[[^\]]*\],/, "$1,");

data = data.replace(/Result = 4p\^2q/g, "Result = 4p²q");
data = data.replace(/Result = 3k\^2y/g, "Result = 3k²y");
data = data.replace(/4p\^2q/g, "4p²q");
data = data.replace(/3k\^2y/g, "3k²y");

fs.writeFileSync(DATA_PATH, data);

let parent = fs.readFileSync(PARENT_PATH, "utf8");
parent = parent
  .replace("{/* Executive Pupil Overview Card (`Explicit Indigo Card — guaranteed dark background & white text`) */}", "{/* Executive Student Overview Card */}")
  .replace("{profile.name || \"Pupil\"}", "{profile.name || \"Student\"}")
  .replace("{/* Send Encouragement to Pupil (`Interactive Parent Feature`) */}", "{/* Send Encouragement to Student */}");
fs.writeFileSync(PARENT_PATH, parent);

let practice = fs.readFileSync(PRACTICE_PATH, "utf8");
practice = practice.replace("{/* Practice Banner & Progress (`Zero 4,363 Count Display`) */}", "{/* Practice Banner & Progress */}");
fs.writeFileSync(PRACTICE_PATH, practice);

console.log(`Exact replacement groups applied: ${exactChanged}`);
console.log("Manual high-risk cleanup complete.");
