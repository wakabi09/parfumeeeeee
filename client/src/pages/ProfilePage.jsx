import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import './ProfilePage.css'; // Import CSS kustom

// Asumsi Anda punya hook useAuth atau context untuk user
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  // State untuk data profil yang bisa diedit
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // State untuk notifikasi (misal: sukses, error)
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' atau 'danger'

  // State untuk menu aktif di sidebar
  const [activeMenu, setActiveMenu] = useState('profile'); // Default 'profile'

  // Perbarui profileData jika user dari context berubah (misal setelah login)
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // ✅ LOGIKA UNTUK UPDATE PROFIL KE BACKEND
      // Simulasi sukses
      setTimeout(() => {
        setMessageType('success');
        setMessage('Profil berhasil diperbarui!');
        console.log('Data profil yang disubmit:', profileData);
      }, 1000);

    } catch (error) {
      setMessageType('danger');
      setMessage(error.message || 'Terjadi kesalahan saat memperbarui profil.');
      console.error('Error updating profile:', error);
    }
  };

  // Komponen Dummy untuk konten menu lain
  const MyOrdersContent = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Pesanan Saya</Card.Title>
        <Card.Text>Daftar pesanan Anda akan ditampilkan di sini.</Card.Text>
        {/* Tambahkan tabel atau daftar pesanan */}
      </Card.Body>
    </Card>
  );

  const AddressesContent = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Alamat Pengiriman</Card.Title>
        <Card.Text>Kelola alamat pengiriman Anda di sini.</Card.Text>
        {/* Tambahkan daftar alamat */}
      </Card.Body>
    </Card>
  );

  const ChangePasswordContent = () => (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Ubah Kata Sandi</Card.Title>
        <Form>
          <Form.Group className="mb-3" controlId="formOldPassword">
            <Form.Label>Kata Sandi Lama</Form.Label>
            <Form.Control type="password" placeholder="Masukkan kata sandi lama" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewPassword">
            <Form.Label>Kata Sandi Baru</Form.Label>
            <Form.Control type="password" placeholder="Masukkan kata sandi baru" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Konfirmasi Kata Sandi Baru</Form.Label>
            <Form.Control type="password" placeholder="Konfirmasi kata sandi baru" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Ubah Kata Sandi
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );


  return (
    <Container className="my-5">
      <Row>
        {/* Sidebar Navigasi */}
        <Col lg={3} md={4} className="profile-sidebar mb-4 mb-md-0">
          <h5 className="mb-4">Halo, {user?.name || user?.email || 'Pengguna'}!</h5>
          <Nav className="flex-column">
            <Nav.Link
              className={activeMenu === 'profile' ? 'active' : ''}
              onClick={() => setActiveMenu('profile')}
            >
              <FaUser className="me-2" /> Profil Saya
            </Nav.Link>
            <Nav.Link
              className={activeMenu === 'orders' ? 'active' : ''}
              onClick={() => setActiveMenu('orders')}
            >
              <FaClipboardList className="me-2" /> Pesanan Saya
            </Nav.Link>
            <Nav.Link
              className={activeMenu === 'addresses' ? 'active' : ''}
              onClick={() => setActiveMenu('addresses')}
            >
              <FaMapMarkerAlt className="me-2" /> Alamat
            </Nav.Link>
            <Nav.Link
              className={activeMenu === 'change-password' ? 'active' : ''}
              onClick={() => setActiveMenu('change-password')}
            >
              <FaLock className="me-2" /> Ubah Kata Sandi
            </Nav.Link>
          </Nav>
        </Col>

        {/* Konten Utama */}
        <Col lg={9} md={8} className="profile-content">
          {activeMenu === 'profile' && (
            <Card className="shadow-sm">
              <Card.Body>
                {/* Hapus semua kelas mb- dari sini, CSS kustom akan mengaturnya */}
                <Card.Title>Profil Saya</Card.Title>
                {message && <Alert variant={messageType}>{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  {/* Hapus semua kelas mt- dari sini. Form.Group mb-3 sudah cukup. */}
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Nama Lengkap</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly
                      disabled
                      placeholder="Email Anda"
                    />
                    <Form.Text className="text-muted">
                      Email tidak dapat diubah.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Nomor Telepon</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="Masukkan nomor telepon"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Simpan Perubahan
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeMenu === 'orders' && <MyOrdersContent />}
          {activeMenu === 'addresses' && <AddressesContent />}
          {activeMenu === 'change-password' && <ChangePasswordContent />}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;