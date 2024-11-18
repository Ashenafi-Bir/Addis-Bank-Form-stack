import React, { useState, useEffect } from 'react';
import { fetchForms, deleteForm } from '../services/formService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faLink, faCopy } from '@fortawesome/free-solid-svg-icons';
import './AdminFormList.css';

const AdminFormList = ({ onSelectForm }) => {
    const [forms, setForms] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' }); // Message for confirmation/error
    const [linkVisible, setLinkVisible] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false); // To control modal visibility
    const [formToDelete, setFormToDelete] = useState(null); // Store the form ID to delete

    useEffect(() => {
        const loadForms = async () => {
            const result = await fetchForms();
            if (result.success) {
                setForms(result.forms);
            } else {
                setMessage({ text: result.message, type: 'error' });
            }
        };
        loadForms();
    }, []);

    // Handle form deletion
    const handleDeleteForm = async () => {
        const result = await deleteForm(formToDelete);
        if (result.success) {
            setForms(forms.filter(form => form.id !== formToDelete));
            setMessage({ text: 'Form deleted successfully', type: 'success' });
        } else {
            setMessage({ text: result.message || 'Failed to delete form', type: 'error' });
        }
        setShowDeleteModal(false); // Close the modal after action
        setTimeout(() => setMessage({ text: '', type: '' }), 3000); // Clear message after 3 seconds
    };

    const handleCopyLink = (formId) => {
        const link = `${window.location.origin}/form/${formId}`;
        
        // Fallback for execCommand in case clipboard API doesn't work
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    
        setMessage({ text: 'Link copied to clipboard!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };
    

    const handleGenerateLink = (formId) => {
        setLinkVisible(prevState => ({ ...prevState, [formId]: !prevState[formId] }));
    };

    return (
        <div className="admin-form-list">
            {message.text && (
                <div className={`message-box ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Are you sure you want to delete this form?</h3>
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={handleDeleteForm}>Yes, Delete</button>
                            <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="form-list-title">All Questionnaires List</h1>
            <ul className="form-list">
                {forms.map((form, index) => (
                    <li key={form.id} className="form-list-item">
                        <div className="form-item-row">
                            <span className="form-number">{index + 1}</span>
                            <p className="form-title">{form.title}</p>
                            <div className="form-buttons">
                                <button className="edit-form-btn" onClick={() => onSelectForm(form.id)}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button className="delete-form-btn" onClick={() => {
                                    setFormToDelete(form.id);
                                    setShowDeleteModal(true);
                                }}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                                </button>
                                <button className="generate-link-btn" onClick={() => handleGenerateLink(form.id)}>
                                    <FontAwesomeIcon icon={faLink} /> Generate Link
                                </button>
                            </div>
                        </div>
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
