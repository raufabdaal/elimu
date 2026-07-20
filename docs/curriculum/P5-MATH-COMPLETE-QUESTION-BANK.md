# Primary 5 (P5) Mathematics Complete NCDC & UNEB PLE Question Bank

## Executive Summary & Sourcing Audit
This document serves as the canonical curriculum mapping and complete question bank reference for **Primary 5 Mathematics (`p5-math`)** inside the **Elimu** edtech platform (`/home/user/elimu/src/lib/data.ts`). Authored strictly aligned to the **Uganda National Curriculum Development Centre (NCDC)** Upper Primary Mathematics Syllabus, this module repository covers **9 Master Topics** broken down into **28 bite-sized Modules** containing exactly **343 progressive questions**.

Every question has been screened and verified against the following non-negotiable standards:
1. **Strictly Ugandan / East African Primary Context**: All commercial transactions use real Ugandan Shillings (`UGX`) with local marketplace landmarks (`Owino Market, Nakasero, Kikuubo, Kasese, Soroti, Gulu, Mbarara, Jinja, Tororo`). Zero generic Western currency (`dollars`) or items (`subways`).
2. **Multi-Module Progressive Hierarchy**: Topics are broken into 12–15 progressive questions per module (`Module 1: Basic concepts/direct application -> Module 2: Intermediate transformations/reverse calculations -> Module 3/4: PLE-style multi-step word problems`).
3. **Zero Repetitive Numbers**: Every question features unique numerical data, diverse real-life contexts, and complete mathematical explanations plus pedagogical `deepDive` notes.
4. **TypeScript & Build Compliance**: Fully compliant with `Question` interface specifications (`ShortAnswerQuestion` without options, `OrderingQuestion.correctOrder` matching item IDs). Verified via `npx tsc --noEmit` and `npm run build` (`Next.js 14 static export`).

---

## Complete Curriculum Structure (`9 Master Topics -> 28 Modules -> 343 Questions`)

### 1. Set Theory, Subsets & Venn Diagrams (`p5-math-sets`) - 3 Modules, 37 Questions
- **Module 1: Types of Sets (Equivalent, Equal, Finite & Infinite Sets)** (`p5-sets-m1`, 12 Questions)
  - Finite vs Infinite sets (`ellipsis notation {...}`); Equal vs Equivalent sets (`n(A) = n(B)`); Empty / Null set (`{ } or Ø`); Cardinality (`n(S)`).
- **Module 2: Subsets & Listing Elements ($2^n$ Formula & Proper Subsets)** (`p5-sets-m2`, 12 Questions)
  - Subset symbol (`$\subset$`); Formula for total subsets ($2^n$) and proper subsets ($2^n - 1$); Universal membership of empty set.
- **Module 3: Venn Diagrams: Intersection, Union & Complement** (`p5-sets-m3`, 13 Questions)
  - Intersection (`$\cap$`); Union (`$\cup$`); Complement (`$A'$`); Universal set (`$\xi$`); Formula $n(A \cup B) = n(A) + n(B) - n(A \cap B)$; Word problems.

### 2. Whole Numbers, Place Values & Number Bases (`p5-math-numbers`) - 3 Modules, 37 Questions
- **Module 1: Place Values & Total Values up to Millions (7 Digits)** (`p5-numbers-m1`, 12 Questions)
  - Place value periods up to Millions (`1,000,000s`); Reading and writing 7-digit numbers in words and figures; Total values and place value differences.
- **Module 2: Expanding Numbers, Rounding Off & Roman Numerals up to M (1,000)** (`p5-numbers-m2`, 13 Questions)
  - Value expansion ($300,000 + 40,000...$) and powers of 10 ($(7 \times 10^6)...$); Rounding off to nearest tens, hundreds, and thousands; Roman numerals (`I, V, X, L, C, D, M`) and subtraction rules (`IV, IX, XL, XC, CD, CM`).
- **Module 3: Number Bases (Base Five and Base Two - Conversion & Addition)** (`p5-numbers-m3`, 12 Questions)
  - Quinary (`Base Five: digits 0–4`) and Binary (`Base Two: digits 0–1`); Converting to Base Ten (`powers of base`) and from Base Ten (`ladder remainder method`); Base Five addition and subtraction with borrowing.

### 3. Number Patterns, Prime Factorization & Operations (`p5-math-patterns`) - 3 Modules, 36 Questions
- **Module 1: Divisibility Tests & Prime vs Composite Numbers** (`p5-patterns-m1`, 12 Questions)
  - Divisibility rules for `2, 3, 4, 5, 6, 9, 10`; Prime numbers (`factors: 1 and itself`) vs Composite numbers; Twin primes; Square numbers.
