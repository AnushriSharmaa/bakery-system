// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({ product_id: '' });
  const [status, setStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchProductId, setSearchProductId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const placeOrder = () => {
    if (!order.product_id) {
      alert('⚠️ Please enter a product ID.');
      return;
    }
    axios.post('http://localhost:5000/orders', order)
      .then(res => {
        setStatus(res.data);
        alert('✅ Order placed successfully!');
        setOrder({ product_id: '' });
      })
      .catch(err => {
        alert('❌ Failed to place order.');
        console.error(err);
      });
  };

  const fetchOrdersByProductId = () => {
    if (!searchProductId) {
      alert('⚠️ Please enter a product ID to search.');
      return;
    }
    axios.get(`http://localhost:5000/orders/${searchProductId}`)
      .then(res => {
        setOrders(res.data || []);
      })
      .catch(err => {
        alert('❌ Failed to fetch orders.');
        console.error(err);
        setOrders([]);
      });
  };

  return (
    <div className="container">
      <h1>🍞 Freshly Baked Delights</h1>

      <div className="products">
        {products.map(p => (
          <div key={p.id} className="product">
            <div className="product-name">{p.name}</div>
            <div className="product-price">₹{p.price}</div>
          </div>
        ))}
      </div>

      <h2>📦 Place Your Order</h2>
      <div className="form">
        <input
          type="number"
          placeholder="Enter Product ID"
          value={order.product_id}
          onChange={e => setOrder({ product_id: e.target.value })}
        />
        <button onClick={placeOrder}>Place Order</button>
      </div>
      {status && <p className="status">Order ID: {status.id} - Status: {status.status}</p>}

      <h2>🔍 Search Orders by Product ID</h2>
      <div className="form">
        <input
          type="number"
          placeholder="Enter Product ID"
          value={searchProductId}
          onChange={e => setSearchProductId(e.target.value)}
        />
        <button onClick={fetchOrdersByProductId}>Search Orders</button>
      </div>

      <div className="orders">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
