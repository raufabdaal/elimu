# Primary 4 (P4) Mathematics Complete NCDC Question Bank

## Executive Summary & Sourcing Audit
This document serves as the canonical curriculum mapping and complete question bank reference for **Primary 4 Mathematics (`p4-math`)** inside the **Elimu** edtech platform (`/home/user/elimu/src/lib/data.ts`). Authored strictly aligned to the **Uganda National Curriculum Development Centre (NCDC)** Lower/Upper Primary Transition Mathematics Syllabus, this module repository covers **7 Master Topics** broken down into **19 bite-sized Modules** containing exactly **230 progressive questions**.

Every question has been screened and verified against the following non-negotiable standards:
1. **Strictly Ugandan / East African Primary Context**: All commercial transactions use real Ugandan Shillings (`UGX`) with local marketplace landmarks (`Owino Market, Nakasero, Kikuubo, Kasese, Soroti, Gulu, Mbarara, Jinja`). Zero generic Western currency (`dollars`) or items (`subways`).
2. **Multi-Module Progressive Hierarchy**: Topics are broken into 12–13 progressive questions per module (`Module 1: Basic definitions/place values -> Module 2: Intermediate transformations and operations -> Module 3: Word problems and real-life shopping bills/time`).
3. **Zero Repetitive Numbers & Exhaustive Explanations**: Every question features unique numerical data, diverse real-life contexts, and complete mathematical explanations plus pedagogical `deepDive` notes.
4. **TypeScript & Build Compliance**: Fully compliant with `Question` interface specifications (`ShortAnswerQuestion` without options, `OrderingQuestion.correctOrder` matching item IDs). Verified via `npx tsc --noEmit` and `npm run build` (`Next.js 14 static export`).

---

## Complete Curriculum Structure (`7 Master Topics -> 19 Modules -> 230 Questions`)

### 1. Set Theory & Simple Subsets (`p4-math-sets`) - 2 Modules, 24 Questions
- **Module 1: Types of Sets (Equivalent, Equal, Finite, Infinite & Empty Sets)** (`p4-sets-m1`, 12 Questions)
  - Definition of sets (`well-defined collections enclosed in { }`); Equivalent sets (`$n(A)=n(B) \approx$`); Equal sets (`$A=B$`); Finite (`countable`) vs Infinite (`... notation`); Empty/Null set (`{ } or Ø`); Cardinality (`$n(S)$`).
- **Module 2: Intersection, Union & 2-Set Venn Diagrams** (`p4-sets-m2`, 12 Questions)
  - Intersection (`$\cap$ common elements`); Union (`$\cup$ combined unique elements`); Disjoint sets (`zero common members`); 2-set Venn diagram drawing and shading; Formula $n(A \cup B) = n(A) + n(B) - n(A \cap B)$; Word problems.

### 2. Whole Numbers, Place Values & Numerals (`p4-math-numbers`) - 3 Modules, 37 Questions
- **Module 1: Place Values & Total Values up to Hundred Thousands (6 Digits)** (`p4-numbers-m1`, 12 Questions)
  - Place value periods up to Hundred Thousands (`100,000s`); Reading and writing 6-digit numbers up to $999,999$ in words and figures; Total values of digits and place value differences/sums.
- **Module 2: Expanding Numbers & Rounding Off to Nearest Tens, Hundreds & Thousands** (`p4-numbers-m2`, 13 Questions)
  - Value form expansion ($400,000 + 60,000...$) vs Place value form; Rounding off to nearest tens, hundreds, and thousands (`check-digit rule $\ge 5$ round up`); Carry-over rounding; Range bounds (`reverse rounding $N-5$ to $N+4$`).
- **Module 3: Roman Numerals up to C (100) and D (500)** (`p4-numbers-m3`, 12 Questions)
  - 7 core symbols (`I=1, V=5, X=10, L=50, C=100, D=500, M=1000`); Subtraction pairs (`IV=4, IX=9, XL=40, XC=90, CD=400`); Rule of three (`no symbol repeated 4 times`); Non-repeatable symbols (`V, L, D`); Converting Hindu-Arabic to Roman and vice versa.

