-- DYNAMIC ROLE INJECTION
-- Switches context to your worker role so it owns the dummy records natively
SET ROLE :"app_user";

-- =========================================================================
-- 1. SEED STOREFRONT CUSTOMERS & ADMINISTRATORS (Production Safe)
-- =========================================================================
-- ON CONFLICT (email) DO NOTHING: If the email already exists in the users table, 
-- Postgres gracefully skips the row instead of throwing an error or wiping data.

INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
VALUES 
('admin@store.com', '$2b$10$K7Z2g1.SjIqM9sU9uI2vOeE9O9uE6u2e3e4e5e6e7e8e9e0e1e2e3', 'Store', 'Admin', TRUE),
('developer@test.com', '$2b$10$K7Z2g1.SjIqM9sU9uI2vOeE9O9uE6u2e3e4e5e6e7e8e9e0e1e2e3', 'Sam', 'Brickett', FALSE)
ON CONFLICT (email) DO NOTHING;

-- Auto-generate 10 mock customers using an automated loop
-- This loop safely skips inserting a user if that specific number-sequenced email is found
INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
SELECT 
    'user' || i || '@example.com',
    '$2b$10$K7Z2g1.SjIqM9sU9uI2vOeE9O9uE6u2e3e4e5e6e7e8e9e0e1e2e3',
    'Customer_First_' || i,
    'Customer_Last_' || i,
    FALSE
FROM generate_series(1, 10) AS i
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'user' || i || '@example.com'
);


-- =========================================================================
-- 2. SEED THE PRODUCT INVENTORY CATALOG (Production Safe)
-- =========================================================================
-- WHERE NOT EXISTS: Because the 'products' table doesn't have a UNIQUE index on the 
-- product title, we use a subquery check. It guarantees items only insert if their titles are brand new.

INSERT INTO products (title, description, price, inventory_quantity)
SELECT 'Quantum Mechanical Keyboard', 'Anodized aluminum frame with hot-swappable linear mechanical switches.', 149.99, 45
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Quantum Mechanical Keyboard');

INSERT INTO products (title, description, price, inventory_quantity)
SELECT 'UltraWide 34-inch Monitor', 'Curved IPS display panel running at 144Hz with HDR support.', 499.99, 15
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'UltraWide 34-inch Monitor');

INSERT INTO products (title, description, price, inventory_quantity)
SELECT 'Ergonomic Mesh Office Chair', 'High-back desk chair featuring adaptive lumbar support and 3D armrests.', 299.50, 20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Ergonomic Mesh Office Chair');

INSERT INTO products (title, description, price, inventory_quantity)
SELECT 'Wireless Studio Headphones', 'Active noise cancelling headphones featuring high-fidelity audio drivers.', 199.99, 60
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Wireless Studio Headphones');

INSERT INTO products (title, description, price, inventory_quantity)
SELECT 'Anker Power Bank 20K', 'High-capacity external battery pack with fast charging capabilities.', 45.00, 150
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Anker Power Bank 20K');

-- Auto-generate 15 more sequential developer accessories safely
INSERT INTO products (title, description, price, inventory_quantity)
SELECT 
    'Developer Access Accessory Pack Vol. ' || i,
    'A high-utility desktop workspace bundle designed for software engineering efficiency.',
    (25.00 + (i * 4.50))::NUMERIC(10,2),
    (i * 12)
FROM generate_series(1, 15) AS i
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE title = 'Developer Access Accessory Pack Vol. ' || i
);


-- =========================================================================
-- 3. SEED INITIAL SHOPPING CARTS (Production Safe)
-- =========================================================================
-- ON CONFLICT (user_id) DO NOTHING: Your schema enforces that a user can only have 
-- ONE shopping cart (UNIQUE constraint). This block safely creates a cart shell for new users.

INSERT INTO carts (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;


-- =========================================================================
-- 4. SEED INITIAL CART ITEMS (Production Safe)
-- =========================================================================
-- ON CONFLICT (cart_id, product_id) DO NOTHING: Targets your multi-column uniqueness 
-- constraint. If these exact products are already inside the developer's shopping cart, 
-- it skips them cleanly rather than duplicating the lines or crashing the data loop.

INSERT INTO cart_products (cart_id, product_id, quantity)
SELECT 
    c.id,
    p.id,
    2
FROM carts c
CROSS JOIN (SELECT id FROM products LIMIT 3) p
WHERE c.user_id = (SELECT id FROM users WHERE email = 'developer@test.com')
ON CONFLICT (cart_id, product_id) DO NOTHING;