const fs = require('fs');
const path = require('path');

let questions = [];

try {
    const dataPath = path.join(__dirname, '../data/questions.json');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    questions = JSON.parse(fileContent);
} catch (error) {
    console.error("Warning: Could not load local question bank.");
}

function getFallbackQuestion(slot, usedIds = new Set()) {
    const candidates = questions.filter(q => 
        q.subject.toLowerCase() === slot.subject.toLowerCase() &&
        q.topic.toLowerCase() === slot.topic.toLowerCase() &&
        q.difficulty.toLowerCase() === slot.difficulty.toLowerCase() &&
        q.type.toLowerCase() === slot.type.toLowerCase() &&
        q.marks === slot.marks &&
        !usedIds.has(q.id)
    );

    if (candidates.length > 0) {
        // Pick a random candidate
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    
    // If exact match not found, we could relax constraints (e.g., ignore type/marks) but for MVP, return null to show conflict.
    return null;
}

function addQuestionsToPool(newQuestions) {
    if (!newQuestions || newQuestions.length === 0) return;

    // Append to memory
    questions.push(...newQuestions);

    // Save to file
    try {
        const dataPath = path.join(__dirname, '../data/questions.json');
        fs.writeFileSync(dataPath, JSON.stringify(questions, null, 2));
        console.log(`Saved ${newQuestions.length} AI-generated questions to the pool for future caching.`);
    } catch (e) {
        console.error("Failed to save new AI questions to pool.", e);
    }
}

module.exports = {
    getFallbackQuestion,
    getAllQuestions: () => questions,
    addQuestionsToPool
};
