const express = require('express');
const router = express.Router();
const db = require('../models');
const { Parser } = require('json2csv');
const { v4: uuidv4 } = require('uuid');  

// Import uuid to generate unique submission IDs

router.post('/', async (req, res) => {  // Removed formSubmissionLimiter middleware
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
            attributes: ['questionId', 'answer', 'createdAt']
        });

        // Group responses by submission time
        const groupedResponses = {};
        responses.forEach(response => {
            const timestamp = response.createdAt.getTime();
            if (!groupedResponses[timestamp]) groupedResponses[timestamp] = {};
            groupedResponses[timestamp][questionMap[response.questionId]] = response.answer;
        });

        // Prepare CSV headers and rows
        const csvHeaders = Object.values(questionMap);  // Question texts as headers
        const csvRows = Object.values(groupedResponses).map(response =>
            csvHeaders.map(header => response[header] || "")  // Fill each row with answers or empty strings
        );

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
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
