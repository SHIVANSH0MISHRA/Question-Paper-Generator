const { processConstraints, distributeMarks } = require('./constraintEngine');

describe('Constraint Engine', () => {
    test('distributeMarks correctly handles rounding and exact targets', () => {
        const percentages = { easy: 30, medium: 50, hard: 20 };
        const totalMarks = 40;
        const targets = distributeMarks(totalMarks, percentages);
        
        expect(targets.easy).toBe(12);
        expect(targets.medium).toBe(20);
        expect(targets.hard).toBe(8);
        expect(targets.easy + targets.medium + targets.hard).toBe(totalMarks);
    });

    test('distributeMarks handles fractional targets safely without losing marks', () => {
        const percentages = { alg: 33, geo: 33, trig: 34 };
        const totalMarks = 40;
        // 33% of 40 = 13.2
        // 33% of 40 = 13.2
        // 34% of 40 = 13.6
        // Initial assign: 13, 13, 13 (sum 39)
        // Remainders: 0.2, 0.2, 0.6
        // trig gets the extra 1 -> 13, 13, 14.
        const targets = distributeMarks(totalMarks, percentages);
        
        expect(targets.alg).toBe(13);
        expect(targets.geo).toBe(13);
        expect(targets.trig).toBe(14);
        expect(targets.alg + targets.geo + targets.trig).toBe(totalMarks);
    });

    test('processConstraints throws error on invalid percentages', () => {
        const config = {
            totalMarks: 40,
            difficulty: { easy: 30, medium: 50, hard: 10 }, // 90%
            topics: [],
            questionTypes: {}
        };

        expect(() => processConstraints(config)).toThrow("Difficulty distribution must total 100%");
    });
});
