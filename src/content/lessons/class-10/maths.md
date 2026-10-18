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