### 3. Number Patterns, Operations & Divisibility (`p4-math-patterns`) - 3 Modules, 36 Questions
- **Module 1: Even/Odd Numbers, Prime/Composite & Divisibility Tests (2, 3, 5, 10)** (`p4-patterns-m1`, 12 Questions)
  - Even numbers (`divisible by 2`) vs Odd numbers; Smallest/even prime number (`2`); Prime vs Composite numbers (`more than 2 factors`); Divisibility tests for `2, 3, 5, 6, and 10`; Parity rules (`Odd + Odd = Even`).
- **Module 2: Factors, Multiples, LCM & Greatest Common Factor (GCF/HCF)** (`p4-patterns-m2`, 12 Questions)
  - Difference between Factors (`fit inside`) and Multiples (`multiply upwards`); Listing complete factor sets; Least Common Multiple (`LCM` of 2, 3, 4, 6); Greatest Common Factor (`GCF/HCF`); Co-prime numbers ($GCF=1$); Bell-ringing coincidence problems.
- **Module 3: Four Operations (Large Numbers, Multiplication, Division & BODMAS)** (`p4-patterns-m3`, 12 Questions)
  - Addition and subtraction of 6-digit numbers (`carrying/borrowing across zeroes`); Long multiplication (`3-digit by 2-digit $345 \times 24$`); Long division (`4-digit by 1-digit/2-digit with placeholder zeroes $1,040$`); Order of operations (`BODMAS`); Ugandan commercial word problems.

### 4. Fractions & Decimals (`p4-math-fractions`) - 3 Modules, 37 Questions
- **Module 1: Proper, Improper, Mixed & Equivalent Fractions** (`p4-fractions-m1`, 12 Questions)
  - Numerator (`top`) vs Denominator (`bottom`); Proper (`$<1$`), Improper (`$\ge 1$`), and Mixed fractions (`converting $11/4 = 2\frac{3}{4}$ and $3\frac{2}{5} = 17/5$`); Equivalent fractions (`multiplying/dividing top/bottom`); Reducing to lowest terms via GCF; Comparing fractions (`common denominators`).
- **Module 2: Addition & Subtraction of Fractions (Same & Simple Unlike Denominators)** (`p4-fractions-m2`, 12 Questions)
  - Adding and subtracting like fractions (`keep denominator unchanged`); Adding simple unlike fractions (`1/2 + 1/4 = 3/4`); Subtracting fractions from 1 whole (`$5/5 - 2/5 = 3/5$`); Mixed fraction addition/subtraction.
- **Module 3: Decimals (Tenths & Hundredths), Conversions & Simple Decimal Arithmetic** (`p4-fractions-m3`, 13 Questions)
  - Decimal place values (`Tenths $0.1$, Hundredths $0.01$`); Converting simple fractions to decimals (`$1/2=0.5, 1/4=0.25, 3/4=0.75, 1/10=0.1$`); Adding and subtracting simple decimals (`aligning decimal point and attaching trailing zeroes $14.50 + 3.82$`).

### 5. Geometry, Shapes & Mensuration (`p4-math-geometry`) - 3 Modules, 36 Questions
- **Module 1: 2D Shapes (Square, Rectangle, Triangle), Lines & Types of Angles** (`p4-geometry-m1`, 12 Questions)
  - Polygons (`Square 4 equal sides/$90^\circ$, Rectangle opposite sides equal/$90^\circ$, Triangle 3 sides/$180^\circ$`); Lines, Rays (`1 endpoint`), Line segments (`2 endpoints`); Angles (`Acute $<90^\circ$, Right $90^\circ \sqsubset$, Obtuse $91^\circ-179^\circ$, Straight $180^\circ$`); Protractor use; Clock face angles ($30^\circ\text{/hr}$).
- **Module 2: Perimeter & Area of Rectangles, Squares & Combined Flat Shapes** (`p4-geometry-m2`, 12 Questions)
  - Perimeter (`total outer boundary distance $2L+2W, 4S$ in $\text{cm/m}$`); Area (`surface space $L \times W, S^2$ in $\text{cm}^2/\text{m}^2$`); Working backwards from Area/Perimeter to find side lengths; Composite L-shape area subdivision and missing inner step edges.
