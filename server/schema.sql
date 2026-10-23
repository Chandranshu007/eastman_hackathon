-- Run this script after connecting to shopping_cart_db.
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category VARCHAR(80) NOT NULL DEFAULT 'General',
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL DEFAULT '',
    stock INTEGER NOT NULL DEFAULT 100 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

INSERT INTO products (name, description, category, price, image_url, stock)
SELECT v.name, v.description, v.category, v.price, v.image_url, v.stock
FROM (VALUES
 ('Wireless Headphones', 'Comfortable over-ear headphones with rich sound.', 'Electronics', 1499.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 25),
 ('Smart Watch', 'Everyday smartwatch with activity tracking.', 'Electronics', 2299.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 18),
 ('Running Shoes', 'Lightweight shoes for everyday workouts.', 'Fashion', 1899.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 30),
 ('Travel Backpack', 'Durable backpack with space for daily essentials.', 'Accessories', 999.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 20),
 ('Sunglasses', 'Classic sunglasses with a modern frame.', 'Accessories', 799.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', 40),
 ('Bluetooth Speaker', 'Portable speaker for music at home or outdoors.', 'Electronics', 1299.00, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 15)
 
) AS v(name, description, category, price, image_url, stock)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);
