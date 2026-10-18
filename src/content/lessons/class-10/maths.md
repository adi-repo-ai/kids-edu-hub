=== real-numbers ===
## The big idea
Every whole number greater than 1 is built from **prime numbers**, much like every word is built from letters. This chapter uses that one idea to find HCF and LCM quickly and to prove that numbers like √2 can never be written as a fraction.

> [!KEY] Real numbers
> Real numbers = rational numbers (can be written as p/q, q ≠ 0) + irrational numbers (cannot). Every point on the number line is a real number.

## The Fundamental Theorem of Arithmetic
**Every composite number can be written as a product of primes, and this factorisation is unique apart from the order of the factors.**

For example, 3600 = 2⁴ × 3² × 5². However you start breaking 3600 down (36 × 100, or 60 × 60, or 2 × 1800…), you always end with four 2s, two 3s and two 5s.

> [!EXAMPLE] Prime factorise 4410
> Divide by the smallest prime that works, again and again:
> 4410 → 2 × 2205 → 2205 = 3 × 735 → 735 = 3 × 245 → 245 = 5 × 49 → 49 = 7 × 7.
> So **4410 = 2 × 3² × 5 × 7²**.

## HCF and LCM using prime factors
Write each number as a product of primes, then:

- **HCF** = product of the **smallest** power of each **common** prime.
- **LCM** = product of the **greatest** power of **every** prime that appears.

> [!EXAMPLE] Find the HCF and LCM of 96 and 404
> 96 = 2⁵ × 3 and 404 = 2² × 101.
> Common prime: 2, smallest power 2². So **HCF = 4**.
> LCM = 2⁵ × 3 × 101 = **9696**.
> Check: HCF × LCM = 4 × 9696 = 38784 = 96 × 404 ✓

> [!FORMULA] For any two positive integers a and b
> HCF(a, b) × LCM(a, b) = a × b

> [!MISTAKE] This product rule is only for two numbers
> For three numbers, HCF × LCM is **not** equal to the product of the numbers. Use prime factorisation instead.

## Why does 6ⁿ never end in 0?
A number ends in 0 only if it is divisible by 10 = 2 × 5, so its prime factorisation must contain 5. But 6ⁿ = 2ⁿ × 3ⁿ. By uniqueness of factorisation there is no 5 anywhere, so **6ⁿ can never end in 0**. This is a typical 2-mark board question.

## Proving √2 is irrational
We use **proof by contradiction**: assume the opposite and show it leads to something impossible.

1. Suppose √2 is rational, so √2 = a/b where a and b are co-prime (no common factor other than 1).
2. Squaring: 2 = a²/b², so **a² = 2b²**. So a² is even, which means **a is even**. Write a = 2c.
3. Then 4c² = 2b², so **b² = 2c²**, which means **b is even** too.
4. Now a and b are both even, so they share the factor 2. This contradicts "co-prime".
5. So our assumption was wrong: **√2 is irrational**.

The same method proves √3 and √5 are irrational (replace 2 by 3 or 5 and use "if p divides a², then p divides a" for a prime p).

> [!TIP] Building on a known irrational
> To show 5 − √3 is irrational, assume 5 − √3 = a/b. Then √3 = 5 − a/b, which is rational, a contradiction because √3 is irrational. The sum, difference, product or quotient of a non-zero rational and an irrational number is irrational.

## Quick recap
- Prime factorisation is unique (Fundamental Theorem of Arithmetic).
- HCF: smallest powers of common primes. LCM: greatest powers of all primes.
- HCF × LCM = product, for two numbers only.
- Proof by contradiction shows √2, √3, √5 are irrational.

--- quiz ---
Q: The prime factorisation of 140 is
- 2 × 7 × 10
* 2² × 5 × 7
- 2 × 5 × 14
- 2³ × 5 × 7
> 140 = 2 × 70 = 2 × 2 × 35 = 2² × 5 × 7. The other options include composite numbers or the wrong power.

Q: If HCF(26, 91) = 13, then LCM(26, 91) is
- 91
- 2366
* 182
- 13
> LCM = (26 × 91) ÷ 13 = 2366 ÷ 13 = 182.

Q: Which of these is irrational?
- √16
- 0.375
- 22/7
* 3 + √5
> A rational number plus an irrational number is irrational. √16 = 4, 0.375 = 3/8 and 22/7 are all rational.

Q: Why can 4ⁿ never end with the digit 0?
- Because 4 is even
* Because its prime factorisation has no 5
- Because 4ⁿ is always a perfect square
- Because n is a natural number
> To end in 0 a number must be divisible by 2 and 5. 4ⁿ = 2²ⁿ has no factor 5.

Q: HCF of 2³ × 3² × 5 and 2² × 3³ × 7 is
* 2² × 3² = 36
- 2³ × 3³ = 216
- 2 × 3 = 6
- 2³ × 3³ × 5 × 7
> Take the smaller power of each common prime: 2² and 3². 5 and 7 are not common.

Q: In the proof that √2 is irrational, we start by assuming √2 = a/b where a and b are
- both even
- both prime
* co-prime
- equal
> We assume the fraction is in lowest terms (co-prime), then show both a and b must be even, which is a contradiction.

=== polynomials ===
## What is a polynomial?
A **polynomial** in x is an expression like 3x² − 5x + 2, where the powers of x are whole numbers (0, 1, 2, …). The highest power is its **degree**.

| Degree | Name | General form | Example |
|---|---|---|---|
| 1 | Linear | ax + b | 2x − 3 |
| 2 | Quadratic | ax² + bx + c | x² − 5x + 6 |
| 3 | Cubic | ax³ + bx² + cx + d | x³ − 1 |

> [!KEY] Zero of a polynomial
> A number k is a **zero** of p(x) if p(k) = 0. For x² − 5x + 6, p(2) = 4 − 10 + 6 = 0, so 2 is a zero (and so is 3).

## Seeing zeroes on a graph
The zeroes of p(x) are the **x-coordinates of the points where the graph of y = p(x) meets the x-axis**.

