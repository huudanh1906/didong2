import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // Adjust your base URL accordingly

// Function to fetch product details by slug
export const getProductBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chi-tiet-san-pham/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details", error);
        throw error;
    }
};
