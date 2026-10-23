import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api", timeout: 10000 });
const DEMO_USER_ID = 1;

export const getProducts = async () => (await api.get("/products")).data;
export const getCart = async () => (await api.get(`/cart/${DEMO_USER_ID}`)).data;
export const addToCart = async (productId) =>
  (await api.post(`/cart/${DEMO_USER_ID}/items`, { productId, quantity: 1 })).data;
export const setQuantity = async (productId, quantity) =>
  (await api.patch(`/cart/${DEMO_USER_ID}/items/${productId}`, { quantity })).data;
export const removeItem = async (productId) =>
  (await api.delete(`/cart/${DEMO_USER_ID}/items/${productId}`)).data;
export const clearCart = async () => (await api.delete(`/cart/${DEMO_USER_ID}`)).data;
