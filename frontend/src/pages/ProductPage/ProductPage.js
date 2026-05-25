import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { catalogueAPI, ratingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingData, setRatingData] = useState({
    rating: 5,
    review: ''
  });

  useEffect(() => {
    fetchProduct();
    fetchRatings();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await catalogueAPI.getProductById(id);
      setProduct(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await ratingsAPI.getProductRatings(id);
      setRatings(response.data.data || []);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRating = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to add a rating');
      return;
    }

    try {
      await ratingsAPI.createRating(
        parseInt(id),
        user.id,
        ratingData.rating,
        ratingData.review
      );
      setRatingData({ rating: 5, review: '' });
      setShowRatingForm(false);
      fetchRatings();
    } catch (err) {
      setError('Failed to add rating');
      console.error('Error adding rating:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div className="product-page">
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-image-large" />
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
          
          <div className="product-meta">
            <div className="price-section">
              <span className="label">Price:</span>
              <span className="price">${product.price}</span>
            </div>
            <div className="stock-section">
              <span className="label">Stock:</span>
              <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ratings-section">
        <h2>Reviews & Ratings</h2>
        
        <div className="ratings-summary">
          <div className="avg-rating">
            <span className="rating-value">{avgRating}</span>
            <span className="rating-count">({ratings.length} reviews)</span>
          </div>
          
          {user && (
            <button
              className="add-rating-btn"
              onClick={() => setShowRatingForm(!showRatingForm)}
            >
              {showRatingForm ? 'Cancel' : 'Add a Review'}
            </button>
          )}
        </div>

        {showRatingForm && user && (
          <form className="rating-form" onSubmit={handleAddRating}>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={ratingData.rating}
                onChange={(e) => setRatingData({...ratingData, rating: parseInt(e.target.value)})}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>

            <div className="form-group">
              <label>Review</label>
              <textarea
                value={ratingData.review}
                onChange={(e) => setRatingData({...ratingData, review: e.target.value})}
                placeholder="Share your experience with this product..."
              />
            </div>

            <button type="submit">Submit Review</button>
          </form>
        )}

        {!user && (
          <p className="login-prompt">Please <a href="/login">login</a> to add a review</p>
        )}

        <div className="ratings-list">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating.id} className="rating-item">
                <div className="rating-header">
                  <span className="rating-stars">
                    {'⭐'.repeat(rating.rating)}
                  </span>
                  <span className="rating-date">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rating.review && <p className="rating-review">{rating.review}</p>}
              </div>
            ))
          ) : (
            <p className="no-ratings">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
