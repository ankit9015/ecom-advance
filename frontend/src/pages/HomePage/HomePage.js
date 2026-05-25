import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { catalogueAPI } from '../services/api';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await catalogueAPI.getAllProducts(page, 10);
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await catalogueAPI.searchProducts(searchQuery);
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1>Product Catalogue</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card-link">
              <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="no-products">No products found</div>
      )}
    </div>
  );
}

export default HomePage;
