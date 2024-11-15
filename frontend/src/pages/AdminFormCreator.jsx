// AdminFormCreator.js
import React, { useState } from 'react';
import { createForm } from '../services/formService'; // Import createForm from formService
import AdminFormList from './AdminFormList';
import AdminFormEditor from './AdminFormEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faList, faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Import relevant icons
import './AdminFormCreator.css';  // Importing the CSS file

const AdminFormCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'short', options: [] }]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdForm, setCreatedForm] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  const addQuestion = () => setQuestions([...questions, { text: '', type: 'short', options: [] }]);

  const handleCreateForm = async () => {
    const result = await createForm(title, description, questions); // Call createForm from formService
    if (result.success) {
      setCreatedForm(result.form);
      setTitle('');
      setDescription('');
      setQuestions([{ text: '', type: 'short', options: [], subDescription: '' }]); // Reset questions
      setSuccessMessage('Form created successfully!');
      setErrorMessage('');
    } else {
      setErrorMessage(result.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="admin-form-creator">
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={() => setActiveTab('create')}>
          <FontAwesomeIcon icon={faFileAlt} /> Create questionnaire
        </button>
        <button onClick={() => setActiveTab('list')}>
          <FontAwesomeIcon icon={faList} /> View All questionnaire
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="form-container">
          <h2>Create questionnaire</h2>
          <input className='title'
            type="text" 
            placeholder="questionnaire Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
          <textarea 
            placeholder="Questioners Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)} // Capture description
            rows="5"
          />
          {questions.map((q, index) => (
            <div key={index}>
              <input 
                type="text"
                placeholder="Question Text"
                value={q.text}
                onChange={e => setQuestions(questions.map((ques, i) => i === index ? { ...ques, text: e.target.value } : ques))} 
              />
              <select 
                value={q.type} 
                onChange={e => setQuestions(questions.map((ques, i) => i === index ? { ...ques, type: e.target.value } : ques))} 
              >
                <option value="short">Short Answer</option>
                <option value="radio">Multiple Choice</option>
                <option value="checkbox">Checkboxes</option>
              </select>
              {(q.type === 'radio' || q.type === 'checkbox') && (
                <input 
                  type="text" 
                  placeholder="Options (comma separated)" 
                  onChange={e => setQuestions(questions.map((ques, i) => i === index ? { ...ques, options: e.target.value.split(',') } : ques))} 
                />
              )}
            </div>
          ))}
          <button className="add-question-btn" onClick={addQuestion}>
            <FontAwesomeIcon icon={faPlus} /> Add Question
          </button>
          <button className="create-form-btn" onClick={handleCreateForm}>
            <FontAwesomeIcon icon={faFileAlt} /> Create questionnaire
          </button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}

      {activeTab === 'list' && (
        <div>
          <AdminFormList 
            onSelectForm={(formId) => {
              setSelectedFormId(formId);
              setActiveTab('edit');
            }} 
          />
        </div>
      )}

      {activeTab === 'edit' && selectedFormId && (
        <div>
          <AdminFormEditor formId={selectedFormId} />
        </div>
      )}
    </div>
  );
};

export default AdminFormCreator;

