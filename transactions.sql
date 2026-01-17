-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS pizza_app;
USE pizza_app;

-- 2. Create the Pizza Places table first (because Users reference it)
CREATE TABLE IF NOT EXISTS pizza_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- 3. Create the Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('manager', 'cook', 'customer') NOT NULL,
    assigned_place_id INT,
    -- This links the cook to a specific pizza place
    FOREIGN KEY (assigned_place_id) REFERENCES pizza_places(id) ON DELETE SET NULL
);

-- 4. Create the Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 5. Create the Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    pizza_place_id INT NOT NULL,
    -- Your code expects 'status' to allow 'pending' and 'delivered'
    status VARCHAR(50) DEFAULT 'pending', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (pizza_place_id) REFERENCES pizza_places(id)
);

-- Optional: Order Items table
-- (Your code mentioned this in comments but didn't implement the query yet)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

START TRANSACTION;

-- -----------------------
-- Clean existing data (FK-safe order)
-- -----------------------
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM users;
DELETE FROM menu_items;
DELETE FROM pizza_places;

-- Reset AUTO_INCREMENT (optional, but nice for predictable IDs)
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE menu_items AUTO_INCREMENT = 1;
ALTER TABLE pizza_places AUTO_INCREMENT = 1;

-- -----------------------
-- Pizza places (includes your easter egg: Vesuvio)
-- -----------------------
INSERT INTO pizza_places (name, location) VALUES
('Vesuvio', 'Newark, NJ'),
('Slice of Byte', 'Silicon Valley, CA'),
('La Rioja Pie Co.', 'Logroño, La Rioja'),
('Cloud Crust Kitchen', 'AWS eu-west-1 (Dublin)'),
('Distributed Dough', 'Kubernetes Cluster 7'),
('Hyrule Pizzeria', 'Kakariko Village'),
('The Krusty Slice', 'Springfield');

-- -----------------------
-- Shared menu (menu_items)
-- -----------------------
INSERT INTO menu_items (name, price) VALUES
('Margherita', 8.50),
('Pepperoni', 9.50),
('Four Cheese', 10.50),
('Hawaiian (Controversial)', 10.00),
('Truffle Mushroom', 12.75),
('Spicy Diavola', 11.25),
('Veggie Garden', 10.25),
('BBQ Chicken', 11.75),
('Garlic Knots', 4.00),
('Tiramisu', 5.50),

-- Extra easter eggs
('404 Not Found (Calzone)', 11.04),
('The Stack Overflow Special', 13.37),
('Pineapple Permission Denied', 10.01);

-- -----------------------
-- Users
-- users.role ENUM('manager','customer','cook')
-- users.assigned_place_id -> pizza_places(id) ON DELETE SET NULL
-- -----------------------

-- Your provided bcrypt hashes (cost 10) are safe to store as VARCHAR; MariaDB is just storage here. [web:45]
INSERT INTO users (username, password, role, assigned_place_id) VALUES
-- Manager (provided)
('manager_maria', '$2b$10$w8HD4UPpxzyDljygAPLxdOpE6Gn63mraph1VYMps9ZKfpuw17ZVBS', 'manager', NULL),

-- Customer (provided)
('customer_alex', '$2b$10$fFA8PINbDYE3EtyEeLtY8OB6NEkSC7GDqIDJg7JU7Mroe8GHHNbvC', 'customer', NULL),

-- Cook (provided) - your easter egg: Artie Bucco assigned to Vesuvio
('artie_bucco', '$2b$10$wV9Q1sckthnXgpz44pg6H.8kT2Q2sOMEFFEgNd4YGEqwHE2eQsgJy', 'cook',
  (SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1)
),

-- Additional users (placeholders: replace PASSWORD_HASH_* with real bcrypt hashes if you want them to be able to log in)
('manager_luigi', 'PASSWORD_HASH_MANAGER_LUIGI', 'manager', NULL),

('customer_jamie', 'PASSWORD_HASH_CUSTOMER_JAMIE', 'customer', NULL),
('customer_taylor', 'PASSWORD_HASH_CUSTOMER_TAYLOR', 'customer', NULL),
('customer_trinity', 'PASSWORD_HASH_CUSTOMER_TRINITY', 'customer', NULL),
('customer_gandalf', 'PASSWORD_HASH_CUSTOMER_GANDALF', 'customer', NULL),

('cook_ada', 'PASSWORD_HASH_COOK_ADA', 'cook',
  (SELECT id FROM pizza_places WHERE name='Slice of Byte' LIMIT 1)
),
('cook_turing', 'PASSWORD_HASH_COOK_TURING', 'cook',
  (SELECT id FROM pizza_places WHERE name='Slice of Byte' LIMIT 1)
),
('cook_carmen', 'PASSWORD_HASH_COOK_CARMEN', 'cook',
  (SELECT id FROM pizza_places WHERE name='La Rioja Pie Co.' LIMIT 1)
),
('cook_fernando', 'PASSWORD_HASH_COOK_FERNANDO', 'cook',
  (SELECT id FROM pizza_places WHERE name='Cloud Crust Kitchen' LIMIT 1)
),
('cook_riley', 'PASSWORD_HASH_COOK_RILEY', 'cook',
  (SELECT id FROM pizza_places WHERE name='Distributed Dough' LIMIT 1)
);

-- -----------------------
-- Orders
-- orders.status ENUM('pending','delivered') DEFAULT 'pending'
-- -----------------------
INSERT INTO orders (customer_id, pizza_place_id, status) VALUES
-- Alex @ Vesuvio (pending)
((SELECT id FROM users WHERE username='customer_alex' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1),
 'pending'),

-- Alex @ Vesuvio (delivered)
((SELECT id FROM users WHERE username='customer_alex' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1),
 'delivered'),

-- Jamie @ Slice of Byte
((SELECT id FROM users WHERE username='customer_jamie' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='Slice of Byte' LIMIT 1),
 'delivered'),

-- Taylor @ La Rioja Pie Co.
((SELECT id FROM users WHERE username='customer_taylor' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='La Rioja Pie Co.' LIMIT 1),
 'pending'),

-- Trinity @ Distributed Dough
((SELECT id FROM users WHERE username='customer_trinity' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='Distributed Dough' LIMIT 1),
 'pending'),

-- Gandalf @ The Krusty Slice
((SELECT id FROM users WHERE username='customer_gandalf' LIMIT 1),
 (SELECT id FROM pizza_places WHERE name='The Krusty Slice' LIMIT 1),
 'delivered');

-- -----------------------
-- Order items
-- order_items references orders(id) and menu_items(id)
-- -----------------------

-- Helper note: each block grabs "the latest order" per (customer, place) pair.
-- Alex @ Vesuvio (latest = delivered): Pepperoni + Tiramisu
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_alex' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Pepperoni' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_alex' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Tiramisu' LIMIT 1));

