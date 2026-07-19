# ELIMU Content Mastery & Scaling Roadmap

## Executive Summary: The Multi-Module Strategy for Guaranteed Mastery
To build a true competitive moat and guarantee that any pupil who completes a topic will **100% master and ace that topic in UNEB PLE / NCDC exams**, every single topic must contain comprehensive, exhaustive question coverage (`dozens to hundreds of unique questions`).

However, making an 11-year-old primary pupil sit through 100+ questions in one long session causes severe cognitive fatigue and burnout. 
**The Solution:** We break every major NCDC curriculum topic into sequential, bite-sized **Modules (`12 to 15 questions per module`)**.

```
[Subject: Social Studies]
   └── [Topic: Our Country Uganda (80+ Questions Total)]
          ├── [Module 1: Location, Position & Physical Features (12 Questions)] ⭐ Mastered
          ├── [Module 2: Economy, Minerals & Tourism (12 Questions)] 🚀 In Progress
          ├── [Module 3: People, Culture, Towns & Early History (15 Questions)] Ready to Start
          ├── [Module 4: Climate & Natural Vegetation (14 Questions)] Locked
          ├── [Module 5: Local & Central Administration (13 Questions)] Locked
          └── [Module 6: Comprehensive Topic PLE Drill & Timed Review (15 Questions)] Locked
```

---

## 1. Multi-Module Hierarchy & Architecture (`Subject -> Topic -> Module -> Question`)

### Core Data Structures (`src/lib/types.ts`)
- **`ModuleData`**: Represents one bite-sized learning phase inside a topic (`12–15 questions`).
- **`TopicData`**: Contains the parent topic metadata and `modules: ModuleData[]`.
- **`Subject`**: Contains the category (`math`, `sst`, `sci`, `eng`) and `topics: Topic[]`.

### User Experience Flow (`/subjects` & `/module`)
1. **Interactive Accordion on `/subjects/`**:
   - Tapping any multi-module topic card smoothly glides down the sequential **Modules Ladder**.
   - Pupils see their exact progress across modules (`Mastered ⭐`, `In Progress 🔥`, `Ready to Start`).
2. **Focused Module Quiz (`/module/?topic=topicId&moduleId=moduleId`)**:
   - Tapping **Start →** launches the focused 12–15 question drill.
   - Upon completing the final question of a module, the **Gamified Mastery Screen** appears with a **`Next: [Module Name] →`** button that instantly transitions the pupil into the next phase of the topic!

---

## 2. Exhaustive NCDC Curriculum Scaling Blueprint by Class & Subject

### A. Primary 7 (`PLE UNEB Mastery`)
#### 1. Social Studies (`sst`)
- **Topic 1: Our Country Uganda (`p7-sst-uganda`) — [6 Modules / ~80 Questions]**
  - Mod 1: Location & Position on Map of East Africa
  - Mod 2: Physical Features (Mountains, Lakes, Rivers, Rift Valley)
  - Mod 3: Climate & Natural Vegetation Zones
  - Mod 4: Ethnic Groups, Migration & Traditional Kingdoms
  - Mod 5: Economy, Cash Crops, Mining & Tourism
  - Mod 6: Administration & Important Historical Towns
- **Topic 2: Physical Features & Regions of Africa (`p7-sst-africa`) — [5 Modules / ~65 Questions]**
  - Mod 1: Location & Relief of Africa (Nile Basin, Sahara, Atlas, Kalahari)
  - Mod 2: African Rivers, Lakes & Multipurpose Dams
  - Mod 3: Climate Zones of Africa & Vegetation
  - Mod 4: Foreign Influence, Scramble for Africa & Berlin Conference
  - Mod 5: Pan-Africanism, Nationalism & Road to Independence
- **Topic 3: International Organizations & World Trade (`p7-sst-world`) — [4 Modules / ~50 Questions]**
  - Mod 1: The East African Community (EAC) & COMESA
  - Mod 2: The African Union (AU) & ECOWAS
  - Mod 3: The United Nations (UN) & Commonwealth of Nations
  - Mod 4: International Trade, Exports, Imports & Foreign Exchange

#### 2. Mathematics (`math`)
- **Topic 1: Advanced Geometry & Mensuration (`p7-math-geometry`) — [4 Modules / ~50 Questions]**
  - Mod 1: Circumference & Area of Circles ($C=2\pi r$, $A=\pi r^2$)
  - Mod 2: Area & Perimeter of Trapeziums, Kites & Parallelograms
  - Mod 3: Surface Area & Volume of Cuboids & Cylinders ($V=\pi r^2 h$)
  - Mod 4: Pythagorean Theorem & Triangles
- **Topic 2: Business Mathematics (`p7-math-business`) — [4 Modules / ~50 Questions]**
  - Mod 1: Simple Interest ($I = \frac{P \times R \times T}{100}$) & Total Amount
  - Mod 2: Profit, Loss & Percentage Profit/Loss
  - Mod 3: Discounts, Commission & Hire Purchase
  - Mod 4: Foreign Exchange Rates & Currency Conversions