- A linear polynomial (straight line) cuts the x-axis exactly **once**: one zero.
- A quadratic polynomial (a U-shaped **parabola**) can meet the x-axis at **2, 1 or 0** points.
- A cubic polynomial has **at most 3** zeroes.

> [!TIP] Reading a graph question
> Count where the curve touches or crosses the x-axis. A curve that never meets the x-axis has no real zeroes. A polynomial of degree n has at most n zeroes.

## Zeroes and coefficients of a quadratic
If α and β are the zeroes of ax² + bx + c, then:

> [!FORMULA] Relationship between zeroes and coefficients
> α + β = −b/a    and    αβ = c/a

> [!EXAMPLE] Find the zeroes of x² + 7x + 10 and verify the relationship
> Split the middle term: x² + 5x + 2x + 10 = x(x + 5) + 2(x + 5) = (x + 2)(x + 5).
> Zeroes: **−2 and −5**.
> Sum = −7 and −b/a = −7/1 ✓. Product = 10 and c/a = 10/1 ✓.

## Building a quadratic from its zeroes
If you know the sum S and product P of the zeroes, a quadratic polynomial is:

> [!FORMULA] Quadratic with zero-sum S and zero-product P
> k(x² − Sx + P), for any non-zero constant k

> [!EXAMPLE] Sum of zeroes = −3, product = 2
> x² − (−3)x + 2 = **x² + 3x + 2**.

> [!MISTAKE] Watch the sign of b
> The sum of zeroes is **−b/a**, not b/a. For 2x² − 8x + 6, the sum is −(−8)/2 = 4.

## Cubic polynomials (for reading)
For ax³ + bx² + cx + d with zeroes α, β, γ: α + β + γ = −b/a, αβ + βγ + γα = c/a and αβγ = −d/a.

## Quick recap
- Degree = highest power. Zeroes = where the graph meets the x-axis.
- A degree-n polynomial has at most n zeroes.
- Quadratic: α + β = −b/a, αβ = c/a.
- Quadratic from zeroes: x² − (sum)x + (product).

--- quiz ---
Q: The zeroes of x² − 2x − 8 are
- 2 and −4
* 4 and −2
- −4 and −2
- 4 and 2
> x² − 4x + 2x − 8 = (x − 4)(x + 2). So x = 4 or x = −2.

Q: The graph of y = p(x) meets the x-axis at 3 points. The number of zeroes of p(x) is
- 1
- 2
* 3
- cannot be found
> Each meeting point with the x-axis gives one zero.

Q: A quadratic polynomial whose sum of zeroes is 4 and product is 1 is
- x² + 4x + 1
* x² − 4x + 1
- x² − x + 4
- 4x² + x − 1
> Use x² − (sum)x + (product) = x² − 4x + 1.

Q: For 3x² − 6x + 9, the sum of the zeroes is
- −2
* 2
- 3
- −3
> Sum = −b/a = −(−6)/3 = 2.

Q: The maximum number of zeroes a cubic polynomial can have is
- 1
- 2
* 3
- 4
> A polynomial of degree n has at most n zeroes.

Q: If one zero of x² − 5x + k is 2, then k equals
- 4
* 6
- −6
- 10
> p(2) = 4 − 10 + k = 0, so k = 6.

=== pair-of-linear-equations-in-two-variables ===
## The big idea
An equation like 2x + 3y = 12 has infinitely many solutions, and its graph is a straight line. A **pair** of such equations asks: which (x, y) satisfies **both** at once? Geometrically, that is where the two lines meet.

> [!KEY] Three possibilities
> Two lines in a plane either **intersect** at one point (one solution), are **parallel** (no solution) or **coincide** (infinitely many solutions).

## Checking consistency without drawing
For a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0, compare the ratios:

| Comparison | Lines | Solutions | Pair is |
|---|---|---|---|
| a₁/a₂ ≠ b₁/b₂ | Intersecting | Exactly one | Consistent |
| a₁/a₂ = b₁/b₂ = c₁/c₂ | Coincident | Infinitely many | Consistent (dependent) |
| a₁/a₂ = b₁/b₂ ≠ c₁/c₂ | Parallel | None | Inconsistent |

> [!EXAMPLE] Is the pair x + 2y − 4 = 0 and 2x + 4y − 12 = 0 consistent?
> a₁/a₂ = 1/2, b₁/b₂ = 2/4 = 1/2, c₁/c₂ = −4/−12 = 1/3.
> The first two ratios are equal but differ from the third, so the lines are **parallel**: no solution, **inconsistent**.

## Graphical method
1. For each equation, find two or three points (make a small table of x and y values).
2. Plot both lines on the same axes.
3. Read the coordinates of the intersection point.

This works well for neat whole-number answers but is slow and imprecise otherwise, which is why we also learn algebraic methods.

## Substitution method
1. From one equation, express one variable in terms of the other, e.g. y = 7 − x.
2. Substitute into the other equation to get one equation in one variable.
3. Solve, then substitute back.

> [!EXAMPLE] Solve x + y = 14 and x − y = 4
> From the first, y = 14 − x. Substitute: x − (14 − x) = 4 ⇒ 2x = 18 ⇒ **x = 9**, so **y = 5**.

## Elimination method
Multiply the equations so that one variable has equal (or opposite) coefficients, then add or subtract to eliminate it.

> [!EXAMPLE] Solve 3x + 4y = 10 and 2x − 2y = 2
> Multiply the second by 2: 4x − 4y = 4. Add to the first: 7x = 14 ⇒ **x = 2**.
> Then 2(2) − 2y = 2 ⇒ **y = 1**.

> [!TIP] Word problems
> Always define your variables first ("Let the cost of one pen be ₹x…"), turn each sentence into an equation, solve, and **answer in words with units**.

> [!MISTAKE] Sign slips while subtracting
> When subtracting equations, change the sign of **every** term of the second equation, including the constant.

## Quick recap
- Each linear equation is a line; the solution of the pair is the meeting point.
- Use the ratios a₁/a₂, b₁/b₂, c₁/c₂ to decide: one, none or infinitely many solutions.
- Algebraic methods: substitution and elimination.

