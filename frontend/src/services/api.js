import axios from 'axios';

const API_BASE_URLS = {
  catalogue: process.env.REACT_APP_CATALOGUE_URL || 'http://localhost:5001',
  user: process.env.REACT_APP_USER_URL || 'http://localhost:5002',
  ratings: process.env.REACT_APP_RATINGS_URL || 'http://localhost:5003'
};

// Catalogue API
export const catalogueAPI = {
  getAllProducts: (page = 1, limit = 10) =>
    axios.get(`${API_BASE_URLS.catalogue}/api/products`, { params: { page, limit } }),
  getProductById: (id) =>
    axios.get(`${API_BASE_URLS.catalogue}/api/products/${id}`),
  searchProducts: (query) =>
    axios.get(`${API_BASE_URLS.catalogue}/api/products/search`, { params: { q: query } })
};

// User API
export const userAPI = {
  register: (email, password, firstName, lastName) =>
    axios.post(`${API_BASE_URLS.user}/api/auth/register`, {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    }),
  login: (email, password) =>
    axios.post(`${API_BASE_URLS.user}/api/auth/login`, { email, password }),
  getProfile: (userId) =>
    axios.get(`${API_BASE_URLS.user}/api/users/${userId}`),
  updateProfile: (userId, data) =>
    axios.put(`${API_BASE_URLS.user}/api/users/${userId}`, data)
};

// Ratings API
export const ratingsAPI = {
  getProductRatings: (productId) =>
    axios.get(`${API_BASE_URLS.ratings}/api/ratings/product/${productId}`),
  createRating: (productId, userId, rating, review) =>
    axios.post(`${API_BASE_URLS.ratings}/api/ratings`, {
      product_id: productId,
      user_id: userId,
      rating,
      review
    }),
  updateRating: (ratingId, rating, review) =>
    axios.put(`${API_BASE_URLS.ratings}/api/ratings/${ratingId}`, { rating, review }),
  deleteRating: (ratingId) =>
    axios.delete(`${API_BASE_URLS.ratings}/api/ratings/${ratingId}`)
};
