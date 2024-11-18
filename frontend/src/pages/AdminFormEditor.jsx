import React, { useState, useEffect } from 'react';
import { fetchForm, updateForm } from '../services/formService';
import './AdminFormEditor.css';
import { useNavigate } from 'react-router-dom';

const AdminFormEditor = ({ formId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSaveModal, setShowSaveModal] = useState(false); // Save confirmation modal state
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

    const confirmSaveHandler = async () => {
        const result = await updateForm(formId, title, description, questions);
        if (result.success) {
            setSuccessMessage(result.message);
            setErrorMessage('');
        } else {
            setErrorMessage(result.message);
        }
        setShowSaveModal(false);
    };

    return (
        <div className="admin-form-editor">
            <h1>Edit questionnaire</h1>
            <div className="form-container">
                <label htmlFor="title">questionnaire Title</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Form Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="description">questionnaire Description</label>
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
                    </div>
                ))}

                <button className="add-question-btn" onClick={addQuestion}>Add Question</button>
                <button className="create-form-btn" onClick={() => setShowSaveModal(true)}>Save Changes</button>
            </div>

            {successMessage && <div className="popup success">{successMessage}</div>}
            {errorMessage && <div className="popup error">{errorMessage}</div>}

            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Are you sure you want to save these changes?</h3>
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={confirmSaveHandler}>Yes, Save</button>
                            <button className="cancel-btn" onClick={() => setShowSaveModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={() => navigate(-1)}>Back to questionnaires</button>
        </div>
    );
};

export default AdminFormEditor;