--- quiz ---
Q: The pair x + y = 5 and 2x + 2y = 10 has
- no solution
- a unique solution
* infinitely many solutions
- exactly two solutions
> All three ratios equal 1/2, so the lines coincide.

Q: For what value of k will 3x + y = 1 and (2k − 1)x + (k − 1)y = 2k + 1 have no solution?
- 1
* 2
- 3
- −2
> No solution needs 3/(2k − 1) = 1/(k − 1) ≠ 1/(2k + 1). 3(k − 1) = 2k − 1 gives k = 2, and then 1/(k − 1) = 1 ≠ 1/5.

Q: Solve x + y = 14 and x − y = 4.
- x = 10, y = 4
* x = 9, y = 5
- x = 8, y = 6
- x = 7, y = 7
> Adding the equations: 2x = 18, so x = 9 and y = 5.

Q: Two lines are parallel. The pair of equations is
- consistent
* inconsistent
- dependent
- always solvable
> Parallel lines never meet, so there is no solution: the pair is inconsistent.

Q: If 2x + 3y = 7 and 3x + 2y = 8, then x + y equals
- 2
* 3
- 4
- 5
> Adding: 5x + 5y = 15, so x + y = 3.

=== quadratic-equations ===
## The big idea
A **quadratic equation** has the form **ax² + bx + c = 0**, where a ≠ 0. Areas, projectile paths and many speed–time problems lead to quadratics. A quadratic has **at most two** roots.

> [!KEY] Root of a quadratic
> α is a root of ax² + bx + c = 0 if aα² + bα + c = 0. The roots of the equation are the zeroes of the polynomial ax² + bx + c.

## Solving by factorisation (splitting the middle term)
Find two numbers whose **product is ac** and **sum is b**, then split bx and factor by grouping.

> [!EXAMPLE] Solve 2x² − 5x + 3 = 0
> ac = 6, b = −5. The numbers −2 and −3 work (product 6, sum −5).
> 2x² − 2x − 3x + 3 = 2x(x − 1) − 3(x − 1) = (2x − 3)(x − 1) = 0.
> So **x = 3/2 or x = 1**.

## The quadratic formula
When factorising is hard, use the formula. It always works.

> [!FORMULA] Quadratic formula
> x = [−b ± √(b² − 4ac)] / 2a

> [!EXAMPLE] Solve x² + 4x − 5 = 0 using the formula
> a = 1, b = 4, c = −5. b² − 4ac = 16 + 20 = 36.
> x = (−4 ± 6)/2, so **x = 1 or x = −5**.

## Nature of roots: the discriminant
The expression **D = b² − 4ac** (the discriminant) tells you what kind of roots to expect without solving.

| Value of D | Nature of roots |
|---|---|
| D > 0 | Two distinct real roots |
| D = 0 | Two equal real roots (x = −b/2a) |
| D < 0 | No real roots |

> [!EXAMPLE] Find k so that kx² − 6x + 1 = 0 has equal roots
> Equal roots ⇒ D = 0: 36 − 4k = 0 ⇒ **k = 9**.

## Word problems
> [!EXAMPLE] The product of two consecutive positive integers is 306. Find them.
> Let them be x and x + 1. x(x + 1) = 306 ⇒ x² + x − 306 = 0 ⇒ (x + 18)(x − 17) = 0.
> x = 17 (reject −18, it is not positive). The integers are **17 and 18**.

> [!MISTAKE] Forgetting to check the context
> A length, age or speed cannot be negative. Always reject roots that don't fit the situation, and say why.

## Quick recap
- Standard form ax² + bx + c = 0, a ≠ 0.
- Factorise by splitting the middle term, or use the quadratic formula.
- D = b² − 4ac decides the nature of roots.

--- quiz ---
Q: Which of these is a quadratic equation?
- x + 1/x = 2 (x ≠ 0) written as it is
* (x + 1)² = 2(x − 3)
- x³ − 4x² = 1
- (x + 2)³ = x³ − 4
> (x + 1)² = 2(x − 3) simplifies to x² + 5 = 0, which has degree 2.

Q: The roots of x² − 3x − 10 = 0 are
* 5 and −2
- −5 and 2
- 5 and 2
- −5 and −2
> x² − 5x + 2x − 10 = (x − 5)(x + 2).

Q: The discriminant of 2x² − 4x + 3 = 0 is
- 8
- 40
* −8
- 16
> D = 16 − 24 = −8, so there are no real roots.

Q: For which value of k does x² + kx + 9 = 0 have equal roots?
- 3
* 6 (or −6)
- 9
- 0
> D = k² − 36 = 0, so k = ±6.

Q: If one root of x² + 5x + k = 0 is −2, then k is
- 2
- 4
* 6
- −6
> 4 − 10 + k = 0 ⇒ k = 6.

=== arithmetic-progressions ===
## The big idea
An **arithmetic progression (AP)** is a list of numbers where each term is obtained by adding the same fixed number, the **common difference d**, to the previous term. Saving ₹50 more each month, seats in successive rows, taxi fares per kilometre: all APs.

> [!KEY] AP in one line
> a, a + d, a + 2d, a + 3d, … where a is the first term and d = a₂ − a₁ = a₃ − a₂ = …

## The nth term
> [!FORMULA] General term
> aₙ = a + (n − 1)d

> [!EXAMPLE] Which term of the AP 21, 18, 15, … is −81?
> a = 21, d = −3. 21 + (n − 1)(−3) = −81 ⇒ (n − 1) = 34 ⇒ **n = 35**.

The nth term **from the end** of an AP with last term l is l − (n − 1)d.

## Sum of the first n terms
> [!FORMULA] Sum of n terms
> Sₙ = n/2 [2a + (n − 1)d] = n/2 (a + l), where l is the last term

The story behind it: young Gauss added 1 + 2 + … + 100 by pairing the first and last terms (1 + 100), second and second-last (2 + 99)… there are 50 pairs of 101, so the sum is 5050.

> [!EXAMPLE] Find the sum of the first 22 terms of 8, 3, −2, …
> a = 8, d = −5, n = 22. S₂₂ = 11[16 + 21 × (−5)] = 11 × (−89) = **−979**.

