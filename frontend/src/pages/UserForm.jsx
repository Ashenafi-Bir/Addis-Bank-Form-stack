// components/UserForm.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFormDetails, submitFormResponse } from '../services/userFormService'; // Import service functions
import './UserForm.css';

const UserForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Check if the form has been recently submitted
    useEffect(() => {
        const lastSubmission = localStorage.getItem(`form_${formId}_submitted`);
        if (lastSubmission) {
            const timeSinceSubmission = Date.now() - lastSubmission;
            if (timeSinceSubmission < 2 * 60 * 1000) {
                setIsSubmitted(true);
            }
        }

        // Fetch the form data if it hasn't been submitted recently
        if (!isSubmitted) {
            const fetchDetails = async () => {
                const result = await fetchFormDetails(formId);
                if (result.success) {
                    setForm(result.formDetails);
                } else {
                    console.error(result.message);
                }
            };
            fetchDetails();
        }
    }, [formId, isSubmitted]);

    const handleChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await submitFormResponse(formId, responses);
        if (result.success) {
            alert('Form submitted successfully!');

            // Save submission timestamp to block access for 2 minutes
            localStorage.setItem(`form_${formId}_submitted`, Date.now());
            setIsSubmitted(true);
        } else {
            alert(result.message || 'Error submitting form.');
        }
    };

    if (isSubmitted) {
        return <p className="success-message">Your form has been submitted successfully! </p>;
    }

    if (!form) return <p>Loading form...</p>;

    return (
        <div className='container-me'>
            <div className="form-container1">
                <h2>{form.title}</h2>

                {/* Display the description of the form */}
                {form.description && <p className="form-description">{form.description}</p>}

                <form onSubmit={handleSubmit}>
                    {form.questions.map((question) => (
                        <div key={question.id} className="question-container">
                            <label>{question.questionText}</label>
                            {question.type === 'short' && (
                                <input
                                    type="text"
                                    value={responses[question.id] || ''}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                    required
                                />
                            )}
                            {question.type === 'radio' && (
                                <div className="options-row">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="option-label">
                                            <input
                                                type="radio"
                                                name={`question_${question.id}`}
                                                value={option}
                                                checked={responses[question.id] === option}
                                                onChange={(e) => handleChange(question.id, e.target.value)}
                                                required
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {question.type === 'checkbox' && (
                                <div className="options-row">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="option-label">
                                            <input
                                                type="checkbox"
                                                value={option}
                                                checked={responses[question.id]?.includes(option) || false}
                                                onChange={(e) => {
                                                    const selectedOptions = responses[question.id] || [];
                                                    handleChange(question.id, e.target.checked
                                                        ? [...selectedOptions, option]
                                                        : selectedOptions.filter(opt => opt !== option)
                                                    );
                                                }}
                                                required
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
