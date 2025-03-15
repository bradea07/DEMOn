import axios from "axios";

const API_URL = "http://localhost:8080/api/products"; // Ensure this matches your backend

export const getAllProducts = async () => {
  return await axios.get(API_URL);
};

export const getProductById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const createProduct = async (productData) => {
  return await axios.post(API_URL, productData);
};

export const updateProduct = async (id, productData) => {
  return await axios.put(`${API_URL}/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
