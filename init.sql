CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    status VARCHAR(50)
);

INSERT INTO products (name, price) VALUES
('Chocolate Pastry', 2.99),
('Red Velvet Cake', 15.49),
('Glazed Donut', 1.99),
('Cheesecake', 3.49),
('Blueberry Muffin', 2.99);