-- Alex @ Vesuvio (oldest = pending): Margherita + Garlic Knots
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_alex' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1)
  ORDER BY id ASC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Margherita' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_alex' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Vesuvio' LIMIT 1)
  ORDER BY id ASC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Garlic Knots' LIMIT 1));

-- Jamie @ Slice of Byte: Stack Overflow Special + 404 Calzone
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_jamie' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Slice of Byte' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='The Stack Overflow Special' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_jamie' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Slice of Byte' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='404 Not Found (Calzone)' LIMIT 1));

-- Taylor @ La Rioja Pie Co.: Four Cheese + Veggie Garden
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_taylor' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='La Rioja Pie Co.' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Four Cheese' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_taylor' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='La Rioja Pie Co.' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Veggie Garden' LIMIT 1));

-- Trinity @ Distributed Dough: Truffle Mushroom + Pineapple Permission Denied
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_trinity' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Distributed Dough' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Truffle Mushroom' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_trinity' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='Distributed Dough' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Pineapple Permission Denied' LIMIT 1));

-- Gandalf @ The Krusty Slice: Spicy Diavola + Tiramisu
INSERT INTO order_items (order_id, menu_item_id) VALUES
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_gandalf' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='The Krusty Slice' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Spicy Diavola' LIMIT 1)),
((SELECT id FROM orders
  WHERE customer_id=(SELECT id FROM users WHERE username='customer_gandalf' LIMIT 1)
    AND pizza_place_id=(SELECT id FROM pizza_places WHERE name='The Krusty Slice' LIMIT 1)
  ORDER BY id DESC LIMIT 1),
 (SELECT id FROM menu_items WHERE name='Tiramisu' LIMIT 1));

COMMIT;
