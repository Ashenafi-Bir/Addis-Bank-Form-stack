// components/AdminFormList.js

import React, { useState, useEffect } from 'react';
import { fetchForms, deleteForm } from '../services/formService';  // Import the service functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faLink, faCopy } from '@fortawesome/free-solid-svg-icons';  // Import icons
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
            <h1 className="form-list-title">All questionnaires List</h1>
            <ul className="form-list">
                {forms.map((form, index) => (
                    <li key={form.id} className="form-list-item">
                        {/* Row 1: Form Number, Title, and Buttons */}
                        <div className="form-item-row">
                            <span className="form-number">{index + 1}</span>
                            <p className="form-title">{form.title}</p>
                            <div className="form-buttons">
                                <button className="edit-form-btn" onClick={() => onSelectForm(form.id)}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button className="delete-form-btn" onClick={() => handleDeleteForm(form.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                </button>
                                <button className="generate-link-btn" onClick={() => handleGenerateLink(form.id)}>
                                    <FontAwesomeIcon icon={faLink} /> Generate Link
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Generated Link */}
                        {linkVisible[form.id] && (
                            <div className="generated-link-row">
                                <span>{`${window.location.origin}/form/${form.id}`}</span>
                                <button className="copy-link-btn" onClick={() => handleCopyLink(form.id)}>
                                    <FontAwesomeIcon icon={faCopy} /> Copy Link
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminFormList;
