// services/userService.js

import { BASE_URL } from './config'; 

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    // If the response is successful, return the token
    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      // Handle the case where the backend responds with an error (e.g., invalid username/password)
      return { success: false, message: data.message || 'Invalid username or password' };
    }
  } catch (error) {
    // Handle network or server errors
    console.error('Error logging in:', error);
    return { success: false, message: 'An error occurred while logging in. Please try again later.' };
  }
};
