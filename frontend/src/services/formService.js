// services/formService.js

import axios from 'axios';
import { BASE_URL } from './config'; 

// Create Form
export const createForm = async (title, description, questions) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/forms`, { title, description, questions });
    if (response.status === 201) {
      return { success: true, form: response.data.form };
    } else {
      return { success: false, message: 'Failed to create form. Please try again.' };
    }
  } catch (error) {
    console.error('Error creating form:', error);
    return { success: false, message: 'An error occurred while creating the form.' };
  }
};

// Fetch Form
export const fetchForm = async (formId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/forms/${formId}`);
    return { success: true, form: response.data };
  } catch (error) {
    console.error('Error fetching form:', error);
    return { success: false, message: 'Failed to load form. Please try again.' };
  }
};

// Update Form
export const updateForm = async (formId, title, description, questions) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/forms/${formId}`, {
      title,
      description,
      questions,
    });
    return { success: true, message: 'Form updated successfully.' };
  } catch (error) {
    console.error('Error updating form:', error);
    return { success: false, message: 'Failed to update form.' };
  }
};

// Delete Question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/questions/${questionId}`);
    return { success: true, message: 'Question deleted successfully.' };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, message: 'Failed to delete question.' };
  }
};

// Fetch all Forms
export const fetchForms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/forms`);
      return { success: true, forms: response.data };
    } catch (error) {
      console.error('Error fetching forms:', error);
      return { success: false, message: 'Failed to fetch forms. Please try again.' };
    }
  };
  
  // Delete a Form
  export const deleteForm = async (formId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/forms/${formId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting form:', error);
      return { success: false, message: 'Failed to delete form.' };
    }
  };