- **Module 3: 3D Solid Shapes (Cube, Cuboid, Cylinder) & Simple Unit Cube Volume** (`p4-geometry-m3`, 12 Questions)
  - 2D flat vs 3D solid figures (`Length, Width, Height/Thickness`); Properties of Cube/Cuboid (`6 flat faces, 12 edges, 8 vertices`), Cylinder (`2 flat circular faces, 1 curved face`), Sphere (`1 continuous round surface, 0 edges, 0 corners`), Cone (`1 circular face, 1 curved face, 1 apex`); Volume (`$L \times W \times H$, $\text{Base Area} \times \text{Height}$ in $\text{cm}^3$`); Stacking unit cubes ($1\text{ cm}^3$).

### 6. Data Handling & Graphs (`p4-math-data`) - 2 Modules, 24 Questions
- **Module 1: Tally Marks (Bundles of 5) & Frequency Tables** (`p4-data-m1`, 12 Questions)
  - Tally mark recording (`groups of 5 ` `||||` `crossed diagonally`); Frequency (`numerical total count of occurrences $\sum f = N$`); Constructing frequency tables (`Item, Tally, Frequency`); Reading and completing data tables.
- **Module 2: Pictographs (Reading Keys/Scales), Bar Graphs & Finding the Mode** (`p4-data-m2`, 12 Questions)
  - Pictographs (`reading scale/key where 1 icon = 5, 10, or 20 items; half/quarter symbols`); Bar graphs (`uniform bar widths, equal spacing/gaps, Y-axis frequency scale, X-axis categories, half-interval grid values`); Mode (`modal category = most frequent item / tallest bar`).

### 7. Business Mathematics, Time & Money (`p4-math-business`) - 3 Modules, 36 Questions
- **Module 1: Ugandan Shillings (UGX), Unit Costs, Total Costs & Simple Shopping Bills** (`p4-business-m1`, 12 Questions)
  - UGX legal tender (`coins $50-1,000$ and banknotes $1,000-50,000$`); Unit cost vs Total cost (`$C_{\text{total}} = C_1 \times Q$`); Unitary method (`divide then multiply`); Completing multi-item shopping tables; Calculating exact change ($\text{Cash Tendered} - \text{Total Expenditure}$).
- **Module 2: Time (12-Hour Clock Reading, Duration & Hours-Minutes Conversions)** (`p4-business-m2`, 12 Questions)
  - Base-60 time system ($1\text{ hr}=60\text{ min}$; $1\text{ min}=60\text{ sec}$); Analogue clock reading (`half past 8:30, quarter past 8:15, quarter to 8:45`); Adding time (`regrouping $\ge 60\text{ min}$ to $+1\text{ hr}$`); Subtracting time (`borrowing $1\text{ hr}$ as $60\text{ min}$`); Elapsed duration across noon.
- **Module 3: Calendar Schedules (Days, Months, Leap Years) & Simple Rates/Distance** (`p4-business-m3`, 12 Questions)
  - Calendar rules (`Standard year 365 days, Leap year 366 days every 4 years on 29th Feb`); Days in months (`knuckle method: 31 days Jan/Mar/May/Jul/Aug/Oct/Dec vs 30 days Apr/Jun/Sep/Nov vs 28/29 Feb`); Multiples of 7 ($+7, +14\text{ days}$ land on same day of week); Distance, Speed, and Time (`$D = S \times T, S = D/T, T = D/S$`).

---

## Technical & Architecture Verification
- **Exact Data Placement**: Embedded directly into `TOPICS` in `/home/user/elimu/src/lib/data.ts` (`p4-math-sets` through `p4-math-business`).
- **Zero Syntax Errors**: Checked against all TypeScript strict interface boundaries (`BaseQuestion & QuestionData`).
- **Pre-rendering Check**: `npm run build` compiled all 11 static routes (`/`, `/home`, `/subjects`, `/module`, `/practice`, `/parent`, `/onboarding`, etc.) without warning.

This question bank stands ready for classroom deployment across all primary school learners, teachers, and parents in Uganda.
