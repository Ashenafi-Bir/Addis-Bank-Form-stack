// services/formExportService.js

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

// Fetch the CSV data and return it as text
export const fetchCsvData = async (formId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/responses/export/${formId}`, {
            responseType: 'blob',
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching CSV data:', error);
        return { success: false, message: 'Failed to fetch CSV data. Please try again.' };
    }
};

// Handle exporting form data as a CSV
export const exportCsv = async (formId) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/responses/export/${formId}`, {
            responseType: 'blob',
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error exporting data:', error);
        return { success: false, message: 'Error exporting data.' };
    }
};
