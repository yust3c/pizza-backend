DROP DATABASE IF EXISTS pizza_app;
CREATE DATABASE pizza_app;
USE pizza_app;

-- 1. Matches people.repository.js
CREATE TABLE people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    lastname VARCHAR(255),
    role VARCHAR(50) -- 'manager', 'cook', 'customer'
);

-- 2. Matches pizzasPlaces.repository.js
CREATE TABLE pizzaPlaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    phone VARCHAR(50),
    manager_email VARCHAR(255) -- Links to people.email conceptually
);

-- 3. Matches cooks.repository.js
CREATE TABLE cooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cook_email VARCHAR(255),
    pizzaplace_id INT,
    FOREIGN KEY (pizzaplace_id) REFERENCES pizzaPlaces(id) ON DELETE CASCADE
);

-- 4. Matches pizzas.repository.js
CREATE TABLE pizzas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    category VARCHAR(100)
);

-- 5. Matches orders.repository.js
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(255) UNIQUE,
    customer_email VARCHAR(255),
    pizzaplace_id INT,
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'delivered'
    cook_email VARCHAR(255),
    delivery_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Matches orders.repository.js (items loop)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    pizza_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. Matches orders.repository.js (transaction log)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_type VARCHAR(50),
    related_order_id INT,
    related_pizzaplace_id INT,
    user_email VARCHAR(255),
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