> [!TIP] Useful facts
> The sum of the first n natural numbers is n(n + 1)/2.
> aₙ = Sₙ − Sₙ₋₁, which lets you find a term when you know the sum formula.

> [!MISTAKE] Mixing up n and aₙ
> n is the **position** of a term (always a positive whole number); aₙ is the **value** of that term.

## Word problem
> [!EXAMPLE] A sum of ₹700 is to be used for seven prizes, each ₹20 less than the previous. Find each prize.
> S₇ = 700, d = −20: 7/2 [2a + 6(−20)] = 700 ⇒ 2a − 120 = 200 ⇒ a = 160.
> Prizes: **₹160, 140, 120, 100, 80, 60, 40**.

## Quick recap
- d is the constant difference between consecutive terms.
- aₙ = a + (n − 1)d.
- Sₙ = n/2 [2a + (n − 1)d] = n/2 (a + l).

--- quiz ---
Q: The common difference of the AP 3, 1, −1, −3, … is
- 2
* −2
- 4
- −4
> 1 − 3 = −2.

Q: The 11th term of the AP −3, −1/2, 2, … is
- 19
* 22
- 28
- 25
> d = 2.5. a₁₁ = −3 + 10 × 2.5 = 22.

Q: How many two-digit numbers are divisible by 3?
- 29
* 30
- 31
- 33
> 12, 15, …, 99: n = (99 − 12)/3 + 1 = 30.

Q: The sum 1 + 2 + 3 + … + 50 equals
- 1250
* 1275
- 1300
- 2550
> n(n + 1)/2 = 50 × 51 / 2 = 1275.

Q: If Sₙ = 3n² + 2n for an AP, its first term is
- 3
* 5
- 8
- 2
> a₁ = S₁ = 3 + 2 = 5.

=== triangles ===
## The big idea
Two figures are **congruent** if they have the same shape and size. They are **similar** if they have the same **shape** but not necessarily the same size, like a photo and its enlargement. Similarity lets us find heights of trees, widths of rivers and distances we cannot measure directly.

> [!KEY] Similar triangles
> △ABC ~ △DEF means: corresponding angles are equal (∠A = ∠D, ∠B = ∠E, ∠C = ∠F) **and** corresponding sides are in the same ratio: AB/DE = BC/EF = CA/FD.

All circles are similar. All squares are similar. All equilateral triangles are similar. But two rectangles or two rhombuses need not be.

## Basic Proportionality Theorem (Thales' theorem)
> [!KEY] BPT
> If a line is drawn parallel to one side of a triangle to intersect the other two sides at distinct points, it divides those two sides in the **same ratio**: if DE ∥ BC in △ABC, then AD/DB = AE/EC.

Its **converse** is also true: if a line divides two sides of a triangle in the same ratio, it is parallel to the third side. The proof of BPT (using areas of triangles with equal heights) is a frequent 5-mark question.

> [!EXAMPLE] In △ABC, DE ∥ BC, AD = 1.5 cm, DB = 3 cm and AE = 1 cm. Find EC.
> By BPT, AD/DB = AE/EC ⇒ 1.5/3 = 1/EC ⇒ **EC = 2 cm**.

## Criteria for similarity
| Criterion | What must match |
|---|---|
| AAA (or AA) | Two angles of one triangle equal two angles of the other |
| SSS | All three sides in the same ratio |
| SAS | One angle equal and the sides including it in the same ratio |

> [!TIP] AA is enough
> If two angles match, the third must match too (angle sum is 180°). So in proofs, finding two equal angles is usually the quickest route.

> [!EXAMPLE] A 6 m pole casts a 4 m shadow; at the same time a tower casts a 28 m shadow. Find the tower's height.
> The sun's rays make equal angles, so the triangles are similar (AA).
> h/28 = 6/4 ⇒ **h = 42 m**.

> [!MISTAKE] Writing vertices in the wrong order
> In △ABC ~ △PQR the order matters: A ↔ P, B ↔ Q, C ↔ R. Pair the sides in that same order.

## Quick recap
- Similar = same shape; equal angles and proportional sides.
- BPT: a line parallel to one side divides the other two proportionally (and its converse).
- Tests: AA, SSS, SAS.

--- quiz ---
Q: Which pair is always similar?
- Two rectangles
- Two rhombuses
* Two equilateral triangles
- Two isosceles triangles
> Every equilateral triangle has 60° angles, so any two are similar (AA).

Q: In △ABC, DE ∥ BC with AD = 2 cm, DB = 3 cm and AE = 4 cm. Then EC is
- 5 cm
* 6 cm
- 8 cm
- 2.67 cm
> 2/3 = 4/EC ⇒ EC = 6 cm.

Q: If △ABC ~ △PQR with AB/PQ = 2/3, then BC/QR is
* 2/3
- 3/2
- 4/9
- 1
> In similar triangles all corresponding sides are in the same ratio.

Q: Two triangles have two pairs of equal angles. They are
- congruent
* similar
- neither
- right-angled
> AA similarity criterion.

Q: The converse of BPT tells us that if AD/DB = AE/EC in △ABC, then
- AD = AE
* DE ∥ BC
- DE = BC
- △ADE ≅ △ABC
> A line dividing two sides in the same ratio is parallel to the third side.

=== coordinate-geometry ===
## The big idea
Coordinate geometry turns shapes into numbers. Once points have coordinates, we can find lengths, check whether points are collinear and locate points that divide a segment, all with formulas.

## Distance formula
> [!FORMULA] Distance between P(x₁, y₁) and Q(x₂, y₂)
> PQ = √[(x₂ − x₁)² + (y₂ − y₁)²]

It is just Pythagoras: the horizontal gap and the vertical gap are the legs of a right triangle. The distance of P(x, y) from the origin is √(x² + y²).

> [!EXAMPLE] Are (1, 5), (2, 3) and (−2, −11) collinear?
> AB = √(1 + 4) = √5, BC = √(16 + 196) = √212, AC = √(9 + 256) = √265.
> √5 + √212 ≠ √265, so the points are **not collinear**.

> [!TIP] Proving a shape
> Equal four sides and equal diagonals ⇒ square. Equal opposite sides and equal diagonals ⇒ rectangle. Equal four sides, unequal diagonals ⇒ rhombus.

