const express = require('express');
const router = express.Router();
const db = require('../models');

// Create a new form
// POST /api/forms
router.post('/', async (req, res) => {
    const { title, description, questions } = req.body;
    try {
        // Create the form with description
        const form = await db.Form.create({ title, description });

        // Create the questions and associate them with the form
        const createdQuestions = await Promise.all(questions.map(async (question) => {
            return await db.Question.create({
                formId: form.id,
                questionText: question.text,
                type: question.type,
                options: JSON.stringify(question.options),
                subDescription: question.subDescription || null,  // Ensure subDescription is saved
            });
        }));

        // Fetch the form with its associated questions
        const formWithQuestions = await db.Form.findByPk(form.id, {
            include: [{ model: db.Question, as: 'questions' }]
        });

        // Parse the options for each question if they exist
        formWithQuestions.questions.forEach(q => {
            if (q.options) q.options = JSON.parse(q.options);
        });

        // Respond with the form and associated questions
        res.status(201).json({ form: formWithQuestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Get form with questions by ID
router.get('/:formId', async (req, res) => {
    const { formId } = req.params;
    try {
        // Fetch form with associated questions including subdescription
        const form = await db.Form.findByPk(formId, {
            include: [{ model: db.Question, as: 'questions' }],
        });

        // If form is not found, return 404
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Parse the options for each question (if any)
        form.questions.forEach(q => {
            // Check if options exist and parse them
            if (q.options) {
                q.options = JSON.parse(q.options); // Convert the stringified options back to an array
            }
        });

        // Return the form along with its questions
        res.json(form);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all forms
router.get('/', async (req, res) => {
    try {
        const forms = await db.Form.findAll({ include: [{ model: db.Question, as: 'questions' }] });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Form (including Questions and Description)
router.put('/:formId', async (req, res) => {
    const { formId } = req.params;
    const { title, description, questions } = req.body;

    try {
        const form = await db.Form.findByPk(formId, {
            include: [{ model: db.Question, as: 'questions' }]
        });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Update form title and description
        form.title = title;
        form.description = description;
        await form.save();

        // Update or create each question
        for (const q of questions) {
            const question = await db.Question.findByPk(q.id);

            if (question) {
                // Update existing question
                question.questionText = q.text;
                question.type = q.type;
                question.options = JSON.stringify(q.options);
                await question.save();
            } else {
                // Create new question if no id
                await db.Question.create({
                    formId: form.id,
                    questionText: q.text,
                    type: q.type,
                    options: JSON.stringify(q.options),
                });
            }
        }

        // Fetch the updated form with questions
        const updatedForm = await db.Form.findByPk(formId, {
            include: [{ model: db.Question, as: 'questions' }]
        });

        res.json(updatedForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete Question
router.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const question = await db.Question.findByPk(id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        await question.destroy();
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete Form (along with its Questions)
router.delete('/:formId', async (req, res) => {
    const { formId } = req.params;

    try {
        // Find the form by ID, including its associated questions
        const form = await db.Form.findByPk(formId, {
            include: [{ model: db.Question, as: 'questions' }]
        });

        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Delete all questions associated with the form
        await db.Question.destroy({ where: { formId } });

        // Delete the form itself
        await form.destroy();

        res.status(200).json({ message: 'Form and its questions deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
