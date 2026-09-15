/**
 * Validators for checking questions and the entire paper.
 */

function validateQuestion(question, slot) {
    if (!question) return false;
    
    // Check if the generated question matches the allocation slot requirements
    if (question.subject.toLowerCase() !== slot.subject.toLowerCase()) return false;
    if (question.topic.toLowerCase() !== slot.topic.toLowerCase()) return false;
    if (question.difficulty.toLowerCase() !== slot.difficulty.toLowerCase()) return false;
    if (question.type.toLowerCase() !== slot.type.toLowerCase()) return false;
    if (question.marks !== slot.marks) return false;
    
    if (!question.question || question.question.trim() === '') return false;
    
    if (slot.type.toLowerCase() === 'mcq') {
        if (!Array.isArray(question.options) || question.options.length < 2) return false;
    }
    
    return true;
}

function validatePaper(paper) {
    let totalMarks = 0;
    const actualDifficulty = {};
    const actualTopics = {};
    const actualTypes = {};
    const questionIds = new Set();
    let duplicates = false;
    let allValid = true;

    for (const q of paper.questions) {
        if (!q.id || questionIds.has(q.id)) {
            duplicates = true;
        }
        questionIds.add(q.id);

        if (!q.question || !q.topic || !q.difficulty || !q.type || !q.marks) {
            allValid = false;
        }

        totalMarks += q.marks;
        actualDifficulty[q.difficulty] = (actualDifficulty[q.difficulty] || 0) + q.marks;
        actualTopics[q.topic] = (actualTopics[q.topic] || 0) + q.marks;
        actualTypes[q.type] = (actualTypes[q.type] || 0) + q.marks;
    }

    const valid = allValid && !duplicates;

    return {
        valid,
        breakdown: {
            totalMarks,
            difficulty: actualDifficulty,
            topics: actualTopics,
            questionTypes: actualTypes
        },
        hasDuplicates: duplicates
    };
}

module.exports = {
    validateQuestion,
    validatePaper
};