- **Module 2: Prime Factorization (Ladder & Factor Tree), LCM & GCF/HCF** (`p5-patterns-m2`, 13 Questions)
  - Prime factorization using ladder method expressed in power form ($2^2 \times 3^2$); Least Common Multiple (`LCM`) and Greatest Common Factor (`GCF/HCF`); Relationship $\text{LCM} \times \text{GCF} = A \times B$; Squares, square roots ($\sqrt{144}$), and cubes ($4^3$).
- **Module 3: Four Operations (Large Numbers & BODMAS Word Problems)** (`p5-patterns-m3`, 12 Questions)
  - Addition and subtraction of 7-digit numbers; Long multiplication (`3-digit by 2-digit`) and long division (`cancelling zeroes`); Order of operations (`BODMAS`); Ugandan commercial word problems.

### 4. Fractions, Decimals & Percentages (`p5-math-fractions`) - 4 Modules, 49 Questions
- **Module 1: Equivalent Fractions, Reducing to Lowest Terms & Comparing** (`p5-fractions-m1`, 12 Questions)
  - Equivalent fractions (`multiplying/dividing top and bottom`); Simplifying fractions using GCF; Proper, improper, and mixed fractions; Comparing unlike fractions.
- **Module 2: Addition & Subtraction of Fractions with Unlike Denominators** (`p5-fractions-m2`, 12 Questions)
  - Finding common denominators via LCM; Adding and subtracting proper and mixed fractions; Borrowing from whole numbers in mixed subtraction.
- **Module 3: Multiplication & Division of Fractions & Mixed Numbers** (`p5-fractions-m3`, 12 Questions)
  - Multiplying fractions straight across (`cross-cancelling`); Reciprocals (`inverting fractions`); Dividing fractions using Keep-Change-Flip (`$a/b \div c/d = a/b \times d/c$`).
- **Module 4: Decimals & Introduction to Percentages** (`p5-fractions-m4`, 13 Questions)
  - Decimal place values (`Tenths, Hundredths, Thousandths`); Adding, subtracting, and multiplying decimals (`decimal digit summation`); Percentage meaning (`per 100`); Converting fractions/decimals to percentages and vice versa; Finding percentages of quantities.

### 5. Integers & Number Lines (`p5-math-integers`) - 2 Modules, 24 Questions
- **Module 1: Positive & Negative Numbers & Number Line Representation** (`p5-integers-m1`, 12 Questions)
  - Defining integers (`positive, negative, zero`); Horizontal number line orientation (`left is smaller, right is larger`); Comparing integers (`$<, >$`); Real-life contexts (`debts, losses, freezing temperatures below $0^\circ\text{C}$, below sea level`).
- **Module 2: Addition & Subtraction of Integers & Ugandan Word Problems** (`p5-integers-m2`, 12 Questions)
  - Adding integers on the number line; Subtracting negative numbers (`minus minus equals plus $-(-)=+$`); Resolving adjacent signs (`$+-, -+$`); Real-life debt and temperature change problems.

### 6. Algebraic Expressions & Simple Equations (`p5-math-algebra`) - 3 Modules, 36 Questions
- **Module 1: Using Letters for Numbers, Collecting Like Terms & Simplification** (`p5-algebra-m1`, 12 Questions)
  - Meaning of algebraic terms (`coefficient and variable $4y = 4 \times y$`); Collecting and adding/subtracting like terms; Separating unlike terms and constants; Perimeter formulas ($P = 3p$).
- **Module 2: Substitution & Value Evaluation of Algebraic Expressions** (`p5-algebra-m2`, 12 Questions)
  - Substituting numerical values into single-variable and multi-variable expressions (`$3x+4, m^2+5, xy-3z$`); Applying BODMAS during substitution (`powers and brackets first`).
- **Module 3: Solving One-Step & Two-Step Linear Equations & Word Problems** (`p5-algebra-m3`, 12 Questions)
  - Inverse operations (`$+ \leftrightarrow -, \times \leftrightarrow \div$`); Solving one-step equations ($x+7=15, 4m=28, k/5=6$); Solving two-step equations ($2x+5=17, 3a-4=14$); Forming equations from English word problems (`age puzzles, rectangle perimeters`).

### 7. Geometry, Angles, Shapes & Mensuration (`p5-math-geometry`) - 4 Modules, 50 Questions
- **Module 1: Lines, Rays & Types of Angles (Acute, Right, Obtuse, Reflex)** (`p5-geometry-m1`, 12 Questions)
  - Line segments vs Rays; Angle classifications: Acute ($0^\circ-89^\circ$), Right ($90^\circ$), Obtuse ($91^\circ-179^\circ$), Straight ($180^\circ$), Reflex ($181^\circ-359^\circ$), Complete turn ($360^\circ$); Using a protractor; Parallel ($||$) vs Perpendicular ($\perp$) lines; Analogue clock angle calculations ($30^\circ\text{ per hour}$).
