
INSERT INTO products (name, category, price, stock)
VALUES
('Wireless Headphones', 'Electronics', 1999.00, 20),
('Smart Watch', 'Electronics', 2499.00, 15),
('Bluetooth Speaker', 'Electronics', 1499.00, 12),
('USB-C Hub', 'Accessories', 899.00, 25),
('Laptop Stand', 'Accessories', 799.00, 18),
('Desk Lamp', 'Home', 599.00, 30),
('Wireless Mouse', 'Accessories', 699.00, 22),
('Mechanical Keyboard', 'Electronics', 2999.00, 10),
('Water Bottle', 'Home', 399.00, 40),
('Laptop Backpack', 'Accessories', 1299.00, 14);

INSERT INTO coupons
    (code, discount_type, discount_value, min_order_amount, max_discount)
VALUES
('SAVE10', 'percent', 10, 500, 500),
('FLAT100', 'fixed', 100, 1000, NULL);