## Section formula
> [!FORMULA] Point dividing AB internally in the ratio m : n
> P = ( (mx₂ + nx₁)/(m + n) , (my₂ + ny₁)/(m + n) )

> [!FORMULA] Midpoint (ratio 1 : 1)
> ( (x₁ + x₂)/2 , (y₁ + y₂)/2 )

> [!EXAMPLE] Find the point dividing (4, −3) and (8, 5) in the ratio 3 : 1
> x = (3 × 8 + 1 × 4)/4 = 7, y = (3 × 5 + 1 × (−3))/4 = 3. Point **(7, 3)**.

> [!EXAMPLE] In what ratio does the x-axis divide the join of (1, −5) and (−4, 5)?
> On the x-axis y = 0. Let the ratio be k : 1: (5k − 5)/(k + 1) = 0 ⇒ k = 1. Ratio **1 : 1** (the midpoint).

> [!MISTAKE] Swapping m and n
> m goes with the **second** point (x₂, y₂) and n with the **first**. Write "A(x₁, y₁), B(x₂, y₂)" before substituting.

## Quick recap
- Distance = √(Δx² + Δy²).
- Section formula (m : n): weights cross over to the far point.
- Midpoint = average of coordinates. The centroid of a triangle is the average of its three vertices.

--- quiz ---
Q: The distance of the point (−6, 8) from the origin is
- 6
- 8
* 10
- 14
> √(36 + 64) = 10.

Q: The midpoint of (2, −4) and (−6, 10) is
* (−2, 3)
- (2, −3)
- (−4, 6)
- (4, 3)
> ((2 − 6)/2, (−4 + 10)/2) = (−2, 3).

Q: The point dividing (−1, 7) and (4, −3) in the ratio 2 : 3 is
* (1, 3)
- (3, 1)
- (2, 3)
- (1, 4)
> x = (2 × 4 + 3 × (−1))/5 = 1, y = (2 × (−3) + 3 × 7)/5 = 3.

Q: The points (0, 0), (3, 0) and (0, 4) form a triangle whose longest side is
- 3
- 4
* 5
- 7
> The distance between (3, 0) and (0, 4) is √(9 + 16) = 5.

Q: If (x, 2) is equidistant from (8, −2) and (2, −2), then x equals
- 3
* 5
- 4
- 6
> (x − 8)² = (x − 2)² ⇒ x = 5.

=== introduction-to-trigonometry ===
## The big idea
Trigonometry links the **angles** of a right triangle to the **ratios of its sides**. Once you know one acute angle and one side, you can work out every other side.

## The six ratios
In right △ABC with the right angle at B, for the acute angle A: the side opposite A is BC, the side next to A (adjacent) is AB, and the hypotenuse is AC.

| Ratio | Definition | Memory |
|---|---|---|
| sin A | opposite / hypotenuse | **S**ome **P**eople **H**ave |
| cos A | adjacent / hypotenuse | **C**urly **B**lack **H**air |
| tan A | opposite / adjacent | **T**urning **P**ermanently **B**lack |
| cosec A | 1 / sin A | |
| sec A | 1 / cos A | |
| cot A | 1 / tan A | |

Also **tan A = sin A / cos A**. The ratios depend only on the angle, not on the size of the triangle.

> [!EXAMPLE] If tan A = 4/3, find sin A and cos A
> Take opposite = 4k, adjacent = 3k. Hypotenuse = √(16k² + 9k²) = 5k.
> **sin A = 4/5, cos A = 3/5**.

## Values at specific angles
| | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
| cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | not defined |

> [!TIP] Remember just one row
> sin 0°, 30°, 45°, 60°, 90° = √0/2, √1/2, √2/2, √3/2, √4/2. Cos is the same row backwards, and tan = sin/cos.

## Trigonometric identities
> [!FORMULA] The three identities (for 0° ≤ A ≤ 90°)
> sin²A + cos²A = 1
> 1 + tan²A = sec²A
> 1 + cot²A = cosec²A

> [!EXAMPLE] Prove (1 − cos²A) cosec²A = 1
> 1 − cos²A = sin²A, and sin²A × cosec²A = sin²A × 1/sin²A = **1**.

> [!MISTAKE] sin²A is not sin(A²)
> sin²A means (sin A)². And sin(A + B) is **not** sin A + sin B.

> [!TIP] Strategy for identity proofs
> Start from the more complicated side. Convert everything to sin and cos, use sin²A + cos²A = 1, and simplify.

## Quick recap
- sin = O/H, cos = A/H, tan = O/A; cosec, sec, cot are their reciprocals.
- Learn the table for 0°, 30°, 45°, 60°, 90°.
- Three identities, all from Pythagoras.

--- quiz ---
Q: If sin A = 1/2, then A equals
- 60°
* 30°
- 45°
- 90°
> sin 30° = 1/2.

Q: The value of tan 45° + cos 60° is
- 1
* 3/2
- 2
- √3
> 1 + 1/2 = 3/2.

Q: sec²A − tan²A equals
- 0
* 1
- −1
- 2
> From 1 + tan²A = sec²A.

Q: If cos A = 4/5, then tan A is
* 3/4
- 4/3
- 3/5
- 5/3
> Opposite = 3 (3-4-5 triangle), so tan A = 3/4.

Q: Which of these is not defined?
- sin 90°
- cos 0°
* tan 90°
- cot 45°
> tan 90° = sin 90° / cos 90° = 1/0, which is not defined.

=== some-applications-of-trigonometry ===
## The big idea
Surveyors find the height of a mountain or the width of a river using a single measured distance and an angle. This chapter applies tan, sin and cos to such **heights and distances** problems.

## Key terms
- **Line of sight**: the line from the observer's eye to the object.
- **Angle of elevation**: the angle between the horizontal and the line of sight when you look **up**.
- **Angle of depression**: the angle between the horizontal and the line of sight when you look **down**.

> [!KEY] Elevation = depression
> The angle of depression from A to B equals the angle of elevation from B to A, because they are alternate angles between parallel horizontal lines.

