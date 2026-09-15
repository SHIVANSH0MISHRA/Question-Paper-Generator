const { processConstraints } = require('./constraintEngine');
const { generateAllocation } = require('./allocationEngine');
const { generateQuestionWithGemini, generateQuestionsBatchWithGemini, QuotaExhaustedError } = require('./aiGenerator');
const { getFallbackQuestion, addQuestionsToPool, getAllQuestions } = require('./questionBank');
const { validateQuestion, validatePaper } = require('./validators');
const { v4: uuidv4 } = require('uuid');

async function generatePaper(config) {
    try {
        // Step 1: Constraint Engine
        const targets = processConstraints(config);

        // Step 2: Allocation Engine
        const allocationResult = generateAllocation(targets);
        
        const paper = {
            id: uuidv4(),
            configuration: config,
            questions: [],
            conflicts: allocationResult.conflicts, // any slot-level math conflicts
            breakdown: null,
            createdAt: new Date().toISOString()
        };

        const usedQuestionIds = new Set();
        const gaps = [];

        // Step 3: First Pass - Populate Questions from Pool
        for (const slot of allocationResult.slots) {
            const poolQ = getFallbackQuestion(slot, usedQuestionIds);
            if (poolQ && validateQuestion(poolQ, slot)) {
                paper.questions.push({ ...poolQ, id: `fb_${Date.now()}_${poolQ.id}`, questionNumber: slot.questionNumber });
                usedQuestionIds.add(poolQ.id);
            } else {
                gaps.push(slot);
            }
        }

        // Step 4: Second Pass - Batch AI Generation for gaps
        if (gaps.length > 0) {
            console.log(`Detected ${gaps.length} gaps. Invoking AI batch fallback...`);
            try {
                const generatedQuestions = await generateQuestionsBatchWithGemini(gaps);
                
                // Cache the newly generated questions in the pool!
                if (generatedQuestions && generatedQuestions.length > 0) {
                    addQuestionsToPool(generatedQuestions);
                }

                // Match them back to their slots
                for (let i = 0; i < gaps.length; i++) {
                    const slot = gaps[i];
                    const generatedQ = generatedQuestions[i];
                    if (generatedQ && validateQuestion(generatedQ, slot)) {
                        paper.questions.push({ ...generatedQ, questionNumber: slot.questionNumber });
                        usedQuestionIds.add(generatedQ.id);
                    } else {
                        throw new Error(`AI generated invalid question for slot ${slot.questionNumber}`);
                    }
                }
            } catch (error) {
                console.error("AI Fallback entirely failed:", error.message);
                
                // CONSTRAINT RELAXATION
                // If AI fails completely (Quota Exhausted), we MUST fulfill the marks exactly.
                // We will relax the 'difficulty' constraint but STRICTLY keep 'topic' and 'marks/type'.
                const allPool = getAllQuestions();
                for (const slot of gaps) {
                    const relaxationCandidates = allPool.filter(q => 
                        !usedQuestionIds.has(q.id) && 
                        q.marks === slot.marks && 
                        q.type.toLowerCase() === slot.type.toLowerCase() &&
                        q.topic.toLowerCase() === slot.topic.toLowerCase()
                    );

                    if (relaxationCandidates.length > 0) {
                        const substitute = relaxationCandidates[0];
                        paper.questions.push({ ...substitute, id: `relaxed_${Date.now()}_${substitute.id}`, questionNumber: slot.questionNumber });
                        usedQuestionIds.add(substitute.id);
                        paper.conflicts.push(`AI service unavailable (Quota exhausted). Relaxed difficulty constraint: Used a ${substitute.difficulty} difficulty question instead of ${slot.difficulty} for ${slot.topic} to preserve marks.`);
                    } else {
                        // Extreme fallback: Drop Topic constraint entirely, just match marks/type to preserve exact total marks.
                        const extremeCandidates = allPool.filter(q => 
                            !usedQuestionIds.has(q.id) && 
                            q.marks === slot.marks && 
                            q.type.toLowerCase() === slot.type.toLowerCase()
                        );
                        if (extremeCandidates.length > 0) {
                            const extremeSubstitute = extremeCandidates[0];
                            paper.questions.push({ ...extremeSubstitute, id: `extreme_${Date.now()}_${extremeSubstitute.id}`, questionNumber: slot.questionNumber });
                            usedQuestionIds.add(extremeSubstitute.id);
                            paper.conflicts.push(`CRITICAL: AI service unavailable and no topic matches. Relaxed topic constraint: Used ${extremeSubstitute.topic} instead of ${slot.topic} to preserve marks.`);
                        } else {
                            paper.conflicts.push(`CRITICAL FAILURE: Could not fulfill slot for ${slot.marks} marks. Paper will be short.`);
                        }
                    }
                }
            }
        }

        // Sort questions by questionNumber
        paper.questions.sort((a, b) => a.questionNumber - b.questionNumber);

        // Step 5: Validate Paper
        const validationResult = validatePaper(paper);
        paper.breakdown = validationResult.breakdown;
        
        if (!validationResult.valid) {
            paper.conflicts.push("Warning: Paper constraints could not be perfectly satisfied due to exhausted pool and AI failure.");
        }

        return paper;
    } catch (error) {
        throw error;
    }
}