- **Topic 3: Set Theory & Venn Diagrams (`p7-math-sets`) — [3 Modules / ~40 Questions]**
  - Mod 1: Two-Set & Three-Set Venn Diagrams
  - Mod 2: Intersection, Union & Complement of Sets
  - Mod 3: Solving Word Problems using Venn Diagrams

#### 3. Integrated Science (`sci`)
- **Topic 1: Renewable & Non-Renewable Energy Resources (`p7-sci-energy`) — [4 Modules / ~50 Questions]**
  - Mod 1: Hydroelectric Power Generation (Owen Falls, Karuma, Bujagali)
  - Mod 2: Solar Energy, Biogas & Wind Power
  - Mod 3: Fossil Fuels (Petroleum, Coal, Natural Gas) & Conservation
  - Mod 4: Energy Transformations & Simple Machines
- **Topic 2: Excretory & Nervous Systems (`p7-sci-excretory`) — [4 Modules / ~50 Questions]**
  - Mod 1: The Kidneys & Osmoregulation (Urea, Urine, Nephrons)
  - Mod 2: Skin as an Excretory & Sensory Organ
  - Mod 3: The Human Brain (Cerebrum, Cerebellum, Medulla) & Spinal Cord
  - Mod 4: Reflex Actions & Sensory Organs (Eye & Ear)

#### 4. English Language (`eng`)
- **Topic 1: PLE Composition & Formal Letter Writing (`p7-eng-composition`) — [3 Modules / ~40 Questions]**
  - Mod 1: Official & Formal Letters (Two addresses, Salutation, Closing)
  - Mod 2: Job Applications & Letters to the Editor
  - Mod 3: Guided Composition & Curriculum Vitae (CV) Formatting
- **Topic 2: Advanced Grammar & Sentence Structures (`p7-eng-grammar`) — [4 Modules / ~50 Questions]**
  - Mod 1: Using *in spite of / despite*, *No sooner had... than*
  - Mod 2: *Not only... but also*, *neither... nor*, *unless / if*
  - Mod 3: *too... to*, *so... that*, and Question Tags
  - Mod 4: Active & Passive Voice Transformations

---

### B. Primary 6 (`Upper Primary Transition`)
- **Mathematics (`math`)**: Percentages, Ratios & Proportions (`4 Modules`), Algebra (`3 Modules`), Angles & Geometry (`3 Modules`).
- **Social Studies (`sst`)**: East African Community & EAC Neighbors (`5 Modules`), Early Migrations & Kingdoms of East Africa (`4 Modules`).
- **Integrated Science (`sci`)**: Circulatory System & Blood Vessels (`3 Modules`), Simple Electric Circuits & Magnetism (`3 Modules`).
- **English Language (`eng`)**: Direct & Reported Speech Backshifting (`3 Modules`), Advanced Reading Comprehension (`3 Modules`).

---

### C. Primary 5 (`Core Foundation`)
- **Mathematics (`math`)**: Fractions & Decimals (`3 Modules`), Multiplication & Long Division (`4 Modules`), Time, Speed & Distance (`3 Modules`).
- **Social Studies (`sst`)**: Regions of Uganda & Physical Features (`4 Modules`), Natural Vegetation & Climate Zones (`3 Modules`).
- **Integrated Science (`sci`)**: The Human Body & Sensory Organs (`3 Modules`), Sanitation, Vectors & Tropical Diseases (`3 Modules`).
- **English Language (`eng`)**: Verbs, Tenses & Parts of Speech (`3 Modules`), Synonyms, Antonyms & Homophones (`3 Modules`).

---

### D. Primary 4 (`Transitional Subject Curriculum`)
- **Mathematics (`math`)**: Place Values & Whole Numbers up to 10,000 (`3 Modules`), Basic Addition & Subtraction (`4 Modules`), Simple Geometric Shapes (`3 Modules`).
- **Social Studies (`sst`)**: Our District & Local Council Leaders (`LC1–LC5`) (`3 Modules`), Using a Compass & Map Symbols (`2 Modules`).
- **Integrated Science (`sci`)**: Parts of a Flowering Plant (`3 Modules`), Seed Germination Conditions (`2 Modules`), Domestic & Wild Animals (`3 Modules`).
- **English Language (`eng`)**: Common & Proper Nouns (`3 Modules`), Irregular Plurals (`2 Modules`), Simple Present & Past Tenses (`3 Modules`).

---

## 3. Sourcing, Screening & Embedding Workflow for Future Content Sprints
1. **Sourcing Phase**: Solicit authentic UNEB PLE pass papers, NCDC teachers' guides, and primary class textbooks.
2. **Screening Phase**: Remove duplicates and verify **100% Ugandan/East African specificity** (convert any foreign currencies/names to UGX, Matooke, Ugandan towns, and NCDC vocabulary).
3. **Canonical Documentation**: Append the verified questions into the target canonical bank (`docs/curriculum/P7-NCDC-UNEB-PLE-QUESTION-BANK.md`, etc.).
4. **App Embedding**: Insert the verified questions into the appropriate `ModuleData` array under `TOPICS` in `src/lib/data.ts`. Run `npm run build` to verify production integrity immediately.