## The method
1. Draw a neat figure. Mark the right angle, the given angle and the given length.
2. Choose the ratio that links the **known side** to the **unknown side**. Usually tan, because heights and horizontal distances are the two legs.
3. Use the exact values (tan 30° = 1/√3, tan 45° = 1, tan 60° = √3), then simplify.

> [!EXAMPLE] A kite flies at 60 m on a string inclined at 60° to the ground. Find the string length.
> sin 60° = 60 / L ⇒ L = 60 / (√3/2) = 120/√3 = **40√3 m ≈ 69.3 m**.

> [!EXAMPLE] The angle of elevation of a tower's top from a point 30 m away is 30°. Find its height.
> tan 30° = h/30 ⇒ h = 30/√3 = **10√3 m ≈ 17.3 m**.

## Two-angle problems
When the observer moves towards the object, or there are two objects, you get **two right triangles**. Write a tan equation for each and solve them together.

> [!EXAMPLE] From a point on the ground, the elevation of a tower's top is 30°. Walking 20 m closer, it becomes 60°. Find the height.
> Let height h, remaining distance x. tan 60° = h/x ⇒ h = √3x. tan 30° = h/(x + 20) ⇒ √3h = x + 20.
> Substitute: 3x = x + 20 ⇒ x = 10, so **h = 10√3 m ≈ 17.32 m**.

> [!MISTAKE] Putting the angle at the wrong corner
> The angle of elevation is at the **observer's eye**, between the horizontal and the line of sight. Draw it there.

## Quick recap
- Elevation: looking up. Depression: looking down. They are equal for the same pair of points.
- tan links height and horizontal distance.
- Two angles ⇒ two triangles ⇒ two equations.

--- quiz ---
Q: When the Sun's altitude changes from 30° to 60°, a tower's shadow gets
- longer
* shorter
- unchanged
- twice as long
> A higher Sun casts a shorter shadow (shadow = h / tan θ).

Q: A ladder 10 m long makes 60° with the ground. The height it reaches on the wall is
- 5 m
* 5√3 m
- 10√3 m
- 10 m
> sin 60° = h/10 ⇒ h = 5√3 m.

Q: The angle of depression of a boat from a 50 m cliff is 45°. The boat is at a distance of
- 25 m
* 50 m
- 50√3 m
- 100 m
> tan 45° = 50/d ⇒ d = 50 m.

Q: The angle of elevation of the top of a 15 m pole from a point is 60°. The distance of the point from the pole is
* 5√3 m
- 15√3 m
- 15 m
- 30 m
> d = 15 / tan 60° = 15/√3 = 5√3 m.

Q: The angle of elevation from A to B is 35°. The angle of depression from B to A is
- 55°
* 35°
- 145°
- 90°
> They are alternate angles, so equal.

=== circles ===
## The big idea
A **tangent** is a line that touches a circle at exactly **one** point. This chapter proves two facts about tangents that solve a huge number of geometry problems.

- A line that doesn't meet the circle: **non-intersecting**.
- A line meeting it at two points: **secant**.
- A line meeting it at exactly one point: **tangent**. The point is the **point of contact**.

At any point of a circle there is exactly **one** tangent. From a point inside the circle there is no tangent, on the circle one, and outside exactly **two**.

## Theorem 1: tangent ⟂ radius
> [!KEY] Theorem 10.1
> The tangent at any point of a circle is **perpendicular** to the radius through the point of contact.

Why: every point Q on the tangent other than P lies outside the circle, so OQ > OP. OP is the shortest distance from O to the tangent line, and the shortest distance to a line is the perpendicular.

## Theorem 2: equal tangents
> [!KEY] Theorem 10.2
> The lengths of the two tangents drawn from an **external point** to a circle are **equal**.

Proof idea: for tangents PA and PB from P, triangles OAP and OBP are right-angled at A and B, have OA = OB (radii) and share OP. So they are congruent (RHS) and PA = PB. The proof also shows OP bisects ∠APB and ∠AOB.

> [!EXAMPLE] A tangent from a point 25 cm from the centre has length 24 cm. Find the radius.
> Radius ⟂ tangent, so r² + 24² = 25² ⇒ r² = 49 ⇒ **r = 7 cm**.

> [!EXAMPLE] A quadrilateral ABCD is drawn to circumscribe a circle. Prove AB + CD = AD + BC.
> Tangents from each vertex are equal: AP = AS, BP = BQ, CR = CQ, DR = DS.
> Adding: (AP + BP) + (CR + DR) = (AS + DS) + (BQ + CQ), i.e. **AB + CD = AD + BC**.

> [!TIP] Angle between two tangents
> If tangents from P make angle θ, then the angle at the centre between the radii is 180° − θ, because OAPB has two right angles.

## Quick recap
- Tangent touches at one point; radius at that point is perpendicular to it.
- Two tangents from an external point are equal in length.
- These two facts plus Pythagoras solve most problems.

--- quiz ---
Q: The number of tangents that can be drawn to a circle from a point outside it is
- 0
- 1
* 2
- infinite
> Exactly two tangents can be drawn from an external point.

Q: A tangent PQ at P meets a line through the centre O at Q. If OQ = 13 cm and OP = 5 cm, then PQ is
- 8 cm
* 12 cm
- 18 cm
- √194 cm
> OP ⟂ PQ, so PQ = √(169 − 25) = 12 cm.

Q: If tangents PA and PB from P are inclined at 70°, then ∠AOB is
* 110°
- 70°
- 90°
- 140°
> ∠AOB = 180° − 70° = 110°.

Q: The angle between a tangent and the radius at the point of contact is
- 45°
- 60°
* 90°
- 180°
> Theorem 10.1: the tangent is perpendicular to the radius.

Q: Two concentric circles have radii 5 cm and 3 cm. The length of a chord of the larger circle that touches the smaller circle is
- 4 cm
* 8 cm
- 6 cm
- 10 cm
> Half-chord = √(25 − 9) = 4, so the chord is 8 cm.

=== areas-related-to-circles ===
## The big idea
Real objects often use **parts** of circles: a slice of pizza (sector), the region a wiper cleans, a window shaped like a segment. We find their areas by taking a **fraction** of the whole circle.

