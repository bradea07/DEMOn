import axios from "axios";

const API_URL = "http://localhost:8080/api/products"; // Ensure this matches backend

export const getAllProducts = async () => {
  return await axios.get(`${API_URL}/all`); //  Correct endpoint
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, productData);

    if (response.data) {
      return response.data; //  Ensure we only parse valid JSON
    } else {
      console.error(" Error: Empty response from the server.");
      throw new Error("Empty response from the server.");
    }
  } catch (error) {
    console.error(" Error in createProduct:", error.response?.data || error.message);
    throw error;
  }
};

export const searchProducts = async (keyword) => {
  return await axios.get(`${API_URL}/search?keyword=${keyword}`);
};

export const filterProductsByCategory = async (category) => {
  return await axios.get(`${API_URL}/filter?category=${category}`);
};
