const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key_for_testing'
});

class QuotaExhaustedError extends Error {
    constructor(message) {
        super(message);
        this.name = "QuotaExhaustedError";
    }
}

async function generateQuestionWithGemini(slot) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }
    
    const prompt = `
Generate one ${slot.subject} question.
Topic: ${slot.topic}
Difficulty: ${slot.difficulty}
Question type: ${slot.type}
Marks: ${slot.marks}

Requirements:
- Must genuinely test ${slot.topic}.
- Must be solvable within the ${slot.difficulty} level.
- Must be appropriate for ${slot.marks} marks.
- Return structured JSON in the exact format:
{
  "question": "...",
  "options": ["...", "...", "...", "..."], // Only if type is mcq, otherwise empty array
  "answer": "...",
  "explanation": "..."
}
Do not include markdown blocks, just pure JSON.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let text = response.text;
        const generatedData = JSON.parse(text);
        
        return {
            id: `ai_${Date.now()}_${Math.floor(Math.random()*10000)}`,
            subject: slot.subject,
            topic: slot.topic,
            difficulty: slot.difficulty,
            type: slot.type,
            marks: slot.marks,
            question: generatedData.question,
            options: generatedData.options || [],
            answer: generatedData.answer,
            explanation: generatedData.explanation
        };
    } catch (error) {
        console.error("Gemini Generation Error:", error.message);
        if (error.message.includes('429') || error.message.includes('quota')) {
            throw new QuotaExhaustedError(error.message);
        }
        throw error;
    }
}

async function generateQuestionsBatchWithGemini(slots) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    if (!slots || slots.length === 0) return [];

    let prompt = `You are a strict JSON API. Generate exactly ${slots.length} questions corresponding to the following requested slots.
Return a single JSON array of objects.
Do not output any extra text, only the JSON array.

Slots:
`;

    slots.forEach((slot, idx) => {
        prompt += `
Slot [${idx}]:
- Subject: ${slot.subject}
- Topic: ${slot.topic}
- Difficulty: ${slot.difficulty}
- Question type: ${slot.type}
- Marks: ${slot.marks}
`;
    });

    prompt += `
Requirements for each question:
- Must genuinely test the requested topic.
- Must be solvable within the requested difficulty level.
- Must be appropriate for the requested marks.
- Must have the following JSON shape:
{
  "question": "...",
  "options": ["...", "...", "...", "..."], // Only if type is mcq, otherwise empty array
  "answer": "...",
  "explanation": "..."
}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        let text = response.text;
        const generatedArray = JSON.parse(text);

        if (!Array.isArray(generatedArray)) {
            throw new Error("AI did not return a JSON array");
        }

        const formattedQuestions = [];
        for (let i = 0; i < Math.min(slots.length, generatedArray.length); i++) {
            const slot = slots[i];
            const data = generatedArray[i];
            formattedQuestions.push({
                id: `ai_${Date.now()}_${Math.floor(Math.random()*10000)}_${i}`,
                subject: slot.subject,
                topic: slot.topic,
                difficulty: slot.difficulty,
                type: slot.type,
                marks: slot.marks,
                question: data.question,
                options: data.options || [],
                answer: data.answer,
                explanation: data.explanation,
                source: 'ai_generated'
            });
        }
        return formattedQuestions;
    } catch (error) {
        console.error("Gemini Batch Generation Error:", error.message);
        if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
            throw new QuotaExhaustedError(error.message);
        }
        throw error;
    }
}

module.exports = {
    generateQuestionWithGemini,
    generateQuestionsBatchWithGemini,
    QuotaExhaustedError
};