> [!KEY] Parts of a circle
> **Sector**: region between two radii and an arc (a pizza slice). **Segment**: region between a chord and its arc.
> The smaller one is the **minor** sector or segment; the rest is **major**.

## Arc length and sector area
A central angle θ is θ/360 of the full turn, so everything is that fraction of the full circle.

> [!FORMULA] For a sector of angle θ in a circle of radius r
> Length of arc = (θ/360) × 2πr
> Area of sector = (θ/360) × πr²

> [!EXAMPLE] Find the area of a sector of angle 60° in a circle of radius 6 cm (π = 3.14)
> (60/360) × 3.14 × 36 = (1/6) × 113.04 = **18.84 cm²**.

> [!EXAMPLE] A clock's minute hand is 14 cm. Find the area it sweeps in 5 minutes.
> In 60 minutes it turns 360°, so in 5 minutes it turns 30°.
> Area = (30/360) × (22/7) × 14 × 14 = **154/3 ≈ 51.33 cm²**.

## Area of a segment
> [!FORMULA] Area of a minor segment
> Area of segment = area of sector − area of the triangle formed by the two radii and the chord

For θ = 60° the triangle is equilateral (area (√3/4) r²). For θ = 90° it is a right triangle (area ½ r²). For θ = 120°, the triangle's area is (√3/4) r².

> [!EXAMPLE] Chord subtends 90° at the centre of a circle of radius 10 cm. Find the minor segment's area (π = 3.14).
> Sector = (90/360) × 3.14 × 100 = 78.5 cm². Triangle = ½ × 10 × 10 = 50 cm².
> Segment = **28.5 cm²**. Major segment = 314 − 28.5 = **285.5 cm²**.

> [!MISTAKE] Using the diameter as r
> Every formula uses the **radius**. If the question gives the diameter, halve it first.

> [!TIP] Shaded-region questions
> Shaded area = (big shape) − (unshaded shapes). Write this word equation first, then fill in numbers.

## Quick recap
- Arc = (θ/360) 2πr. Sector = (θ/360) πr².
- Segment = sector − triangle.
- Major part = whole circle − minor part.

--- quiz ---
Q: The area of a quadrant of a circle of radius 14 cm is (π = 22/7)
- 616 cm²
* 154 cm²
- 308 cm²
- 77 cm²
> (1/4) × (22/7) × 196 = 154 cm².

Q: The length of an arc of angle 90° in a circle of radius 7 cm is
- 22 cm
* 11 cm
- 44 cm
- 5.5 cm
> (90/360) × 2 × (22/7) × 7 = 11 cm.

Q: A sector of a circle of radius r has angle 180°. Its area is
* πr²/2
- πr²
- πr²/4
- 2πr²
> A 180° sector is a semicircle.

Q: Area of segment equals
- sector + triangle
* sector − triangle
- triangle − sector
- circle − sector
> The segment is the sector with the triangle removed.

Q: In 5 minutes a minute hand turns through
- 5°
- 6°
* 30°
- 60°
> 360° ÷ 12 = 30°.

=== surface-areas-and-volumes ===
## The big idea
Real objects are often **combinations** of basic solids: a capsule is a cylinder with two hemispheres; a toy top is a cone on a hemisphere. We find their surface area by adding only the **visible** surfaces, and their volume by adding the volumes of the parts.

## Formulas you need
| Solid | Curved/Lateral surface | Total surface | Volume |
|---|---|---|---|
| Cuboid (l, b, h) | 2h(l + b) | 2(lb + bh + hl) | lbh |
| Cube (a) | 4a² | 6a² | a³ |
| Cylinder (r, h) | 2πrh | 2πr(r + h) | πr²h |
| Cone (r, h, l) | πrl | πr(l + r) | ⅓πr²h |
| Sphere (r) | 4πr² | 4πr² | ⁴⁄₃πr³ |
| Hemisphere (r) | 2πr² | 3πr² | ⅔πr³ |

For a cone, the slant height **l = √(r² + h²)**.

## Surface area of combined solids
> [!KEY] Add only what you can touch
> When two solids are joined, the joined faces are hidden. Use **curved** surface areas of the parts, not total surface areas.

> [!EXAMPLE] A capsule: cylinder with a hemisphere at each end. Total length 14 mm, diameter 5 mm. Find its surface area.
> r = 2.5 mm. Cylinder length = 14 − 5 = 9 mm.
> Surface = 2 × (2πr²) + 2πrh = 4πr² + 2πrh = 2πr(2r + h) = 2 × (22/7) × 2.5 × (5 + 9) = **220 mm²**.

## Volume of combined solids
> [!EXAMPLE] A solid is a cone of radius 1 cm and height 1 cm on a hemisphere of radius 1 cm. Find its volume in terms of π.
> Volume = ⅓π(1)²(1) + ⅔π(1)³ = ⅓π + ⅔π = **π cm³**.

> [!TIP] Volume stays, surface changes
> When a solid is melted and recast, **volume is conserved**: volume of the old shape = total volume of the new shapes. The surface area usually changes.

> [!MISTAKE] Using h instead of l
> The curved surface of a cone uses the **slant height l**, not the vertical height h.

## Quick recap
- Learn the table of formulas.
- Combined surface area: add curved surfaces only, never the hidden joins.
- Combined volume: add (or subtract) the volumes of the parts.

--- quiz ---
Q: The curved surface area of a hemisphere of radius r is
- πr²
* 2πr²
- 3πr²
- 4πr²
> Half of the sphere's 4πr².

Q: A cone has radius 3 cm and height 4 cm. Its slant height is
- 7 cm
* 5 cm
- 6 cm
- 12 cm
> l = √(9 + 16) = 5 cm.

Q: The volume of a cylinder of radius 7 cm and height 10 cm is (π = 22/7)
- 440 cm³
* 1540 cm³
- 154 cm³
- 2200 cm³
> (22/7) × 49 × 10 = 1540 cm³.

Q: A cone and a cylinder have the same radius and height. The ratio of their volumes is
* 1 : 3
- 3 : 1
- 1 : 2
- 2 : 3
> Cone = ⅓πr²h, cylinder = πr²h.

