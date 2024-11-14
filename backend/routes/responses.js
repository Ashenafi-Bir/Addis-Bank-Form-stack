const express = require('express');
const router = express.Router();
const db = require('../models');
const { Parser } = require('json2csv');
const { v4: uuidv4 } = require('uuid');  

// Import uuid to generate unique submission IDs
// Submit Responses with Unique Submission ID
router.post('/', async (req, res) => {
    const { formId, responses } = req.body;
    const submissionId = uuidv4();  // Generate a unique submission ID

    try {
        for (const [questionId, answer] of Object.entries(responses)) {
            await db.Response.create({
                formId,
                questionId,
                answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
                submissionId,  // Include the unique submissionId
            });
        }
        res.status(201).json({ message: "Responses submitted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Export responses as CSV with question headers and submission rows
router.get('/export/:formId', async (req, res) => {
    const { formId } = req.params;

    // Check if the form exists
    const form = await db.Form.findByPk(formId);
    if (!form) {
        return res.status(404).json({ error: 'Form not found' });
    }

    try {
        // Fetch all questions for the form to use as headers
        const questions = await db.Question.findAll({
            where: { formId },
            attributes: ['id', 'questionText']
        });

        // Create a map of question IDs to question texts (for CSV headers)
        const questionMap = questions.reduce((map, question) => {
            map[question.id] = question.questionText;
            return map;
        }, {});

        // Fetch all responses for the form
        const responses = await db.Response.findAll({
            where: { formId },
            attributes: ['questionId', 'answer', 'submissionId', 'createdAt']
        });

        // Group responses by submissionId
        const groupedResponses = responses.reduce((groups, response) => {
            const { submissionId, questionId, answer, createdAt } = response;
            if (!groups[submissionId]) {
                groups[submissionId] = {
                    submissionId,
                    createdAt,
                    answers: {}
                };
            }
            groups[submissionId].answers[questionId] = answer;
            return groups;
        }, {});

        // Prepare CSV headers
        const csvHeaders = ['Submission ID', 'Timestamp', ...Object.values(questionMap)];  // Include Submission ID and Timestamp as headers

        // Prepare CSV rows, one row per submission
        const csvRows = Object.values(groupedResponses).map(group => {
            const { submissionId, createdAt, answers } = group;
            const row = new Array(csvHeaders.length).fill(''); // Initialize an empty row with the same length as the headers
            
            // Set Submission ID and Timestamp at the first columns (index 0 and 1)
            row[0] = submissionId; // Submission ID
            row[1] = createdAt.toISOString(); // Timestamp in ISO format

            // Add answers to the corresponding columns for each question
            Object.keys(answers).forEach(questionId => {
                const questionText = questionMap[questionId];
                const questionIndex = csvHeaders.indexOf(questionText);
                row[questionIndex] = answers[questionId];
            });

            return row;
        });

        // Add headers as the first row
        csvRows.unshift(csvHeaders);

        // Generate CSV data
        const csvParser = new Parser({ header: false, withBOM: true });
        const csvData = csvParser.parse(csvRows);

        // Send CSV file in response
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`form_${formId}_responses.csv`);
        res.send(csvData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
