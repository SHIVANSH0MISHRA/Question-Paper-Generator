/**
 * Constraint Engine
 * 
 * Validates the paper configuration and converts percentage constraints into target marks.
 * Handles integer rounding to ensure the total marks match the requested marks exactly.
 */

function validatePercentages(distribution, name) {
    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) { // Allowing small floating point differences
        throw new Error(`${name} distribution must total 100%. Current total: ${total}%`);
    }
}

function distributeMarks(totalMarks, percentages) {
    let targets = {};
    let sumAssigned = 0;
    
    // First pass: floor the values to get initial integer marks
    const remainders = [];
    for (const [key, percent] of Object.entries(percentages)) {
        const rawMark = (totalMarks * percent) / 100;
        const assigned = Math.floor(rawMark);
        targets[key] = assigned;
        sumAssigned += assigned;
        
        remainders.push({
            key,
            remainder: rawMark - assigned
        });
    }

    // Sort by remainder descending
    remainders.sort((a, b) => b.remainder - a.remainder);

    // Second pass: distribute the remaining marks to those with highest fractional parts
    let marksLeft = totalMarks - sumAssigned;
    for (let i = 0; i < marksLeft && i < remainders.length; i++) {
        targets[remainders[i].key] += 1;
    }

    return targets;
}

function processConstraints(config) {
    if (!config.totalMarks || config.totalMarks <= 0) {
        throw new Error("Total marks must be greater than 0");
    }

    validatePercentages(config.difficulty, 'Difficulty');
    
    const topicPercentages = {};
    config.topics.forEach(t => { topicPercentages[t.name] = t.percentage; });
    validatePercentages(topicPercentages, 'Topic');
    
    validatePercentages(config.questionTypes, 'Question Type');

    // Convert to target marks
    const targetDifficulty = distributeMarks(config.totalMarks, config.difficulty);
    const targetTopics = distributeMarks(config.totalMarks, topicPercentages);
    const targetTypes = distributeMarks(config.totalMarks, config.questionTypes);

    return {
        targetDifficulty,
        targetTopics,
        targetTypes,
        originalConfig: config
    };
}

module.exports = {
    processConstraints,
    distributeMarks
};