Q: When a metal sphere is melted and recast into small spheres, what stays the same?
- Total surface area
* Total volume
- Radius
- Number of spheres
> Melting and recasting conserves volume.

=== statistics ===
## The big idea
When data is grouped into class intervals (0–10, 10–20, …), we can't see each value, so we estimate the **mean**, **median** and **mode** using formulas. Each tells a different story: the average, the middle and the most common.

## Mean of grouped data
For each class, take its **class mark** xᵢ = (lower limit + upper limit)/2.

> [!FORMULA] Three ways to find the mean
> Direct: x̄ = Σfᵢxᵢ / Σfᵢ
> Assumed mean: x̄ = a + Σfᵢdᵢ / Σfᵢ, where dᵢ = xᵢ − a
> Step deviation: x̄ = a + (Σfᵢuᵢ / Σfᵢ) × h, where uᵢ = (xᵢ − a)/h

All three give the same answer; the step-deviation method keeps the numbers small.

## Mode of grouped data
The **modal class** is the class with the **highest frequency**.

> [!FORMULA] Mode
> Mode = l + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h
> l = lower limit of the modal class, h = class size, f₁ = frequency of the modal class, f₀ = of the class before it, f₂ = of the class after it

## Median of grouped data
Make a **cumulative frequency** column. Find n/2; the class whose cumulative frequency first reaches n/2 is the **median class**.

> [!FORMULA] Median
> Median = l + [(n/2 − cf) / f] × h
> cf = cumulative frequency of the class **before** the median class, f = frequency of the median class

> [!EXAMPLE] Find the median: 0–10: 5, 10–20: 8, 20–30: 20, 30–40: 15, 40–50: 7, 50–60: 5
> n = 60, n/2 = 30. Cumulative: 5, 13, 33 … so the median class is 20–30.
> l = 20, cf = 13, f = 20, h = 10. Median = 20 + (30 − 13)/20 × 10 = 20 + 8.5 = **28.5**.

> [!REMEMBER] Empirical relationship
> 3 Median = Mode + 2 Mean

> [!MISTAKE] Using cf of the median class itself
> In the median formula, cf is the cumulative frequency of the class **just before** the median class.

## Quick recap
- Mean uses class marks; choose direct, assumed-mean or step-deviation.
- Mode: modal class = highest frequency, then the formula.
- Median: cumulative frequency, median class at n/2, then the formula.

--- quiz ---
Q: The class mark of the class 10–25 is
- 15
* 17.5
- 12.5
- 35
> (10 + 25)/2 = 17.5.

Q: The modal class is the class with the
- largest class mark
* highest frequency
- highest cumulative frequency
- middle position
> Mode = most frequent.

Q: If mode = 12 and mean = 15, then the median (empirical relation) is
- 13
* 14
- 16
- 18
> 3 Median = 12 + 30 = 42, so median = 14.

Q: To find the median of grouped data we first need
- class marks
* cumulative frequencies
- deviations
- the modal class
> The median class is located using cumulative frequency and n/2.

Q: In the step-deviation method, uᵢ equals
- xᵢ − a
* (xᵢ − a)/h
- fᵢxᵢ
- xᵢ/h
> Deviations are divided by the class size h.

=== probability ===
## The big idea
Probability measures how likely an event is, on a scale from **0 (impossible)** to **1 (certain)**. In this chapter we use **theoretical (classical) probability**, where all outcomes are **equally likely**.

> [!FORMULA] Theoretical probability
> P(E) = (number of outcomes favourable to E) / (total number of possible outcomes)

> [!KEY] Facts to remember
> 0 ≤ P(E) ≤ 1. P(sure event) = 1. P(impossible event) = 0.
> **P(E) + P(not E) = 1**, so P(not E) = 1 − P(E). E and "not E" are complementary events.
> The sum of the probabilities of all elementary events is 1.

## Know your sample spaces
- **Coin**: 2 outcomes (H, T). Two coins: 4 (HH, HT, TH, TT).
- **Die**: 6 outcomes (1–6). Two dice: **36** outcomes.
- **Deck of cards**: 52 cards, 4 suits (spades ♠, clubs ♣ black; hearts ♥, diamonds ♦ red), 13 cards each. Face cards: J, Q, K (12 in all). Aces: 4.

> [!EXAMPLE] One card is drawn from a well-shuffled deck. Find P(a face card) and P(not a heart)
> Face cards = 12, so P = 12/52 = **3/13**.
> Hearts = 13, so P(not a heart) = 1 − 13/52 = **3/4**.

> [!EXAMPLE] Two dice are thrown. Find P(sum is 7)
> Favourable: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): 6 outcomes.
> P = 6/36 = **1/6**.

> [!EXAMPLE] A bag has 3 red and 5 black balls. Find P(not red)
> P(red) = 3/8, so P(not red) = **5/8**.

> [!MISTAKE] Counting (1,6) and (6,1) once
> With two dice, (1,6) and (6,1) are **different** outcomes: die 1 shows 1 and die 2 shows 6, or the other way round.

## Quick recap
- P(E) = favourable / total, for equally likely outcomes.
- 0 ≤ P(E) ≤ 1 and P(E) + P(not E) = 1.
- Know coin, die and card sample spaces by heart.

--- quiz ---
Q: Which of these cannot be a probability?
- 0.7
- 2/3
* −1.5
- 15%
> Probability is never negative.

Q: If P(E) = 0.05, then P(not E) is
- 0.05
* 0.95
- 0.5
- 1.05
> 1 − 0.05 = 0.95.

Q: A die is thrown once. The probability of getting a prime number is
* 1/2
- 1/3
- 2/3
- 1/6
> Primes on a die: 2, 3, 5, so 3/6 = 1/2.

Q: A card is drawn from 52 cards. The probability of an ace is
- 1/52
* 1/13
- 1/4
- 4/13
> 4/52 = 1/13.

Q: Two coins are tossed. The probability of at least one head is
- 1/4
- 1/2
* 3/4
- 1
> HH, HT, TH out of 4 outcomes.
