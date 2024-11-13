// components/AdminFormList.js

import React, { useState, useEffect } from 'react';
import { fetchForms, deleteForm } from '../services/formService';  // Import the service functions
import './AdminFormList.css';

const AdminFormList = ({ onSelectForm }) => {
    const [forms, setForms] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Store the visibility state for each form's generated link
    const [linkVisible, setLinkVisible] = useState({});

    useEffect(() => {
        const loadForms = async () => {
            const result = await fetchForms();
            if (result.success) {
                setForms(result.forms);
            } else {
                setErrorMessage(result.message);
            }
        };
        loadForms();
    }, []);

    // Handle form deletion
    const handleDeleteForm = async (formId) => {
        const result = await deleteForm(formId);
        if (result.success) {
            setForms(forms.filter(form => form.id !== formId)); // Remove the deleted form from state
            alert('Form deleted successfully');
        } else {
            alert(result.message || 'Failed to delete form');
        }
    };

    // Copy the generated link to clipboard
    const handleCopyLink = (formId) => {
        const link = `${window.location.origin}/form/${formId}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    // Toggle visibility of the generated link
    const handleGenerateLink = (formId) => {
        setLinkVisible(prevState => ({ ...prevState, [formId]: !prevState[formId] }));
    };

    return (
        <div className="admin-form-list">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <h1 className="form-list-title">Questioners List</h1>
            <ul className="form-list">
                {forms.map((form) => (
                    <li key={form.id} className="form-list-item">
                        <div className="form-item-content">
                            <p className="form-title">{form.title}</p>
                            <button className="edit-form-btn" onClick={() => onSelectForm(form.id)}>Edit</button>
                            <button className="delete-form-btn" onClick={() => handleDeleteForm(form.id)}>Delete </button>

                            {/* Generate Link Button */}
                            <div className="generate-link">
                                <button className="generate-link-btn" onClick={() => handleGenerateLink(form.id)}>
                                    Generate Link
                                </button>

                                {/* Show the generated link only when the button is clicked */}
                                {linkVisible[form.id] && (
                                    <div className="generated-link">
                                        <span>{`${window.location.origin}/form/${form.id}`}</span>
                                        <button className="copy-link-btn" onClick={() => handleCopyLink(form.id)}>
                                            Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminFormList;
