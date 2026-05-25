import os
from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://ecom_user:ecom_password@localhost:5432/ecom_db')

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ratings'
    }), 200

@app.route('/api/ratings/product/<int:product_id>', methods=['GET'])
def get_product_ratings(product_id):
    """Get all ratings for a product"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'error': 'Database connection failed'}), 500
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                'SELECT id, product_id, user_id, rating, review, created_at FROM ratings WHERE product_id = %s ORDER BY created_at DESC',
                (product_id,)
            )
            ratings = cur.fetchall()
        
        conn.close()
        
        # Calculate average rating
        if ratings:
            avg_rating = sum(r['rating'] for r in ratings) / len(ratings)
        else:
            avg_rating = 0
        
        return jsonify({
            'success': True,
            'data': ratings,
            'average_rating': round(avg_rating, 2),
            'total_ratings': len(ratings)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ratings', methods=['POST'])
def create_rating():
    """Create a new rating"""
    try:
        data = request.get_json()
        
        if not data or 'product_id' not in data or 'user_id' not in data or 'rating' not in data:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        product_id = data.get('product_id')
        user_id = data.get('user_id')
        rating = data.get('rating')
        review = data.get('review', '')
        
        if not (1 <= rating <= 5):
            return jsonify({'success': False, 'error': 'Rating must be between 1 and 5'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'error': 'Database connection failed'}), 500
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                'INSERT INTO ratings (product_id, user_id, rating, review) VALUES (%s, %s, %s, %s) RETURNING id, product_id, user_id, rating, review, created_at',
                (product_id, user_id, rating, review)
            )
            new_rating = cur.fetchone()
            conn.commit()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': dict(new_rating)
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ratings/<int:rating_id>', methods=['GET'])
def get_rating(rating_id):
    """Get a specific rating"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'error': 'Database connection failed'}), 500
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                'SELECT id, product_id, user_id, rating, review, created_at FROM ratings WHERE id = %s',
                (rating_id,)
            )
            rating = cur.fetchone()
        
        conn.close()
        
        if not rating:
            return jsonify({'success': False, 'error': 'Rating not found'}), 404
        
        return jsonify({
            'success': True,
            'data': dict(rating)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ratings/<int:rating_id>', methods=['PUT'])
def update_rating(rating_id):
    """Update a rating"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'error': 'Database connection failed'}), 500
        
        rating = data.get('rating')
        review = data.get('review')
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if rating and review:
                cur.execute(
                    'UPDATE ratings SET rating = %s, review = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, product_id, user_id, rating, review, created_at',
                    (rating, review, rating_id)
                )
            elif rating:
                cur.execute(
                    'UPDATE ratings SET rating = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, product_id, user_id, rating, review, created_at',
                    (rating, rating_id)
                )
            elif review:
                cur.execute(
                    'UPDATE ratings SET review = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, product_id, user_id, rating, review, created_at',
                    (review, rating_id)
                )
            else:
                conn.close()
                return jsonify({'success': False, 'error': 'No fields to update'}), 400
            
            updated_rating = cur.fetchone()
            if not updated_rating:
                conn.close()
                return jsonify({'success': False, 'error': 'Rating not found'}), 404
            
            conn.commit()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'data': dict(updated_rating)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/ratings/<int:rating_id>', methods=['DELETE'])
def delete_rating(rating_id):
    """Delete a rating"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'error': 'Database connection failed'}), 500
        
        with conn.cursor() as cur:
            cur.execute('DELETE FROM ratings WHERE id = %s', (rating_id,))
            deleted = cur.rowcount
            conn.commit()
        
        conn.close()
        
        if deleted == 0:
            return jsonify({'success': False, 'error': 'Rating not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Rating deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=os.getenv('FLASK_ENV') == 'development')
