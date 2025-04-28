🛍️ Simple Order Processing System
A lightweight and scalable order management system using React, Node.js, PostgreSQL, Redis, and RabbitMQ. It handles placing orders, processing them in the background, and quick retrieval, designed for fast performance and easy scaling.

📖 Contents
Main Features
System Overview
Requirements
Setup Instructions
How to Use
API Routes
Design Choices

✨ Main Features
Place Orders: Users can easily place orders for different products.
Background Processing: Orders are handled in the background using RabbitMQ, so the app stays fast.
Faster Searches: Redis is used to speed up finding orders.
Data Storage: PostgreSQL keeps track of products and orders securely.
Interactive Frontend: A simple and responsive React UI for users.

🏗️ System Overview
The project is divided into parts for better management:
Frontend (React): Collects user inputs and sends them to the server.
Backend (Node.js + Express): Handles all the server-side work like saving orders and talking to the database.
Database (PostgreSQL): Saves product info and order details permanently.
Caching (Redis): Stores frequently used data temporarily for quick access.
Messaging (RabbitMQ): Handles processing of orders in the background to avoid delays.

⚙️ Requirements
Before starting, make sure you have:
Node.js 
PostgreSQL installed
Redis server running
RabbitMQ server
Docker & Docker Compose 


🚀 Setup Instructions
Set Up Environment Variables
   Create a `.env` file in the root directory and configure the following variables:
    POSTGRES_DB=bakery_db
    POSTGRES_USER=bakery_anushri
    POSTGRES_PASSWORD=bakery_anu

    ```
Run the Application
   Ensure Docker is running and execute the following:

    docker-compose down
    docker-compose up --build

🧪How to Use 
- **Accessing the Frontend**
    The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

- **Placing an Order**
    Use the frontend interface to select a product and place an order.

- **Retrieving Orders by Product ID**
    Enter a product ID in the search field to retrieve all associated orders.


📡API Routes
1. Get List of Products
2. Create a New Order
3. Get Orders by Product ID


🧠 Design Choices
React: For a fast and easy-to-use frontend.
Node.js + Express: Makes backend APIs lightweight and quick.
PostgreSQL: Best choice for reliable and organized storage.
Redis: Boosts search speed by caching important data.
RabbitMQ: Handles background jobs like order processing without slowing down the main server.



