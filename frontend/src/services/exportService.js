// src/services/exportService.js

import axios from 'axios';
import { BASE_URL } from './config'; 

// Function to fetch form details by formId
export const fetchFormDetails = (formId) => {
  return axios.get(`${BASE_URL}/api/forms/${formId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching form details:', error);
      throw error;
    });
};

// Function to fetch form responses in CSV format
export const fetchFormResponsesCSV = (formId) => {
  return axios.get(`${BASE_URL}/api/responses/export/${formId}`, { responseType: 'blob' })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching form responses:', error);
      throw error;
    });
};
