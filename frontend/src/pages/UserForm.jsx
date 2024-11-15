// UserForm.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFormData, submitFormResponses } from '../services/formService';
import './UserForm.css';

const UserForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch form data
    useEffect(() => {
        fetchFormData(formId)
            .then(data => setForm(data))
            .catch(error => console.error("Error fetching form:", error));
    }, [formId]);

    const handleChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFormResponses(formId, responses);
            alert("Form submitted successfully!");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (isSubmitted) {
        return <p className="success-message">Your questionnaire has been submitted successfully!</p>;
    }

    if (!form) return <p>Loading questionnaire...</p>;

    return (
        <div className="container-me">
            <div className="form-container1">
                <h2>{form.title}</h2>
                {form.description && <p className="form-description">{form.description}</p>}
                <form onSubmit={handleSubmit}>
                    {form.questions.map((question, index) => (
                        <div key={question.id} className="question-container">
                            <label>
                                <span className="question-number">{index + 1}.</span>
                                {question.questionText}
                            </label>
                            
                            {/* Display subdescription if available */}
                            {question.subdescription && (
                                <p className="subdescription">{question.subdescription}</p>
                            )}

                            {question.type === "short" && (
                                <input
                                    type="text"
                                    value={responses[question.id] || ''}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                    required
                                />
                            )}

                            {question.type === "radio" && (
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

                            {question.type === "checkbox" && (
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