async function regenerateQuestion(paper, questionId) {
    const questionIndex = paper.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
        throw new Error("Question not found in paper.");
    }
    
    const oldQuestion = paper.questions[questionIndex];
    // Create a slot based on the old question's metadata
    const slot = {
        questionNumber: oldQuestion.questionNumber,
        subject: oldQuestion.subject,
        topic: oldQuestion.topic,
        difficulty: oldQuestion.difficulty,
        type: oldQuestion.type,
        marks: oldQuestion.marks
    };
    
    let newQuestion = null;
    
    // Extract base IDs to properly exclude fallback questions that were already used
    const usedIds = new Set(paper.questions.map(q => {
        if (q.id.startsWith('fb_') || q.id.startsWith('relaxed_') || q.id.startsWith('extreme_')) {
            const parts = q.id.split('_');
            return parts.slice(2).join('_'); // Get original base ID
        }
        return q.id;
    }));

    // FIRST: Try Pool
    const poolQ = getFallbackQuestion(slot, usedIds);
    if (poolQ && validateQuestion(poolQ, slot)) {
        newQuestion = { ...poolQ, id: `fb_${Date.now()}_${poolQ.id}` };
    }

    // SECOND: Try Gemini
    if (!newQuestion) {
        try {
            // Reusing batch function with a single slot for consistency
            const geminiResult = await generateQuestionsBatchWithGemini([slot]);
            if (geminiResult && geminiResult.length > 0) {
                const geminiQ = geminiResult[0];
                if (validateQuestion(geminiQ, slot) && !usedIds.has(geminiQ.id)) {
                    newQuestion = { ...geminiQ };
                    addQuestionsToPool([newQuestion]); // Cache it
                }
            }
        } catch(e) {
            console.error("Regeneration AI Fallback failed", e.message);
        }
    }
    
    // THIRD: Constraint Relaxation
    if (!newQuestion) {
        const allPool = getAllQuestions();
        const relaxationCandidates = allPool.filter(q => 
            !usedIds.has(q.id) && 
            q.marks === slot.marks && 
            q.type.toLowerCase() === slot.type.toLowerCase() &&
            q.topic.toLowerCase() === slot.topic.toLowerCase()
        );

        if (relaxationCandidates.length > 0) {
            const substitute = relaxationCandidates[0];
            newQuestion = { ...substitute, id: `relaxed_${Date.now()}_${substitute.id}` };
            paper.conflicts.push(`Regenerate failed to use requested constraints. Relaxed difficulty from ${slot.difficulty} to ${substitute.difficulty}.`);
        } else {
            const extremeCandidates = allPool.filter(q => 
                !usedIds.has(q.id) && 
                q.marks === slot.marks && 
                q.type.toLowerCase() === slot.type.toLowerCase()
            );
            if (extremeCandidates.length > 0) {
                const extremeSubstitute = extremeCandidates[0];
                newQuestion = { ...extremeSubstitute, id: `extreme_${Date.now()}_${extremeSubstitute.id}` };
                paper.conflicts.push(`Regenerate failed completely on topic. Relaxed topic from ${slot.topic} to ${extremeSubstitute.topic}.`);
            }
        }
    }

    if (!newQuestion) {
        throw new Error("Could not generate a valid replacement question. The pool is exhausted, AI fallback failed, and no viable relaxation candidates exist.");
    }
    
    // Replace and revalidate
    newQuestion.questionNumber = slot.questionNumber;
    paper.questions[questionIndex] = newQuestion;
    
    const validationResult = validatePaper(paper);
    paper.breakdown = validationResult.breakdown;
    
    return paper;
}

module.exports = {
    generatePaper,
    regenerateQuestion
};
