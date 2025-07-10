'use client';

import { useEffect, useState } from 'react';

type Tab = 'users' | 'products' | 'orders';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Order {
  id: number;
  quantity: number;
  total: number;
  user: User;
  product: Product;
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [login, setLogin] = useState({ email: '', password: '' });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) validateToken(saved);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const validateToken = async (jwt: string) => {
    const res = await fetch('http://localhost:3000/users/all', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (res.ok) {
      setToken(jwt);
      fetchAll(jwt);
    }
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      fetchAll(data.access_token);
    } else {
      showToast('error', 'Login failed');
    }
  };

  const fetchAll = async (jwt?: string) => {
    const tokenVal = jwt || token;
    const [userRes, productRes, orderRes] = await Promise.all([
      fetch('http://localhost:3000/users/all', { headers: { Authorization: `Bearer ${tokenVal}` } }),
      fetch('http://localhost:3000/products', { headers: { Authorization: `Bearer ${tokenVal}` } }),
      fetch('http://localhost:3000/orders', { headers: { Authorization: `Bearer ${tokenVal}` } }),
    ]);
    setUsers(await userRes.json());
    setProducts(await productRes.json());
    setOrders(await orderRes.json());
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsers([]);
    setProducts([]);
    setOrders([]);
    setLogin({ email: '', password: '' });
  };

  const createProduct = async () => {
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) }),
    });
    if (res.ok) {
      showToast('success', 'Product created');
      setNewProduct({ name: '', description: '', price: '' });
      fetchAll();
    } else {
      showToast('error', 'Failed to create product');
    }
  };

  const updateProduct = async () => {
    if (!editProduct) return;
    const res = await fetch(`http://localhost:3000/products/${editProduct.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editProduct.name,
        description: editProduct.description,
        price: parseFloat(String(editProduct.price)),
      }),
    });
    if (res.ok) {
      showToast('success', 'Product updated');
      setEditProduct(null);
      fetchAll();
    } else {
      showToast('error', 'Update failed');
    }
  };

  const deleteProduct = async (id: number) => {
    const res = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast('success', 'Product deleted');
      fetchAll();
    }
  };

  const updateUser = async () => {
    if (!editUser) return;
    const res = await fetch(`http://localhost:3000/users/${editUser.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editUser.name, email: editUser.email }),
    });
    if (res.ok) {
      showToast('success', 'User updated');
      setEditUser(null);
      fetchAll();
    }
  };

  const deleteUser = async (id: number) => {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast('success', 'User deleted');
      fetchAll();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {!token ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
            {toast && (
              <div className={`text-white text-center py-2 mb-4 rounded ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {toast.message}
              </div>
            )}
            <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded"
              value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded"
              value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700" onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button onClick={logout} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Logout</button>
          </header>

          <div className="flex space-x-4 mb-6">
            {(['users', 'products', 'orders'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded font-semibold ${tab === t ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {toast && (
            <div className={`mb-4 text-white px-4 py-2 rounded shadow ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {toast.message}
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Users</h2>
              <table className="w-full border mb-4 text-center">
                <thead className="bg-gray-100">
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border">
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <button onClick={() => setEditUser(u)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => deleteUser(u.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {editUser && (
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-bold mb-2">Edit User</h3>
                  <input className="w-full mb-2 p-2 border rounded" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                  <input className="w-full mb-2 p-2 border rounded" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                  <div className="flex gap-2">
                    <button onClick={updateUser} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                    <button onClick={() => setEditUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {tab === 'products' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Products</h2>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-4 mb-4">
                <input className="border p-2 rounded" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                <input className="border p-2 rounded" type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <button onClick={createProduct} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add</button>
              </div>

              <table className="w-full border text-center">
                <thead className="bg-gray-100"><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border">
                      <td>{p.name}</td>
                      <td>${p.price}</td>
                      <td>
                        <button onClick={() => setEditProduct(p)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {editProduct && (
                <div className="p-4 mt-4 bg-white rounded shadow">
                  <h3 className="text-lg font-bold mb-2">Edit Product</h3>
                  <input className="w-full mb-2 p-2 border rounded" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                  <input className="w-full mb-2 p-2 border rounded" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                  <input className="w-full mb-2 p-2 border rounded" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })} />
                  <div className="flex gap-2">
                    <button onClick={updateProduct} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
                    <button onClick={() => setEditProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Orders</h2>
              <table className="w-full border text-center">
                <thead className="bg-gray-100"><tr><th>ID</th><th>User</th><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border">
                      <td>{o.id}</td>
                      <td>{o.user.name} ({o.user.email})</td>
                      <td>{o.product.name}</td>
                      <td>{o.quantity}</td>
                      <td>${o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
