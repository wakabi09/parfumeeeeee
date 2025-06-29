import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminDashboard.css';


// ===== Sidebar =====
const Sidebar = ({ onSelect, collapsed, toggle }) => (
  <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Tombol toggle selalu tampil */}
      <button className="toggle-btn" onClick={toggle}>
        {collapsed ? '☰' : '✖'}
      </button>

      {/* Konten hanya muncul jika sidebar tidak collapsed */}
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
  </div>
);




const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [imageList, setImageList] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/upload/list');
      setImageList(res.data);
    } catch (err) {
      console.error('Gagal ambil gambar:', err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.post('/api/upload', formData);
      setFile(null);
      fetchImages();
      Swal.fire('Berhasil', 'Gambar berhasil diupload', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal mengupload gambar', 'error');
    }
  };

  return (
    <div className="content">
      <h3>Upload Gambar</h3>
      <form onSubmit={handleUpload} className="mb-3">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-primary ms-2" type="submit">Upload</button>
      </form>
      <div className="row">
        {imageList.map((url, i) => (
          <div className="col-3 mb-3" key={i}>
            <img src={url} alt="uploaded" className="img-thumbnail" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [imageOptions, setImageOptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', scentNotes: '', description: '',
    image: '', countInStock: '', brand: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Gagal fetch produk:', err);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/upload/list');
      setImageOptions(res.data);
    } catch (err) {
      console.error('Gagal fetch image:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', price: '', scentNotes: '', description: '', image: '', countInStock: '', brand: '' });
    setEditMode(false);
    setEditingId(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', form);
      fetchProducts();
      resetForm();
      Swal.fire('Berhasil', 'Produk ditambahkan', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal tambah produk', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${editingId}`, form);
      fetchProducts();
      resetForm();
      Swal.fire('Berhasil', 'Produk diperbarui', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal update produk', 'error');
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = await Swal.fire({
      title: 'Yakin hapus produk ini?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    });

    if (konfirmasi.isConfirmed) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        Swal.fire('Berhasil!', 'Produk telah dihapus.', 'success');
      } catch (error) {
        console.error('Gagal menghapus produk:', error);
        Swal.fire('Gagal', 'Tidak dapat menghapus produk.', 'error');
      }
    }
  };

  const handleEdit = (prod) => {
    setForm(prod);
    setEditMode(true);
    setEditingId(prod._id);
  };

  return (
    <div className="content">
      <h3>Produk</h3>
      <form onSubmit={editMode ? handleUpdate : handleAdd} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" name="name" className="form-control" placeholder="Nama" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="text" name="brand" className="form-control" placeholder="Brand" value={form.brand} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="number" name="price" className="form-control" placeholder="Harga" value={form.price} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <input type="number" name="countInStock" className="form-control" placeholder="Stok" value={form.countInStock} onChange={handleChange} required />
          </div>
          <div className="col-md-12">
            <textarea name="description" className="form-control" placeholder="Deskripsi" value={form.description} onChange={handleChange} required></textarea>
          </div>
          <div className="col-md-12">
            <input type="text" name="scentNotes" className="form-control" placeholder="Scent Notes" value={form.scentNotes} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <select name="image" className="form-select" value={form.image} onChange={handleChange} required>
              <option value="">Pilih Gambar</option>
              {imageOptions.map((img, idx) => (
                <option key={idx} value={img}>{img}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-success mt-3" type="submit">
          {editMode ? 'Update Produk' : 'Tambah Produk'}
        </button>
        {editMode && (
          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={resetForm}>
            Batal Edit
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Gambar</th><th>Nama</th><th>Harga</th><th>Stok</th><th>Notes</th><th>Deskripsi</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id}>
              <td><img src={prod.image} alt={prod.name} width="60" /></td>
              <td>{prod.name}</td>
              <td>Rp {prod.price}</td>
              <td>{prod.countInStock}</td>
              <td>{prod.scentNotes}</td>
              <td>{prod.description}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(prod)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod._id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
    axios.get('/api/products')
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
