const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const pool = [];

const mathTopics = ['Number Systems', 'Algebra', 'Coordinate Geometry', 'Geometry', 'Trigonometry', 'Mensuration', 'Statistics & Probability'];
const scienceTopics = ['Motion & Force', 'Work & Energy', 'Light', 'Electricity', 'Atoms & Molecules', 'Chemical Reactions', 'Life Processes', 'Heredity & Evolution'];

const difficulties = ['Easy', 'Medium', 'Hard'];
const typeMapping = {
    'MCQ': 1,
    'Short Answer': 3,
    'Long Answer': 5
};

// Generate Math Questions
for (const topic of mathTopics) {
    for (const diff of difficulties) {
        for (const [type, marks] of Object.entries(typeMapping)) {
            // INTENTIONAL GAP: Skip Hard Long Answers for Algebra and Coordinate Geometry to force AI fallback
            if (topic === 'Algebra' && diff === 'Hard' && type === 'Long Answer') continue;
            if (topic === 'Coordinate Geometry' && diff === 'Hard') continue; // gap entire hard difficulty
            if (topic === 'Statistics & Probability' && diff === 'Easy' && type === 'MCQ') continue;

            const q = {
                id: `pool_${uuidv4().substring(0,8)}`,
                subject: 'Mathematics',
                topic: topic,
                difficulty: diff,
                type: type,
                marks: marks,
                source: 'pool',
                question: `[POOL] What is a ${diff.toLowerCase()} ${type} question about ${topic}?`,
                answer: `The answer to the ${topic} question.`,
                explanation: `This is a generated explanation for ${topic}.`
            };

            if (type === 'MCQ') {
                q.options = ['Option A', 'Option B', 'Option C', 'Option D'];
                q.answer = 'Option A';
            }

            // Generate 2 questions per available combination to have enough pool size
            pool.push(q);
            pool.push({...q, id: `pool_${uuidv4().substring(0,8)}`, question: `[POOL] Another ${diff.toLowerCase()} ${type} question about ${topic}?`});
        }
    }
}

// Generate Science Questions
for (const topic of scienceTopics) {
    for (const diff of difficulties) {
        for (const [type, marks] of Object.entries(typeMapping)) {
            // INTENTIONAL GAP: Skip Hard MCQs for Physics topics to force AI fallback
            if (['Motion & Force', 'Work & Energy'].includes(topic) && diff === 'Hard' && type === 'MCQ') continue;
            
            const q = {
                id: `pool_${uuidv4().substring(0,8)}`,
                subject: 'Science',
                topic: topic,
                difficulty: diff,
                type: type,
                marks: marks,
                source: 'pool',
                question: `[POOL] Describe a ${diff.toLowerCase()} ${topic} concept for ${marks} marks.`,
                answer: `Scientific answer regarding ${topic}.`,
                explanation: `Detailed scientific explanation.`
            };

            if (type === 'MCQ') {
                q.options = ['Concept A', 'Concept B', 'Concept C', 'Concept D'];
                q.answer = 'Concept A';
            }

            pool.push(q);
            pool.push({...q, id: `pool_${uuidv4().substring(0,8)}`, question: `[POOL] Another ${topic} question.`});
        }
    }
}

const dataPath = path.join(__dirname, '../data/questions.json');
fs.writeFileSync(dataPath, JSON.stringify(pool, null, 2));

console.log(`Successfully generated ${pool.length} questions in the pool. Gaps intentionally left for AI fallback.`);
