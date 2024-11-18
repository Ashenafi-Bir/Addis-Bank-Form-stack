import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFormData, submitFormResponses } from '../services/formService';
import './UserForm.css';

const UserForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch form data
    useEffect(() => {
        fetchFormData(formId)
            .then(data => setForm(data))
            .catch(error => console.error("Error fetching form:", error));
    }, [formId]);

    const handleChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value,  // Update the response for the given question
        });
    };

    // Validate the form before submission
    const validateForm = () => {
        for (let question of form.questions) {
            // If the question type is "short" or "radio", ensure it's answered
            if ((question.type === "short" || question.type === "radio") && !responses[question.id]) {
                return false;
            }

            // For checkbox, allow none to be selected (no requirement to select any checkbox)
            if (question.type === "checkbox" && responses[question.id] === undefined) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate before submission
        if (!validateForm()) {
            setErrorMessage("Please answer all required questions.");
            return;
        }

        try {
            await submitFormResponses(formId, responses);
            setIsSubmitted(true); // Form submitted successfully
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
                
                {/* Display error message if any */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

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
                                                name={`question_${question.id}`} // Ensure each radio group has a unique name
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
