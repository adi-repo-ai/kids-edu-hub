=== number-systems ===
## The big idea
Numbers grew as people needed them: natural numbers for counting, zero, negatives (integers), fractions (rationals) and finally numbers like √2 that can't be written as fractions (irrationals). Together, rationals and irrationals make the **real numbers**, which fill the whole number line.

> [!KEY] The family of numbers
> Natural N = {1, 2, 3, …} ⊂ Whole W = {0, 1, 2, …} ⊂ Integers Z = {…, −1, 0, 1, …} ⊂ Rational Q (p/q, q ≠ 0) ⊂ Real R.
> **Irrational** numbers (√2, √3, π) are real but not rational.

Between any two rational numbers there are **infinitely many** rational numbers. For example, between 1 and 2: 1.1, 1.01, 1.001, … or use (a + b)/2 repeatedly.

## Decimal expansions
> [!KEY] Decimals tell you the type
> **Rational**: decimal expansion is **terminating** (1/4 = 0.25) or **non-terminating recurring** (1/3 = 0.333…, 1/7 = 0.142857142857…).
> **Irrational**: **non-terminating non-recurring** (√2 = 1.41421356…, π = 3.14159…).

> [!EXAMPLE] Write 0.4747… as p/q
> Let x = 0.4747… Then 100x = 47.4747…
> Subtract: 99x = 47 ⇒ **x = 47/99**.

## Real numbers on the number line
√2 can be located exactly: draw a unit square on the number line from 0 to 1; its diagonal has length √2 (Pythagoras). With a compass centred at 0, mark the diagonal's length on the line. Repeating this (a right triangle with legs √2 and 1 gives √3) builds the **square-root spiral**.

## Operations and rationalising
Rational + irrational = irrational; non-zero rational × irrational = irrational. But two irrationals can give a rational: √2 × √2 = 2.

> [!FORMULA] Identities with roots (a, b > 0)
> √(ab) = √a √b, √(a/b) = √a / √b
> (√a + √b)(√a − √b) = a − b
> (a + √b)(a − √b) = a² − b

> [!EXAMPLE] Rationalise 1/(√7 − √2)
> Multiply top and bottom by (√7 + √2): (√7 + √2)/(7 − 2) = **(√7 + √2)/5**.

## Laws of exponents for real numbers
> [!FORMULA] For a > 0 and rational p, q
> aᵖ·a^q = a^(p+q), (aᵖ)^q = a^(pq), aᵖ/a^q = a^(p−q), aᵖbᵖ = (ab)ᵖ, a⁰ = 1, a^(1/n) = ⁿ√a, a^(m/n) = (ⁿ√a)^m

> [!EXAMPLE] Simplify 64^(1/2) and 32^(2/5)
> 64^(1/2) = √64 = **8**. 32^(2/5) = (⁵√32)² = 2² = **4**.

## Quick recap
- Real numbers = rationals + irrationals.
- Terminating or recurring decimal ⇒ rational; non-terminating non-recurring ⇒ irrational.
- Rationalise using (a + √b)(a − √b) = a² − b.

--- quiz ---
Q: Which of these is irrational?
- 0.75
- 22/7
* √5
- 0.333…
> √5 has a non-terminating, non-recurring decimal expansion.

Q: The decimal expansion of 1/8 is
* terminating
- non-terminating recurring
- non-terminating non-recurring
- not possible
> 1/8 = 0.125.

Q: 0.666… expressed as p/q is
- 6/10
* 2/3
- 66/100
- 3/2
> 10x − x = 6 ⇒ x = 6/9 = 2/3.

Q: (√3 + √2)(√3 − √2) equals
* 1
- 5
- √6
- 0
> a − b = 3 − 2 = 1.

Q: The value of 125^(1/3) is
- 25
* 5
- 3
- 15
> ³√125 = 5.

=== polynomials ===
## The big idea
Polynomials are algebraic expressions like 3x² − 2x + 7 with whole-number powers. This chapter learns to classify them, find their **zeroes**, use the **Remainder** and **Factor** theorems, and factorise using **identities**.

## Vocabulary
- **Degree**: highest power. Linear (1), quadratic (2), cubic (3). A non-zero constant has degree 0; the zero polynomial has no degree.
- By number of terms: **monomial** (1), **binomial** (2), **trinomial** (3).
- x + 1/x, √x + 3 are **not** polynomials (powers −1 and ½).

