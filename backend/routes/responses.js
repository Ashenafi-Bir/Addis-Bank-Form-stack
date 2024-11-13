const express = require('express');
const router = express.Router();
const db = require('../models');
const rateLimit = require('express-rate-limit');
const { Parser } = require('json2csv');
const { v4: uuidv4 } = require('uuid');  

// Middleware for rate-limiting by IP address
const formSubmissionLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 1, // Limit each IP to 1 submission per 2 minutes
    message: "You can only submit once every 2 minutes. Please wait and try again.",
});

// Import uuid to generate unique submission IDs

router.post('/', formSubmissionLimiter, async (req, res) => {
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


router.get('/export/:formId', async (req, res) => {
    const { formId } = req.params;
    try {
        // Fetch all questions for the form to structure the header columns
        const questions = await db.Question.findAll({
            where: { formId },
            attributes: ['id', 'questionText']
        });

        const questionMap = questions.reduce((map, question) => {
            map[question.id] = question.questionText;
            return map;
        }, {});

        // Fetch all responses for the form
        const responses = await db.Response.findAll({
            where: { formId }
        });

        // Group responses by submissionId
        const responseRows = {};
        responses.forEach((response) => {
            const { questionId, answer, submissionId } = response;
            if (!responseRows[submissionId]) {
                responseRows[submissionId] = {};
            }
            responseRows[submissionId][questionMap[questionId]] = answer;
        });

        // Convert response rows to array format with headers
        const csvHeaders = questions.map(q => q.questionText);
        const csvRows = Object.values(responseRows).map(row => 
            csvHeaders.map(header => row[header] || "")
        );

        // Add header as the first row
        csvRows.unshift(csvHeaders);

        // Generate CSV
        const csvParser = new Parser({ header: false, withBOM: true });
        const csvData = csvParser.parse(csvRows);

        // Set UTF-8 encoding and response headers
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.header('Content-Disposition', `attachment; filename=form_${formId}_responses.csv`);
        res.send(csvData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
