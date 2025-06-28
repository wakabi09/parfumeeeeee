import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const Sidebar = ({ onSelect, collapsed, toggle }) => (
  <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <button className="toggle-btn" onClick={toggle}>{collapsed ? '▶' : '◀'}</button>
    {!collapsed && (
      <>
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => onSelect('dashboard')}>Dashboard</li>
          <li onClick={() => onSelect('upload')}>Upload Gambar</li>
          <li onClick={() => onSelect('products')}>Products</li>
          <li onClick={() => onSelect('users')}>User Management</li>
          <li onClick={() => onSelect('cart')}>Cart</li>
        </ul>
      </>
    )}
  </div>
);

// ... UploadImage & ProductManagement tetap sama

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Gagal mengambil user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      Swal.fire('Berhasil', 'Role berhasil diubah', 'success');
    } catch (error) {
      console.error('Gagal ubah role:', error);
      Swal.fire('Gagal', 'Tidak dapat mengubah role.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: 'Yakin hapus user ini?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    });

    if (konfirmasi.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== id));
        Swal.fire('Berhasil!', 'User telah dihapus.', 'success');
      } catch (error) {
        console.error('Gagal menghapus user:', error);
        Swal.fire('Gagal', 'Tidak dapat menghapus user.', 'error');
      }
    }
  };

  return (
    <div className="content">
      <h3>Manajemen Pengguna</h3>
      {loading ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === 'owner' ? (
                    'owner'
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="form-select"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td>
                  {user.role !== 'owner' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const CartPage = () => (
  <div className="content">
    <h3>Cart</h3>
    <p>Data keranjang akan ditampilkan di sini...</p>
  </div>
);

const DashboardContent = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Gagal fetch produk:', err));
  }, []);

  return (
    <div className="content">
      <h3>Dashboard Produk</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod._id}>
              <td><img src={prod.image} alt={prod.name} width="60" /></td>
              <td>{prod.name}</td>
              <td>Rp {prod.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container d-flex">
      <Sidebar onSelect={setActiveTab} collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} />
      <div className="main p-3 w-100">
        {activeTab === 'dashboard' && <DashboardContent />}
        {activeTab === 'upload' && <UploadImage />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'cart' && <CartPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
