'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type Order = {
  id: number;
  product: Product;
  productId: number;
  quantity: number;
  total: number;
};

export default function UserPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user-token');
    if (saved) validateToken(saved);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const validateToken = async (jwt: string) => {
    const res = await fetch('http://localhost:3000/products', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (res.ok) {
      setToken(jwt);
      fetchProducts(jwt);
      fetchOrders(jwt);
    } else {
      localStorage.removeItem('user-token');
    }
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      localStorage.setItem('user-token', data.access_token);
      setToken(data.access_token);
      fetchProducts(data.access_token);
      fetchOrders(data.access_token);
    } else {
      showToast('error', 'Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('user-token');
    setToken(null);
    setEmail('');
    setPassword('');
    setProducts([]);
    setOrders([]);
  };

  const fetchProducts = async (jwt: string) => {
    const res = await fetch('http://localhost:3000/products', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setProducts(data);
    if (data.length > 0) setSelectedProduct(data[0].id);
  };

  const fetchOrders = async (jwt: string) => {
    const res = await fetch('http://localhost:3000/orders/my', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  const placeOrder = async () => {
    if (!selectedProduct || quantity < 1) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const res = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: selectedProduct,
        quantity,
        total: product.price * quantity,
      }),
    });

    if (res.ok) {
      showToast('success', 'Order placed');
      fetchOrders(token!);
    } else {
      showToast('error', 'Order failed');
    }
  };

  const deleteOrder = async (id: number) => {
    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast('success', 'Order deleted');
      fetchOrders(token!);
    }
  };

  const updateOrder = async (order: Order) => {
    const res = await fetch(`http://localhost:3000/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: order.quantity,
        total: order.quantity * order.product.price,
      }),
    });

    if (res.ok) {
      showToast('success', 'Order updated');
      fetchOrders(token!);
    }
  };

  // ---------- LOGIN UI ----------
  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">User Login</h2>

          {toast && (
            <div className={`mb-4 text-white p-2 rounded text-center ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {toast.message}
            </div>
          )}

          <input
            type="email"
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Welcome to Your Dashboard</h1>
        <button onClick={logout} className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
          Logout
        </button>
      </div>

      {/* Products */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border rounded-lg p-5 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700">{p.name}</h3>
              <p className="text-gray-600">{p.description}</p>
              <p className="text-green-600 font-bold mt-2">${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Place Order */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Place New Order</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(parseInt(e.target.value))}
            className="border p-2 rounded w-full md:w-1/3"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border p-2 rounded w-full md:w-1/4"
          />
          <button
            onClick={placeOrder}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </section>

      {/* Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-2">{o.id}</td>
                  <td>{o.product?.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={o.quantity}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((ord) => (ord.id === o.id ? { ...ord, quantity: parseInt(e.target.value) } : ord))
                        )
                      }
                      className="border rounded w-16 p-1 text-center"
                    />
                  </td>
                  <td>${o.total.toFixed(2)}</td>
                  <td className="flex justify-center gap-2 py-2">
                    <button
                      onClick={() => updateOrder(o)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteOrder(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-5 py-3 text-white rounded shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
