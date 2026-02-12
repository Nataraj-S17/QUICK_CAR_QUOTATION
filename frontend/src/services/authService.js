import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const authService = {
    /**
     * Login Admin
     * @param {string} email 
     * @param {string} password 
     */
    loginAdmin: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/admin/login`, {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
            }

            return response.data;
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : { message: 'Network Error' };
        }
    },

    /**
     * Register Customer
     * @param {Object} userData 
     */
    registerCustomer: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/customer/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : { message: 'Network Error' };
        }
    },

    /**
     * Login Customer
     * @param {string} email 
     * @param {string} password 
     */
    loginCustomer: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/customer/login`, {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('customerToken', response.data.token);
                localStorage.setItem('customerUser', JSON.stringify(response.data.customer));
            }

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : { message: 'Network Error' };
        }
    },

    /**
     * Logout Admin
     */
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    },

    /**
     * Logout Customer
     */
    logoutCustomer: () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerUser');
        window.location.href = '/login';
    },

    /**
     * Get Current Admin Token
     */
    getToken: () => {
        return localStorage.getItem('adminToken');
    },

    /**
     * Get Current Customer Token
     */
    getCustomerToken: () => {
        return localStorage.getItem('customerToken');
    }
};

export default authService;
