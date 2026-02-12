import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000/api';

const requirementService = {
    /**
     * Submit Customer Requirements
     * @param {Object} requirements - { budget, usageType, mileageImportance, maintenancePreference }
     */
    submitRequirements: async (requirements) => {
        try {
            const token = authService.getCustomerToken();

            if (!token) {
                throw { message: 'Authentication token not found. Please login.' };
            }

            const response = await axios.post(`${API_URL}/customer/requirements`, requirements, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error("Requirement Submission Error:", error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : { message: error.message || 'Network Error' };
        }
    }
};

export default requirementService;
