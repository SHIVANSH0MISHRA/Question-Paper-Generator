const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/questions.json');
let pool = [];
try {
    pool = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (e) {
    console.error("Error reading pool", e);
}

// Filter out the dummy questions added previously
pool = pool.filter(q => !q.question.startsWith('Generated '));

const realQuestions = [
    // ALGEBRA
    {
        topic: 'Algebra', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "What is the value of x in the equation 3x - 7 = 14?",
        options: ["5", "7", "21", "10"],
        answer: "7", explanation: "3x = 14 + 7 = 21. Therefore x = 7."
    },
    {
        topic: 'Algebra', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "Which of the following is a binomial?",
        options: ["3x", "2x + 5y", "x²", "4x * 5y"],
        answer: "2x + 5y", explanation: "A binomial has two terms separated by a plus or minus sign."
    },
    {
        topic: 'Algebra', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "If a + b = 5 and ab = 6, what is the value of a² + b²?",
        options: ["13", "25", "36", "11"],
        answer: "13", explanation: "(a+b)² = a² + b² + 2ab. 25 = a² + b² + 12. a² + b² = 13."
    },
    {
        topic: 'Algebra', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "Find the roots of the quadratic equation x² - 5x + 6 = 0.",
        options: ["2, 3", "-2, -3", "1, 6", "-1, -6"],
        answer: "2, 3", explanation: "x² - 3x - 2x + 6 = 0. x(x-3) - 2(x-3) = 0. (x-2)(x-3) = 0."
    },
    {
        topic: 'Algebra', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "For what value of k will the equations 2x + 3y = 7 and 4x + ky = 14 have infinitely many solutions?",
        options: ["3", "6", "9", "4"],
        answer: "6", explanation: "For infinitely many solutions, a1/a2 = b1/b2 = c1/c2. 2/4 = 3/k = 7/14. k = 6."
    },
    {
        topic: 'Algebra', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "If alpha and beta are the roots of x² - p(x+1) - c = 0, what is the value of (alpha+1)(beta+1)?",
        options: ["1 - c", "c - 1", "1 + c", "-c"],
        answer: "1 - c", explanation: "Equation is x² - px - (p+c) = 0. Sum = p, Product = -(p+c). (alpha+1)(beta+1) = alpha*beta + alpha + beta + 1 = -(p+c) + p + 1 = 1 - c."
    },
    {
        topic: 'Algebra', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "Solve the system of equations by substitution: 3x/2 - 5y/3 = -2 and x/3 + y/2 = 13/6.",
        answer: "x = 2, y = 3", explanation: "Multiply first equation by 6: 9x - 10y = -12. Multiply second by 6: 2x + 3y = 13. Solve to get x=2, y=3."
    },
    {
        topic: 'Algebra', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "The sum of the digits of a two-digit number is 9. Also, nine times this number is twice the number obtained by reversing the order of the digits. Find the number.",
        answer: "18", explanation: "Let digits be x and y. x+y=9. 9(10x+y) = 2(10y+x). 90x+9y = 20y+2x. 88x = 11y. y = 8x. Since x+y=9, x+8x=9, x=1. y=8. Number is 18."
    },

    // GEOMETRY
    {
        topic: 'Geometry', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "The sum of the interior angles of a quadrilateral is:",
        options: ["180°", "360°", "540°", "720°"],
        answer: "360°", explanation: "Any quadrilateral can be divided into two triangles, each having a sum of 180°."
    },
    {
        topic: 'Geometry', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "A triangle in which all three sides are equal is called:",
        options: ["Scalene", "Isosceles", "Equilateral", "Right-angled"],
        answer: "Equilateral", explanation: "Equilateral triangles have all sides and all angles equal."
    },
    {
        topic: 'Geometry', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "The line segment joining the mid-points of two sides of a triangle is parallel to the third side and is:",
        options: ["Equal to the third side", "Half of the third side", "Twice the third side", "One-third of the third side"],
        answer: "Half of the third side", explanation: "This is the Mid-point Theorem."
    },
    {
        topic: 'Geometry', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "Angles in the same segment of a circle are:",
        options: ["Supplementary", "Complementary", "Equal", "Unequal"],
        answer: "Equal", explanation: "Angles subtended by the same arc at any point on the remaining part of the circle are equal."
    },
    {
        topic: 'Geometry', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "If a line intersects two concentric circles with center O at A, B, C and D, then:",
        options: ["AB = CD", "AB = BC", "AC = BD", "Both AB=CD and AC=BD"],
        answer: "Both AB=CD and AC=BD", explanation: "Perpendicular from center bisects the chord. Let OM perp AD. AM=MD, BM=MC. Therefore AB=CD."
    },
    {
        topic: 'Geometry', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "In triangle ABC, D and E are points on AB and AC such that DE || BC. If AD/DB = 3/4 and AC = 15 cm, find AE.",
        options: ["45/7 cm", "20/7 cm", "9 cm", "6 cm"],
        answer: "45/7 cm", explanation: "By BPT, AD/DB = AE/EC. 3/4 = AE/(15-AE). 4AE = 45 - 3AE. 7AE = 45. AE = 45/7."
    },
    {
        topic: 'Geometry', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "Prove that a cyclic parallelogram is a rectangle.",
        answer: "Proof provided below.", explanation: "Opposite angles sum to 180 (cyclic). Opposite angles are equal (parallelogram). Therefore each is 90."
    },
    {
        topic: 'Geometry', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "Two circles of radii 5 cm and 3 cm intersect at two points and the distance between their centres is 4 cm. Find the length of the common chord.",
        answer: "6 cm", explanation: "The centers and intersection points form right triangles (3-4-5). The distance from smaller center to chord is 0, so common chord is diameter of smaller circle = 2*3 = 6."
    },

    // TRIGONOMETRY
    {
        topic: 'Trigonometry', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "The value of cos 60° is:",
        options: ["1/2", "√3/2", "1", "0"],
        answer: "1/2", explanation: "Standard trigonometric value."
    },
    {
        topic: 'Trigonometry', difficulty: 'Easy', type: 'MCQ', marks: 1,
        question: "What is the relationship between tan A, sin A, and cos A?",
        options: ["tan A = cos A / sin A", "tan A = sin A / cos A", "tan A = sin A * cos A", "tan A = 1 / sin A"],
        answer: "tan A = sin A / cos A", explanation: "Tangent is defined as the ratio of sine to cosine."
    },
    {
        topic: 'Trigonometry', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "If sin θ = cos θ, then what is the value of 2 tan θ + cos² θ?",
        options: ["5/2", "2", "3/2", "1"],
        answer: "5/2", explanation: "If sin = cos, θ = 45°. tan 45° = 1. cos 45° = 1/√2. 2(1) + (1/√2)² = 2 + 1/2 = 5/2."
    },
    {
        topic: 'Trigonometry', difficulty: 'Medium', type: 'MCQ', marks: 1,
        question: "Evaluate: (sin² 63° + sin² 27°) / (cos² 17° + cos² 73°)",
        options: ["0", "1", "2", "-1"],
        answer: "1", explanation: "sin 27 = cos 63, so numerator is sin²63 + cos²63 = 1. Denominator is 1. Ratio is 1."
    },
    {
        topic: 'Trigonometry', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "If sec θ + tan θ = p, what is the value of sec θ - tan θ?",
        options: ["p", "1/p", "-p", "1-p"],
        answer: "1/p", explanation: "sec²θ - tan²θ = 1. (secθ - tanθ)(secθ + tanθ) = 1. Therefore secθ - tanθ = 1/p."
    },
    {
        topic: 'Trigonometry', difficulty: 'Hard', type: 'MCQ', marks: 1,
        question: "The angle of elevation of the top of a tower from a point on the ground 30m away from the foot is 30°. The height of the tower is:",
        options: ["10√3 m", "15 m", "30√3 m", "10 m"],
        answer: "10√3 m", explanation: "tan 30° = h / 30. 1/√3 = h / 30. h = 30/√3 = 10√3."
    },
    {
        topic: 'Trigonometry', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "Prove that: √[(1 + sin A) / (1 - sin A)] = sec A + tan A",
        answer: "Proof by rationalizing.", explanation: "Multiply numerator and denominator inside root by (1+sin A). Root of (1+sin A)² / (1-sin² A) = (1+sin A)/cos A = sec A + tan A."
    },
    {
        topic: 'Trigonometry', difficulty: 'Hard', type: 'Short Answer', marks: 3,
        question: "A straight highway leads to the foot of a tower. A man standing at the top of the tower observes a car at an angle of depression of 30°, which is approaching the foot of the tower with a uniform speed. Six seconds later, the angle of depression of the car is found to be 60°. Find the time taken by the car to reach the foot of the tower from this point.",
        answer: "3 seconds", explanation: "Let height be h. Distances are h√3 and h/√3. Distance travelled is h√3 - h/√3 = 2h/√3 in 6s. Remaining distance h/√3 takes half the time = 3s."
    }
];

const formattedQuestions = realQuestions.map(q => ({
    ...q,
    id: `pool_${uuidv4().substring(0,8)}`,
    subject: 'Mathematics',
    source: 'pool'
}));

pool.push(...formattedQuestions);
fs.writeFileSync(dataPath, JSON.stringify(pool, null, 2));

console.log(`Cleaned up dummy questions and injected ${formattedQuestions.length} REAL questions across gap combinations.`);
