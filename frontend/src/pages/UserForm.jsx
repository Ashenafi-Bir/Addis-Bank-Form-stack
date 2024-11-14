// UserForm.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserForm.css';

const UserForm = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch form data
    useEffect(() => {
        axios.get(`http://localhost:5000/api/forms/${formId}`)
            .then(response => setForm(response.data))
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
            await axios.post(`http://localhost:5000/api/responses`, {
                formId,
                responses,
            });
            alert("Form submitted successfully!");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (isSubmitted) {
        return <p className="success-message">Your form has been submitted successfully!</p>;
    }

    if (!form) return <p>Loading form...</p>;

    return (
        <div className='container-me'> 
            <div className="form-container1">
                <h2>{form.title}</h2>
                {form.description && <p className="form-description">{form.description}</p>}
                <form onSubmit={handleSubmit}>
                    {form.questions.map((question) => (
                        <div key={question.id} className="question-container">
                            <label>{question.questionText}</label>
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