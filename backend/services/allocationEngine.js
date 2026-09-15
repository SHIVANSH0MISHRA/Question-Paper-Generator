/**
 * Allocation Engine
 * 
 * Takes the calculated target marks for each constraint dimension and generates
 * a concrete list of question requirements (slots).
 * 
 * Each slot has: topic, difficulty, type, marks
 */

// Define standard marks for question types (can be configurable later)
const TYPE_MARKS = {
    'mcq': 1,
    'shortAnswer': 3,
    'longAnswer': 5
};

function generateAllocation(targets) {
    const { targetDifficulty, targetTopics, targetTypes, originalConfig } = targets;
    const totalMarks = originalConfig.totalMarks;
    
    let allocatedMarks = 0;
    const slots = [];
    const conflicts = [];
    
    // Create tracking objects for remaining needs
    let remainingTypes = { ...targetTypes };
    let remainingTopics = { ...targetTopics };
    let remainingDifficulty = { ...targetDifficulty };

    // Simple heuristic allocation:
    // 1. We determine the types of questions first because they dictate the marks per question.
    // 2. Then we assign topics to those slots based on what's needed.
    // 3. Then we assign difficulty.

    let slotCounter = 1;

    for (const [type, marksNeeded] of Object.entries(targetTypes)) {
        let marksToAllocate = marksNeeded;
        let markPerQuestion = TYPE_MARKS[type] || 1; // Default to 1 if unknown

        while (marksToAllocate >= markPerQuestion && allocatedMarks + markPerQuestion <= totalMarks) {
            
            // Find topic that needs marks the most
            const topic = Object.keys(remainingTopics).reduce((a, b) => remainingTopics[a] > remainingTopics[b] ? a : b);
            
            // Find difficulty that needs marks the most
            const difficulty = Object.keys(remainingDifficulty).reduce((a, b) => remainingDifficulty[a] > remainingDifficulty[b] ? a : b);
            
            slots.push({
                questionNumber: slotCounter++,
                subject: originalConfig.subject,
                topic,
                difficulty,
                type,
                marks: markPerQuestion
            });

            // Decrease remaining needs
            remainingTopics[topic] -= markPerQuestion;
            remainingDifficulty[difficulty] -= markPerQuestion;
            marksToAllocate -= markPerQuestion;
            allocatedMarks += markPerQuestion;
        }
        
        // If there are leftover marks for this type that couldn't form a full question,
        // (e.g. shortAnswer needs 4 marks but each is 3 marks), we note this deviation.
        if (marksToAllocate > 0) {
            remainingTypes[type] = marksToAllocate;
        } else {
            remainingTypes[type] = 0;
        }
    }
    
    // If we haven't reached totalMarks (due to leftover fragments), we need to fill the rest with 1-mark MCQs or similar.
    // In a robust engine, we'd adjust the mark assignments to ensure we hit exactly totalMarks.
    while (allocatedMarks < totalMarks) {
        let markPerQuestion = 1; // Force 1 mark to ensure we hit the total exactly
        const type = 'mcq';
        const topic = Object.keys(remainingTopics).reduce((a, b) => remainingTopics[a] > remainingTopics[b] ? a : b);
        const difficulty = Object.keys(remainingDifficulty).reduce((a, b) => remainingDifficulty[a] > remainingDifficulty[b] ? a : b);

        slots.push({
            questionNumber: slotCounter++,
            subject: originalConfig.subject,
            topic,
            difficulty,
            type,
            marks: markPerQuestion
        });

        remainingTopics[topic] -= markPerQuestion;
        remainingDifficulty[difficulty] -= markPerQuestion;
        allocatedMarks += markPerQuestion;
    }

    // Calculate final deviations and record conflicts
    const actualDifficulty = {};
    const actualTopics = {};
    const actualTypes = {};
    
    slots.forEach(slot => {
        actualDifficulty[slot.difficulty] = (actualDifficulty[slot.difficulty] || 0) + slot.marks;
        actualTopics[slot.topic] = (actualTopics[slot.topic] || 0) + slot.marks;
        actualTypes[slot.type] = (actualTypes[slot.type] || 0) + slot.marks;
    });

    Object.keys(targetDifficulty).forEach(key => {
        const diff = (actualDifficulty[key] || 0) - targetDifficulty[key];
        if (diff !== 0) conflicts.push(`Difficulty '${key}' deviated by ${diff} marks.`);
    });

    Object.keys(targetTopics).forEach(key => {
        const diff = (actualTopics[key] || 0) - targetTopics[key];
        if (diff !== 0) conflicts.push(`Topic '${key}' deviated by ${diff} marks.`);
    });
    
    Object.keys(targetTypes).forEach(key => {
        const diff = (actualTypes[key] || 0) - targetTypes[key];
        if (diff !== 0) conflicts.push(`Question Type '${key}' deviated by ${diff} marks.`);
    });

    return {
        slots,
        actualDifficulty,
        actualTopics,
        actualTypes,
        conflicts,
        totalMarks: allocatedMarks
    };
}

module.exports = {
    generateAllocation
};
