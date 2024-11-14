// components/AdminFormEditor.js
import React, { useState, useEffect } from 'react';
import { fetchForm, updateForm, deleteQuestion } from '../services/formService'; // Import from formService
import './AdminFormEditor.css';
import { useNavigate } from 'react-router-dom';

const AdminFormEditor = ({ formId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadForm = async () => {
            const result = await fetchForm(formId);
            if (result.success) {
                const { title, description, questions } = result.form;
                setTitle(title);
                setDescription(description);
                setQuestions(questions.map((q) => ({
                    ...q,
                    text: q.questionText || '',
                    options: q.options || [],
                })));
            } else {
                setErrorMessage(result.message);
            }
        };
        loadForm();
    }, [formId]);

    const handleQuestionChange = (index, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, i) => i === index ? { ...q, [field]: value } : q)
        );
    };

    const handleOptionsChange = (index, options) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q, i) => i === index ? { ...q, options } : q)
        );
    };

    const addQuestion = () => setQuestions([...questions, { text: '', type: 'short', options: [] }]);

    const deleteQuestionHandler = async (index) => {
        const question = questions[index];
        const result = question.id ? await deleteQuestion(question.id) : { success: true };
        
        if (result.success) {
            setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
            setSuccessMessage('Question deleted successfully.');
        } else {
            setErrorMessage(result.message);
        }
    };

    const updateFormHandler = async () => {
        const result = await updateForm(formId, title, description, questions);
        if (result.success) {
            setSuccessMessage(result.message);
            setErrorMessage('');
        } else {
            setErrorMessage(result.message);
        }
    };

    return (
        <div className="admin-form-editor">
            <h1>Edit Questioner</h1>
            <div className="form-container">
                <label htmlFor="title">Questioner Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Form Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="description">Questioner Description</label>
                <textarea
                    id="description"
                    placeholder="Form Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {questions.map((q, index) => (
                    <div key={q.id || index} className="question-container">
                        <label htmlFor={`question-text-${index}`}>Question {index + 1}</label>
                        <input
                            id={`question-text-${index}`}
                            type="text"
                            placeholder="Question Text"
                            value={q.text || ''}
                            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        />

                        <label htmlFor={`question-type-${index}`}>Question Type</label>
                        <select
                            id={`question-type-${index}`}
                            value={q.type}
                            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                        >
                            <option value="short">Short Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkbox</option>
                        </select>

                        {(q.type === 'radio' || q.type === 'checkbox') && (
                            <>
                                <label htmlFor={`question-options-${index}`}>Options (comma separated)</label>
                                <input
                                    id={`question-options-${index}`}
                                    type="text"
                                    placeholder="Options (comma separated)"
                                    value={q.options.join(',')}
                                    onChange={(e) => handleOptionsChange(index, e.target.value.split(','))}
                                />
                            </>
                        )}

                        {/* <button onClick={() => deleteQuestionHandler(index)}>Delete Question</button> */}
                    </div>
                ))}

                <button className="add-question-btn" onClick={addQuestion}>Add Question</button>
                <button className="create-form-btn" onClick={updateFormHandler}>Save Changes</button>
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={() => navigate(-1)}>Back to Questioners</button>
        </div>
    );
};

export default AdminFormEditor;