## Zeroes
A **zero** of p(x) is a value c with p(c) = 0. A linear polynomial ax + b has exactly one zero, −b/a. A polynomial can have more than one zero; the zero polynomial has every number as a zero.

## The Remainder Theorem
> [!KEY] Remainder Theorem
> If p(x) is divided by (x − a), the remainder is **p(a)**.

> [!EXAMPLE] Find the remainder when x³ + 3x² + 3x + 1 is divided by x + 1
> x + 1 = x − (−1), so the remainder is p(−1) = −1 + 3 − 3 + 1 = **0**.

## The Factor Theorem
> [!KEY] Factor Theorem
> (x − a) is a factor of p(x) **if and only if** p(a) = 0.

> [!EXAMPLE] Factorise x³ − 23x² + 142x − 120
> Try factors of 120: p(1) = 1 − 23 + 142 − 120 = 0, so (x − 1) is a factor.
> Divide: x³ − 23x² + 142x − 120 = (x − 1)(x² − 22x + 120) = **(x − 1)(x − 10)(x − 12)**.

To factorise ax² + bx + c, split the middle term: find p and q with p + q = b and pq = ac.

## Algebraic identities
> [!FORMULA] Identities to know
> (x + y)² = x² + 2xy + y²
> (x − y)² = x² − 2xy + y²
> x² − y² = (x + y)(x − y)
> (x + a)(x + b) = x² + (a + b)x + ab
> (x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx
> (x + y)³ = x³ + y³ + 3xy(x + y); (x − y)³ = x³ − y³ − 3xy(x − y)
> x³ + y³ + z³ − 3xyz = (x + y + z)(x² + y² + z² − xy − yz − zx)

> [!TIP] Special case
> If x + y + z = 0, then **x³ + y³ + z³ = 3xyz**. So (−12)³ + 7³ + 5³ = 3(−12)(7)(5) = −1260.

> [!EXAMPLE] Evaluate 104 × 96 without multiplying directly
> (100 + 4)(100 − 4) = 10000 − 16 = **9984**.

## Quick recap
- Degree, zeroes, types of polynomials.
- Remainder theorem: remainder = p(a). Factor theorem: p(a) = 0 ⇔ (x − a) is a factor.
- Identities make factorising and calculating fast.

--- quiz ---
Q: The degree of 5x³ + 4x² + 7x is
- 1
- 2
* 3
- 5
> Highest power of x is 3.

Q: Which is a polynomial?
- x + 1/x
- √x + 2
* 3x² − 4x + 1
- 1/(x + 1)
> All powers are whole numbers only in 3x² − 4x + 1.

Q: The remainder when x² + 2x + 1 is divided by x − 1 is
- 0
- 2
* 4
- 1
> p(1) = 1 + 2 + 1 = 4.

Q: If (x − 2) is a factor of x² + kx − 6, then k equals
- 2
* 1
- −1
- 3
> p(2) = 4 + 2k − 6 = 0 ⇒ k = 1.

Q: If a + b + c = 0, then a³ + b³ + c³ equals
- 0
* 3abc
- abc
- a + b + c
> From the identity x³ + y³ + z³ − 3xyz = (x + y + z)(…).

=== coordinate-geometry ===
## The big idea
How do you describe exactly where a point is on a flat surface? René Descartes used two perpendicular number lines. Every point then gets a unique pair of numbers, its **coordinates**.

## The Cartesian plane
- The horizontal line is the **x-axis**, the vertical line the **y-axis**; they meet at the **origin O (0, 0)**.
- A point P is written **(x, y)**: x is the **abscissa** (distance from the y-axis), y is the **ordinate** (distance from the x-axis).
- The axes divide the plane into four **quadrants**.

| Quadrant | Signs | Example |
|---|---|---|
| I | (+, +) | (3, 2) |
| II | (−, +) | (−3, 2) |
| III | (−, −) | (−3, −2) |
| IV | (+, −) | (3, −2) |

> [!KEY] Points on the axes
> A point on the **x-axis** has y = 0, like (5, 0). A point on the **y-axis** has x = 0, like (0, −4). Points on the axes don't belong to any quadrant.

> [!EXAMPLE] In which quadrant or on which axis are these points?
> (−2, 4): quadrant II. (3, −1): quadrant IV. (−1, 0): on the negative x-axis. (0, 0): the origin.

> [!MISTAKE] (x, y) is an ordered pair
> (3, 5) and (5, 3) are different points. The x-coordinate always comes first.

## Plotting points
To plot (3, −2): start at the origin, move 3 units **right** along the x-axis, then 2 units **down**. Mark the point.

## Quick recap
- Two perpendicular axes meet at the origin (0, 0).
- (x, y): abscissa first, ordinate second.
- Signs in quadrants: I (+, +), II (−, +), III (−, −), IV (+, −).

--- quiz ---
Q: The point (−3, 5) lies in quadrant
- I
* II
- III
- IV
> Negative x and positive y.

Q: The ordinate of the point (4, −7) is
- 4
* −7
- 7
- −4
> The ordinate is the y-coordinate.

Q: A point on the y-axis has
* x-coordinate 0
- y-coordinate 0
- both coordinates equal
- positive coordinates
> Its distance from the y-axis is zero.

Q: The coordinates of the origin are
- (1, 1)
* (0, 0)
- (0, 1)
- (1, 0)
> The axes meet at (0, 0).

Q: Points with both coordinates negative lie in quadrant
- I
- II
* III
- IV
> Quadrant III has (−, −).

=== linear-equations-in-two-variables ===
## The big idea
An equation like **2x + 3y = 12** has two unknowns. Unlike x + 3 = 5, it doesn't have a single answer: it has **infinitely many** solutions, and when you plot them they form a **straight line**.

> [!KEY] Standard form
> ax + by + c = 0, where a, b, c are real numbers and a and b are not both zero.

> [!EXAMPLE] Write in standard form and find a, b, c: 2x = −5y
> 2x + 5y + 0 = 0 ⇒ a = 2, b = 5, c = 0.

## Finding solutions
Choose any value for x, then solve for y (or the other way round).

> [!EXAMPLE] Find four solutions of x + 2y = 6
> x = 0 ⇒ y = 3; x = 2 ⇒ y = 2; x = 4 ⇒ y = 1; x = 6 ⇒ y = 0.
> Solutions: (0, 3), (2, 2), (4, 1), (6, 0) … and infinitely more.

> [!EXAMPLE] Check whether (2, 1) is a solution of 3x − 2y = 4
> 3(2) − 2(1) = 4 ✓. Yes, it is a solution.

## Graph of a linear equation
Every solution is a point on one straight line, and every point on that line is a solution. So to draw the graph, plot **two or three** solutions and join them.

- y = 3 (or 0·x + y = 3) is a line **parallel to the x-axis**.
- x = −2 is a line **parallel to the y-axis**.
- y = mx passes through the **origin**.

> [!TIP] Word problems
> "The cost of a notebook is twice the cost of a pen": let pen = ₹x, notebook = ₹y, then **y = 2x**, or 2x − y = 0.

## Quick recap
- ax + by + c = 0 has infinitely many solutions.
- Each solution is a point (x, y); together they form a straight line.
- Plot two or three points to draw the graph.

--- quiz ---
Q: How many solutions does 2x + 3y = 6 have?
- One
- Two
* Infinitely many
- None
> Any point on its line is a solution.

Q: Which point is a solution of x + y = 5?
* (2, 3)
- (2, 2)
- (3, 3)
- (1, 5)
> 2 + 3 = 5.

Q: The graph of y = 4 is a line
* parallel to the x-axis
- parallel to the y-axis
- through the origin
- along the y-axis
> y is constant for all x.

Q: In 3x − 5y + 7 = 0, the value of b is
- 3
* −5
- 7
- 5
> Compare with ax + by + c = 0.

Q: If (k, 2) is a solution of 2x + y = 8, then k is
- 2
* 3
- 4
- 6
> 2k + 2 = 8 ⇒ k = 3.

=== introduction-to-euclids-geometry ===
## The big idea
Around 300 BCE, the Greek mathematician **Euclid** organised all known geometry in his book *Elements*. His method: start from a few **definitions** and obvious truths (**axioms** and **postulates**), then **prove** everything else (**theorems**) logically. This is still how mathematics works.

## Definitions
Euclid described basic ideas: "A point is that which has no part", "A line is breadthless length", "The ends of a line are points." Terms like point, line and plane are taken as **undefined**: we understand them without a formal definition.

## Axioms (common notions)
These are assumptions used throughout mathematics, not just geometry:
1. Things equal to the same thing are equal to one another.
2. If equals are added to equals, the wholes are equal.
3. If equals are subtracted from equals, the remainders are equal.
4. Things that coincide with one another are equal.
5. **The whole is greater than the part.**
6. Things that are double of the same things are equal.
7. Things that are halves of the same things are equal.

## Euclid's five postulates
These are assumptions specific to geometry:
1. A straight line may be drawn from any one point to any other point.
2. A terminated line can be produced indefinitely.
3. A circle can be drawn with any centre and any radius.
4. All right angles are equal to one another.
5. If a straight line falling on two straight lines makes the interior angles on the same side together less than two right angles, then the two lines, if produced indefinitely, meet on that side.

> [!KEY] The fifth postulate
> Its simpler equivalent (Playfair's axiom): **for every line l and every point P not on l, there is exactly one line through P parallel to l**. Equivalently: two distinct intersecting lines cannot both be parallel to the same line.

> [!EXAMPLE] A theorem from the axioms
> **Two distinct lines cannot have more than one point in common.** If they shared two points P and Q, there would be two different lines through P and Q, contradicting the axiom that a unique line passes through two distinct points.

> [!TIP] Axiom vs theorem
> **Axioms/postulates** are accepted without proof. **Theorems** are statements that are **proved** using axioms, definitions and earlier theorems.

## Quick recap
- Euclid's method: definitions + axioms + postulates ⇒ theorems by proof.
- Know the 7 axioms and 5 postulates (especially the 5th).
- Two distinct lines meet in at most one point.

--- quiz ---
Q: Euclid's book of geometry is called
- Principia
* Elements
- Geometria
- Sulbasutras
> Euclid compiled geometry in *Elements*.

Q: "The whole is greater than the part" is one of Euclid's
* axioms
- postulates
- theorems
- definitions
> It is a common notion (axiom).

Q: According to the fifth postulate (Playfair's form), through a point not on a line we can draw
- no parallel line
* exactly one parallel line
- two parallel lines
- infinitely many parallel lines
> Exactly one parallel line can be drawn.

Q: Statements that are proved are called
- axioms
- postulates
* theorems
- definitions
> Theorems are proved from axioms.

Q: Two distinct lines can have at most how many points in common?
- 0
* 1
- 2
- infinitely many
> If they shared two points they would be the same line.

=== lines-and-angles ===
## The big idea
Angles are everywhere: roof trusses, scissors, roads crossing. This chapter collects the angle facts that geometry proofs depend on, especially angles formed when a line crosses two **parallel** lines.

## Basic angle pairs
| Pair | Property |
|---|---|
| Complementary | Sum 90° |
| Supplementary | Sum 180° |
| Adjacent | Common vertex and arm, non-overlapping |
| Linear pair | Adjacent and supplementary (form a straight line) |
| Vertically opposite | Equal |

> [!KEY] Two axioms
> If a ray stands on a line, the two adjacent angles sum to **180°** (linear pair axiom). Conversely, if two adjacent angles sum to 180°, their outer arms form a line.
> **Theorem**: if two lines intersect, the **vertically opposite angles are equal**.

## Parallel lines and a transversal
When a transversal crosses two parallel lines:
- **Corresponding angles** are equal.
- **Alternate interior angles** are equal.
- **Co-interior (consecutive interior) angles** are supplementary (sum 180°).

The **converses** also hold: if any of these is true, the lines are parallel. Lines parallel to the same line are parallel to each other.

> [!EXAMPLE] AB ∥ CD and a transversal makes ∠1 = 70° with AB. Find the co-interior angle with CD.
> Co-interior angles sum to 180°, so it is **110°**.

## Angle sum property of a triangle
> [!KEY] Triangle facts
> The three angles of a triangle sum to **180°** (proved by drawing a line through one vertex parallel to the opposite side and using alternate angles).
> An **exterior angle** equals the **sum of the two interior opposite angles**.

> [!EXAMPLE] The angles of a triangle are in the ratio 2 : 3 : 4. Find them.
> 2x + 3x + 4x = 180 ⇒ x = 20. Angles: **40°, 60°, 80°**.

## Quick recap
- Linear pair sums to 180°; vertically opposite angles are equal.
- With parallel lines: corresponding equal, alternate equal, co-interior sum 180°.
- Triangle angle sum 180°; exterior angle = sum of interior opposite angles.

--- quiz ---
Q: Two angles form a linear pair. One is 65°. The other is
- 25°
* 115°
- 65°
- 295°
> 180° − 65° = 115°.

Q: Vertically opposite angles are always
- supplementary
- complementary
* equal
- 90°
> Proved using linear pairs.

Q: Alternate interior angles formed by a transversal of two parallel lines are
* equal
- supplementary
- complementary
- unequal
> A key property of parallel lines.

Q: An exterior angle of a triangle is 110° and one interior opposite angle is 45°. The other interior opposite angle is
- 45°
* 65°
- 70°
- 135°
> 110° = 45° + x ⇒ x = 65°.

Q: The angles of a triangle are x, 2x and 3x. The largest angle is
- 60°
* 90°
- 120°
- 30°
> 6x = 180 ⇒ x = 30, so 3x = 90°.

=== triangles ===
## The big idea
Two triangles are **congruent** if they are exact copies: same size and shape. We don't need to check all six parts (three sides, three angles); certain combinations of three are enough. Congruence is the main tool for proving that lengths or angles are equal.

> [!KEY] Notation
> △ABC ≅ △PQR means A ↔ P, B ↔ Q, C ↔ R. Then all corresponding parts are equal: **CPCT** (corresponding parts of congruent triangles).

## Congruence rules
| Rule | What is equal |
|---|---|
| **SAS** | Two sides and the **included** angle |
| **ASA** | Two angles and the included side |
| **AAS** | Two angles and any corresponding side |
| **SSS** | All three sides |
| **RHS** | Right angle, hypotenuse and one side (right triangles) |

> [!MISTAKE] No SSA or AAA rule
> Two sides and a **non-included** angle don't guarantee congruence. Three equal angles give similar, not necessarily congruent, triangles.

## Properties of isosceles triangles
> [!KEY] Isosceles theorems
> Angles opposite **equal sides** are equal. Conversely, sides opposite **equal angles** are equal.
> So every angle of an equilateral triangle is 60°.

> [!EXAMPLE] In △ABC, AB = AC and ∠B = 50°. Find ∠A.
> ∠C = ∠B = 50° (opposite equal sides). ∠A = 180° − 100° = **80°**.

> [!EXAMPLE] Writing a congruence proof
> Given: AB = AD and AC bisects ∠BAD. Prove △ABC ≅ △ADC.
> AB = AD (given), ∠BAC = ∠DAC (AC bisects ∠A), AC = AC (common). So △ABC ≅ △ADC by **SAS**, and hence BC = DC (CPCT).

> [!TIP] Proof layout
> List three pairs of equal parts with a reason for each, name the rule, then use CPCT for what you need to prove.

## Quick recap
- Congruent = identical size and shape; use CPCT afterwards.
- Rules: SAS, ASA, AAS, SSS, RHS.
- In an isosceles triangle, angles opposite equal sides are equal, and vice versa.

--- quiz ---
Q: Which is not a congruence rule?
- SAS
- ASA
- SSS
* SSA
> SSA doesn't guarantee congruence.

Q: In △ABC, AB = AC and ∠A = 40°. Then ∠B is
- 40°
* 70°
- 80°
- 100°
> ∠B = ∠C = (180 − 40)/2 = 70°.

Q: CPCT stands for
* corresponding parts of congruent triangles
- common parts of congruent triangles
- congruent parts of corresponding triangles
- corresponding points of congruent triangles
> Used after proving congruence.

Q: Each angle of an equilateral triangle is
- 45°
* 60°
- 90°
- 30°
> All sides equal ⇒ all angles equal ⇒ 180/3.

Q: Two right triangles have equal hypotenuses and one equal side. They are congruent by
- SAS
- ASA
* RHS
- SSS
> Right angle–hypotenuse–side.

=== quadrilaterals ===
## The big idea
A **quadrilateral** has four sides and four angles that add up to **360°**. Special quadrilaterals (parallelogram, rectangle, rhombus, square) have extra properties, and the **Mid-point Theorem** links the midpoints of a triangle's sides.

## The parallelogram and its properties
> [!KEY] In a parallelogram
> A diagonal divides it into two **congruent triangles**.
> **Opposite sides are equal**, and **opposite angles are equal**.
> The **diagonals bisect each other**.
> Each converse is also true; for example, if a quadrilateral's diagonals bisect each other, it is a parallelogram. So is a quadrilateral with **one pair of opposite sides equal and parallel**.

| Shape | Extra properties |
|---|---|
| Rectangle | All angles 90°; diagonals equal |
| Rhombus | All sides equal; diagonals perpendicular |
| Square | All sides equal, all angles 90°; diagonals equal and perpendicular |

> [!EXAMPLE] One angle of a parallelogram is 70°. Find the others.
> The opposite angle is 70°. Adjacent angles are supplementary: 110°, 110°.
> Angles: **70°, 110°, 70°, 110°**.

## The Mid-point Theorem
> [!KEY] Mid-point Theorem
> The line segment joining the **midpoints of two sides** of a triangle is **parallel to the third side** and **half of it**.
> **Converse**: a line through the midpoint of one side, parallel to another side, bisects the third side.

> [!EXAMPLE] In △ABC, D and E are midpoints of AB and AC, and BC = 10 cm. Find DE.
> DE ∥ BC and DE = ½ BC = **5 cm**.

> [!TIP] The triangle of midpoints
> Joining the midpoints of the three sides of a triangle gives four congruent triangles, each similar to the original.

## Quick recap
- Angle sum of a quadrilateral is 360°.
- Parallelogram: opposite sides and angles equal; diagonals bisect each other.
- Mid-point Theorem: segment joining midpoints ∥ third side and half of it.

--- quiz ---
Q: The sum of the angles of a quadrilateral is
- 180°
* 360°
- 540°
- 90°
> A diagonal splits it into two triangles.

Q: The diagonals of a rhombus
- are equal
* bisect each other at right angles
- are parallel
- do not bisect each other
> A rhombus is a parallelogram with all sides equal.

Q: Adjacent angles of a parallelogram are
- equal
* supplementary
- complementary
- always 90°
> Co-interior angles with parallel sides sum to 180°.

Q: D and E are midpoints of AB and AC in △ABC, and DE = 4 cm. Then BC is
- 4 cm
- 2 cm
* 8 cm
- 16 cm
> DE = ½ BC.

Q: A quadrilateral whose diagonals bisect each other is a
* parallelogram
- trapezium
- kite
- cyclic quadrilateral only
> Converse of the diagonal property.

=== circles ===
## The big idea
A circle is the set of all points at a fixed distance (radius) from a centre. Chords, arcs and the angles they make follow beautiful rules that let us prove many geometry results.

## Chords and their distances
> [!KEY] Chord theorems
> **Equal chords** subtend **equal angles** at the centre (and conversely).
> The **perpendicular from the centre** to a chord **bisects** the chord; the line from the centre to the midpoint of a chord is perpendicular to it.
> There is **one and only one circle** through three non-collinear points.
> **Equal chords are equidistant** from the centre (and conversely).

> [!EXAMPLE] A chord of length 8 cm is 3 cm from the centre. Find the radius.
> The perpendicular bisects the chord, so the half-chord is 4 cm. r = √(4² + 3²) = **5 cm**.

## Angles subtended by an arc
> [!KEY] Angle theorems
> The angle an arc subtends at the **centre** is **double** the angle it subtends at any point on the remaining part of the circle.
> **Angles in the same segment are equal.**
> The angle in a **semicircle** is a right angle (90°).

> [!EXAMPLE] An arc subtends 100° at the centre. What angle does it subtend at the circle?
> Half of 100° = **50°**.

## Cyclic quadrilaterals
A quadrilateral whose four vertices lie on a circle is **cyclic**.

> [!KEY] Cyclic quadrilateral theorem
> **Opposite angles** of a cyclic quadrilateral are **supplementary** (sum 180°). Conversely, if a quadrilateral's opposite angles sum to 180°, it is cyclic.

> [!EXAMPLE] ABCD is cyclic with ∠A = 75°. Find ∠C.
> ∠C = 180° − 75° = **105°**.

## Quick recap
- Perpendicular from the centre bisects a chord.
- Equal chords: equal central angles, equal distances from the centre.
- Central angle = 2 × angle at the circle; angle in a semicircle = 90°.
- Opposite angles of a cyclic quadrilateral sum to 180°.

--- quiz ---
Q: The angle in a semicircle is
- 45°
- 60°
* 90°
- 180°
> The diameter subtends 180° at the centre, so 90° at the circle.

Q: A chord 6 cm long is 4 cm from the centre. The radius is
- 4 cm
* 5 cm
- 6 cm
- 10 cm
> √(3² + 4²) = 5.

Q: An arc subtends 70° at a point on the circle. At the centre it subtends
- 35°
- 70°
* 140°
- 110°
> Central angle is double.

Q: In a cyclic quadrilateral ABCD, ∠B = 110°. Then ∠D is
* 70°
- 110°
- 90°
- 250°
> Opposite angles sum to 180°.

Q: How many circles pass through three non-collinear points?
- None
* Exactly one
- Two
- Infinitely many
> A unique circle passes through them.

=== herons-formula ===
## The big idea
To find the area of a triangle with ½ × base × height, you need the height. But what if you only know the three sides, as with a triangular park? **Heron's formula** (from Heron of Alexandria) gives the area from the sides alone.

> [!FORMULA] Heron's formula
> Area = √[s(s − a)(s − b)(s − c)]
> where a, b, c are the sides and **s = (a + b + c)/2** is the semi-perimeter

> [!EXAMPLE] Find the area of a triangle with sides 40 m, 32 m and 24 m
> s = (40 + 32 + 24)/2 = 48.
> Area = √[48 × 8 × 16 × 24] = √147456 = **384 m²**.
> Check: 24² + 32² = 40², so it's right-angled; ½ × 24 × 32 = 384 ✓

> [!EXAMPLE] An equilateral triangle has side 10 cm. Find its area.
> s = 15. Area = √(15 × 5 × 5 × 5) = 25√3 ≈ **43.3 cm²**.
> This matches the formula for an equilateral triangle: (√3/4) a².

## Areas of quadrilaterals
Split the quadrilateral into two triangles with a diagonal and use Heron's formula for each.

> [!EXAMPLE] Quadrilateral ABCD with AB = 3, BC = 4, CD = 4, DA = 5 cm and diagonal AC = 5 cm
> △ABC (3, 4, 5) is right-angled: area = ½ × 3 × 4 = 6 cm².
> △ACD (5, 4, 5): s = 7, area = √(7 × 2 × 3 × 2) = √84 ≈ 9.2 cm².
> Total ≈ **15.2 cm²**.

> [!TIP] Factorise before multiplying
> Under the root, break numbers into primes and pair them up. √(48 × 8 × 16 × 24) is easier as √(2¹⁴ × 3²) = 2⁷ × 3 = 384.

> [!MISTAKE] Forgetting to halve the perimeter
> s is the **semi**-perimeter. Using the full perimeter gives a wrong area.

## Quick recap
- Area = √[s(s − a)(s − b)(s − c)], s = half the perimeter.
- Works for any triangle; no height needed.
- Quadrilaterals: split into two triangles.

--- quiz ---
Q: The semi-perimeter of a triangle with sides 5, 12 and 13 cm is
- 30 cm
* 15 cm
- 10 cm
- 60 cm
> (5 + 12 + 13)/2 = 15.

Q: The area of a triangle with sides 5, 12 and 13 cm is
- 60 cm²
* 30 cm²
- 65 cm²
- 78 cm²
> √(15 × 10 × 3 × 2) = √900 = 30.

Q: The area of an equilateral triangle of side 4 cm is
* 4√3 cm²
- 8√3 cm²
- 16 cm²
- 2√3 cm²
> (√3/4) × 16 = 4√3.

Q: Heron's formula needs
- base and height
* the three sides
- two sides and an angle
- the angles only
> Only the side lengths are required.

Q: To find the area of a quadrilateral with Heron's formula, we
- use the formula directly
* divide it into two triangles using a diagonal
- multiply length by breadth
- use its perimeter only
> Find each triangle's area and add.

=== surface-areas-and-volumes ===
## The big idea
Cones, spheres and hemispheres are all around us: ice-cream cones, footballs, bowls. This chapter gives the formulas for how much material covers them (**surface area**) and how much they hold (**volume**).

## Right circular cone
A cone has radius r, height h and **slant height l = √(r² + h²)**.

> [!FORMULA] Cone
> Curved surface area = πrl
> Total surface area = πr(l + r)
> Volume = ⅓πr²h

A cone's volume is **one third** of a cylinder with the same base and height: three cones of water fill the cylinder.

> [!EXAMPLE] A cone has radius 7 cm and slant height 10 cm. Find its curved surface area.
> CSA = πrl = (22/7) × 7 × 10 = **220 cm²**.

> [!EXAMPLE] Find the volume of a cone with radius 6 cm and height 7 cm
> ⅓ × (22/7) × 36 × 7 = **264 cm³**.

## Sphere and hemisphere
> [!FORMULA] Sphere and hemisphere
> Sphere: surface area = 4πr², volume = ⁴⁄₃πr³
> Hemisphere: curved surface = 2πr², total surface = 3πr², volume = ⅔πr³

> [!EXAMPLE] A spherical balloon's radius grows from 7 cm to 14 cm. Find the ratio of surface areas.
> 4π(7)² : 4π(14)² = 49 : 196 = **1 : 4**.

> [!TIP] Scaling
> If every length is multiplied by k, areas multiply by k² and volumes by k³.

> [!MISTAKE] Using h for a cone's surface
> The curved surface uses the **slant height l**, while the volume uses the **vertical height h**.

## Quick recap
- Cone: CSA = πrl, TSA = πr(l + r), V = ⅓πr²h, l² = r² + h².
- Sphere: 4πr², ⁴⁄₃πr³. Hemisphere: 2πr² (curved), 3πr² (total), ⅔πr³.

--- quiz ---
Q: The slant height of a cone with radius 5 cm and height 12 cm is
- 17 cm
* 13 cm
- 7 cm
- 15 cm
> √(25 + 144) = 13.

Q: The surface area of a sphere of radius 7 cm is (π = 22/7)
- 154 cm²
* 616 cm²
- 1437 cm²
- 308 cm²
> 4 × (22/7) × 49 = 616.

Q: The total surface area of a hemisphere of radius r is
- 2πr²
* 3πr²
- 4πr²
- πr²
> Curved 2πr² plus the flat circular base πr².

Q: If the radius of a sphere is doubled, its volume becomes
- 2 times
- 4 times
* 8 times
- 6 times
> Volume scales with r³.

Q: The volume of a cone is what fraction of a cylinder with the same base and height?
* 1/3
- 1/2
- 2/3
- 3
> V(cone) = ⅓πr²h.

=== statistics ===
## The big idea
Statistics is about collecting, organising and **presenting** data so that patterns are easy to see. This chapter focuses on graphs: **bar graphs**, **histograms** and **frequency polygons**.

## Organising data
**Raw data** is the unorganised list of observations. A **frequency distribution table** groups it: each value or **class interval** with its **frequency** (how many times it occurs). In 10–20, 10 is the lower class limit and 20 the upper; the **class size** is 10 and the **class mark** is 15. By convention, a value of 20 goes into 20–30, not 10–20.

## Bar graphs
Rectangular bars of **equal width** with **equal gaps**; the height shows the value. Used for discrete categories (e.g. favourite sports, monthly expenditure).

## Histograms
A histogram represents **continuous** grouped data. The bars are drawn on the class intervals **with no gaps**.

> [!KEY] Unequal class widths
> If class widths differ, the bar heights must be adjusted so that **area** represents frequency:
> adjusted height = (minimum class size ÷ class size) × frequency.

> [!TIP] Kink on the axis
> If the first class starts far from 0 (e.g. 150–155 cm), draw a small zig-zag (kink) near the origin to show a break in the scale.

## Frequency polygons
Join the **midpoints of the tops** of histogram bars with straight lines. To close the shape, add a class with **zero frequency** before the first class and after the last, and join to their midpoints. You can also draw a frequency polygon directly by plotting (class mark, frequency).

> [!EXAMPLE] Reading a frequency table
> Marks: 0–10: 5, 10–20: 10, 20–30: 4, 30–40: 6, 40–50: 7.
> Class marks: 5, 15, 25, 35, 45. The polygon joins (5, 5), (15, 10), (25, 4), (35, 6), (45, 7), with ends at (−5, 0) and (55, 0).

## Quick recap
- Frequency tables organise raw data.
- Bar graph: separated bars. Histogram: touching bars, area ∝ frequency.
- Frequency polygon: join midpoints of bar tops (or plot class marks).

--- quiz ---
Q: The class mark of 30–40 is
- 30
* 35
- 40
- 70
> (30 + 40)/2 = 35.

Q: In a histogram, the bars
- have gaps between them
* touch each other
- are circles
- are drawn horizontally only
> Histograms show continuous class intervals.

Q: The class size of the interval 150–155 is
- 150
* 5
- 155
- 152.5
> Upper limit − lower limit.

Q: A frequency polygon is obtained by joining the
* midpoints of the tops of the bars in a histogram
- corners of the bars
- lower limits of classes
- cumulative frequencies
> Plot (class mark, frequency) and join.

Q: A value of 20 in classes 10–20 and 20–30 is placed in
- 10–20
* 20–30
- both
- neither
> By convention, the upper limit belongs to the next class.
