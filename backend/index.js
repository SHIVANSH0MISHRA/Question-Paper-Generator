const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const { generatePaper, regenerateQuestion } = require('./services/paperGenerator');
const { validateQuestion, validatePaper } = require('./services/validators');

// In-memory store for generated papers (for MVP purposes)
const fs = require('fs');
const path = require('path');
const papersStorePath = path.join(__dirname, 'data', 'papers.json');

let papersStore = {};
try {
    if (fs.existsSync(papersStorePath)) {
        papersStore = JSON.parse(fs.readFileSync(papersStorePath, 'utf8'));
    }
} catch (e) {
    console.error("Could not load papers store:", e);
}

function savePapersStore() {
    try {
        fs.writeFileSync(papersStorePath, JSON.stringify(papersStore));
    } catch (e) {
        console.error("Could not save papers store:", e);
    }
}

app.post('/api/papers/generate', async (req, res) => {
    try {
        const paper = await generatePaper(req.body);
        papersStore[paper.id] = paper;
        savePapersStore();
        res.json(paper);
    } catch (error) {
        console.error("Generation Error:", error);
        res.status(400).json({ error: error.message || "Failed to generate paper" });
    }
});

app.get('/api/papers/:paperId', (req, res) => {
    const paper = papersStore[req.params.paperId];
    if (!paper) return res.status(404).json({ error: "Paper not found" });
    res.json(paper);
});

app.post('/api/papers/:paperId/questions/:questionId/regenerate', async (req, res) => {
    try {
        const paper = papersStore[req.params.paperId];
        if (!paper) return res.status(404).json({ error: "Paper not found" });
        
        const updatedPaper = await regenerateQuestion(paper, req.params.questionId);
        papersStore[updatedPaper.id] = updatedPaper;
        savePapersStore();
        res.json(updatedPaper);
    } catch (error) {
        console.error("Regeneration Error:", error);
        res.status(400).json({ error: error.message || "Failed to regenerate question" });
    }
});

app.patch('/api/papers/:paperId/questions/:questionId', (req, res) => {
    try {
        const paper = papersStore[req.params.paperId];
        if (!paper) return res.status(404).json({ error: "Paper not found" });
        
        const questionIndex = paper.questions.findIndex(q => q.id === req.params.questionId);
        if (questionIndex === -1) return res.status(404).json({ error: "Question not found" });
        
        const oldQuestion = paper.questions[questionIndex];
        const newQuestionData = req.body;
        
        // Merge updates
        const updatedQuestion = { ...oldQuestion, ...newQuestionData };
        
        // Create slot context from original metadata
        const slot = {
            subject: oldQuestion.subject,
            topic: oldQuestion.topic,
            difficulty: oldQuestion.difficulty,
            type: oldQuestion.type,
            marks: oldQuestion.marks
        };

        // Revalidate edited question
        if (!validateQuestion(updatedQuestion, slot)) {
             return res.status(400).json({ error: "Edited question is invalid or no longer matches the allocated constraints." });
        }
        
        paper.questions[questionIndex] = updatedQuestion;
        
        const validationResult = validatePaper(paper);
        paper.breakdown = validationResult.breakdown;
        
        if (!validationResult.valid) {
            // Revert changes if it breaks the paper
            paper.questions[questionIndex] = oldQuestion;
             return res.status(400).json({ error: "Edited question breaks overall paper constraints." });
        }

        res.json(paper);
    } catch (error) {
        console.error("Edit Error:", error);
        res.status(400).json({ error: error.message || "Failed to edit question" });
    }
});

app.post('/api/papers/:paperId/regenerate', async (req, res) => {
    try {
        const paper = papersStore[req.params.paperId];
        if (!paper) return res.status(404).json({ error: "Paper not found" });
        
        const newPaper = await generatePaper(paper.configuration);
        papersStore[newPaper.id] = newPaper;
        savePapersStore();
        res.json(newPaper);
    } catch (error) {
         console.error("Paper Regeneration Error:", error);
         res.status(400).json({ error: error.message || "Failed to regenerate paper" });
    }
});

const PDFDocument = require('pdfkit');

app.get('/api/papers/:paperId/pdf', (req, res) => {
    try {
        const paper = papersStore[req.params.paperId];
        if (!paper) return res.status(404).json({ error: "Paper not found" });

        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${paper.configuration.subject}_Paper.pdf"`);
        
        doc.pipe(res);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text(`${paper.configuration.subject.toUpperCase()} QUESTION PAPER`, { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).font('Helvetica').text(`Class X`, { align: 'center' });
        doc.text(`Maximum Marks: ${paper.configuration.totalMarks}`, { align: 'center' });
        doc.text(`Time: 2 Hours`, { align: 'center' });
        
        doc.moveDown(2);
        
        // Instructions
        doc.fontSize(14).font('Helvetica-Bold').text('General Instructions');
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica');
        doc.text('1. All questions are compulsory.');
        doc.text('2. Read each question carefully.');
        doc.text('3. Show necessary working where applicable.');
        doc.moveDown(2);

        // Questions
        paper.questions.forEach((q) => {
            doc.font('Helvetica-Bold').text(`Q${q.questionNumber}. [${q.marks} Marks]`);
            doc.moveDown(0.5);
            doc.font('Helvetica').text(q.question);
            
            if (q.type.toLowerCase() === 'mcq' && q.options) {
                doc.moveDown(0.5);
                q.options.forEach((opt, idx) => {
                    doc.text(`${String.fromCharCode(65 + idx)}. ${opt}`, { indent: 20 });
                });
            }
            doc.moveDown(1.5);
        });

        doc.end();

    } catch (error) {
        console.error("PDF Error:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
});

const { getAllQuestions } = require('./services/questionBank');

app.get('/api/questions', (req, res) => {
    try {
        const questions = getAllQuestions();
        res.json(questions);
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        res.status(500).json({ error: "Failed to fetch question bank" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