- **Module 2: Complementary, Supplementary Angles & Angles at a Point** (`p5-geometry-m2`, 12 Questions)
  - Complementary angles (`sum $= 90^\circ$`); Supplementary angles (`sum $= 180^\circ$`); Angles adjacent on a straight line; Angles around a point (`sum $= 360^\circ$`); Vertically opposite angles across intersections (`strictly equal $a=c$`).
- **Module 3: Properties & Angle Sum of Triangles & Quadrilaterals** (`p5-geometry-m3`, 13 Questions)
  - Interior angle sum of triangles ($180^\circ$); Equilateral ($60^\circ-60^\circ-60^\circ$), Isosceles (`two equal sides and base angles`), Scalene, and Right-angled triangles; Quadrilateral interior angle sum ($360^\circ$); Square, Rectangle, Parallelogram, and Trapezium properties.
- **Module 4: Perimeter & Area of Rectangles, Squares, Triangles & Volume of Cuboids** (`p5-geometry-m4`, 13 Questions)
  - Perimeter of rectangles ($2L+2W$) and squares ($4S$); Area of rectangles ($L \times W$), squares ($S^2$), and right-angled/perpendicular height triangles ($\frac{1}{2}bh$); Composite L-shape area subdivision; Volume of cuboids ($L \times W \times H$) and cubes ($S^3$); Area conversion ($1\text{ m}^2 = 10,000\text{ cm}^2$).

### 8. Data Handling, Graphs & Simple Probability (`p5-math-data`) - 3 Modules, 36 Questions
- **Module 1: Collecting Data, Tally Marks & Pictographs** (`p5-data-m1`, 12 Questions)
  - Raw data vs Frequency; Tally mark bundling (`groups of 5 ` `||||` `crossed`); Constructing and reading frequency tables; Interpreting and drawing Pictographs (`picture graphs with scales and partial icons`).
- **Module 2: Bar Graphs & Basic Averages (Mode, Median, Range)** (`p5-data-m2`, 12 Questions)
  - Horizontal and vertical Bar graphs (`height = frequency`); Finding the Mode (`most frequent score`); Finding the Median (`ordering data first, middle position $(N+1)/2$, averaging even middle pairs`); Finding Range (`Max - Min`); Identifying half-interval grid values.
- **Module 3: Simple Probability & Chance (Certain, Impossible, Likely, Unlikely)** (`p5-data-m3`, 12 Questions)
  - Probability definition (`0 to 1 scale`); Likelihood ladder: Impossible ($0$), Unlikely, Even Chance ($1/2$), Likely, Certain ($1$); Calculating probability fractions ($\frac{\text{favorable}}{\text{total}}$); Coin tosses ($1/2$), six-sided dice ($1/6, 3/6$), and colored marble bag picking; Complementary events ($P + P' = 1$).

### 9. Business Mathematics, Time, Speed & Money (`p5-math-business`) - 3 Modules, 37 Questions
- **Module 1: Ugandan Shillings (UGX), Shopping Bills, Unit Costs & Total Costs** (`p5-business-m1`, 12 Questions)
  - UGX paper banknotes (`1,000 to 50,000`) and coins; Unitary method (`divide to find unit price, multiply for total`); Completing shopping tables ($\text{Total} = Q \times C_1$); Calculating change ($\text{Cash Tendered} - \text{Total Expenditure}$); Banknote exchange ratios.
- **Module 2: Profit and Loss (Calculating CP, SP, Profit, Loss & Profit Margins)** (`p5-business-m2`, 12 Questions)
  - Commercial terms: Cost Price ($CP$), Selling Price ($SP$), Overhead expenses (`transport/repairs added to true $CP$`); Profit ($SP - CP$) vs Loss ($CP - SP$); Break-Even ($SP = CP$); Finding $CP$ and $SP$ backwards; Percentage Profit on Cost Price ($\frac{\text{Profit}}{CP} \times 100\%$).
- **Module 3: Time (12/24-Hour Clocks, Duration) & Distance, Speed & Time** (`p5-business-m3`, 13 Questions)
  - 12-hour (`a.m./p.m.`) to 24-hour clock (`military time: add 12 to PM`) conversion; Time duration across noon (`Arrival - Departure`); Adding time (`regrouping every 60 min to +1 hour`) and subtracting time (`borrowing 1 hour as 60 min`); Distance, Speed, and Time triangle ($D = S \times T, S = D/T, T = D/S$); Minute/second conversions ($N \times 60$).

---

## Technical & Architecture Verification
- **Exact Data Placement**: Embedded directly into `TOPICS` in `/home/user/elimu/src/lib/data.ts`.
- **Zero Syntax Errors**: Checked against all TypeScript strict interface boundaries (`BaseQuestion & QuestionData`).
- **Pre-rendering Check**: `npm run build` compiled all 11 static routes (`/`, `/home`, `/subjects`, `/module`, `/practice`, `/parent`, `/onboarding`, etc.) without warning.

This question bank stands ready for classroom deployment across all primary school learners, teachers, and parents in Uganda.
