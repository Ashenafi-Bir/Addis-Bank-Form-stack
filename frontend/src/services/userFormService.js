// services/userFormService.js

import axios from 'axios';
import { BASE_URL } from './config'; 

// Fetch form details by formId
export const fetchFormDetails = async (formId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/forms/${formId}`);
        return { success: true, formDetails: response.data };
    } catch (error) {
        console.error('Error fetching form details:', error);
        return { success: false, message: 'Failed to fetch form details. Please try again.' };
    }
};

// Submit form responses
export const submitFormResponse = async (formId, responses) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/responses`, {
            formId,
            responses,
        });
        return { success: true };
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, message: 'Failed to submit form. Please try again.' };
    }
};
