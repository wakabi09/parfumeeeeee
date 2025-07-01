// src/pages/TeamsPage.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './TeamsPage.css'; // Pastikan file CSS ini ada di lokasi yang sama

// Pastikan path gambar Anda benar relative terhadap file ini
import team1 from '../assets/aal.png';
import team2 from '../assets/HAQQI.jpg';
import team3 from '../assets/fanny.jpg';
import team4 from '../assets/maul.jpg';

const teamMembers = [
  {
    name: 'Muhammad Alfatch',
    role: '23.11.5460', // Ini terlihat seperti NIM, mungkin bisa dinamai 'nim' di objek data
    bio: 'Backend develop',
    image: team1,
  },
  {
    name: 'Hibatulhaqqi Q.R',
    role: '23.11.5479',
    bio: 'Design develop',
    image: team2,
  },
  {
    name: 'Agustina Septofanny',
    role: '23.11.4471',
    bio: 'Frontend develop',
    image: team3,
  },
  {
    name: 'Maulida Luthfi H',
    role: '23.11.5485',
    bio: 'Frontend develop',
    image: team4,
  },
];

const TeamsPage = () => (
  <Container className="py-5"> {/* py-5 memberikan padding atas/bawah */}
    <h2 className="text-center mb-5 fw-bold">Our Team</h2> {/* text-center, mb-5, fw-bold sudah bagus */}
    <Row className="g-4 justify-content-center"> {/* g-4 untuk gutter, justify-content-center untuk menengahkan jika ada sisa */}
      {teamMembers.map((member, index) => (
        <Col
          key={index}
          xs={12}    // 1 kolom di layar ekstra kecil (lebar penuh)
          sm={6}     // 2 kolom di layar kecil (setengah lebar)
          md={4}     // 3 kolom di layar menengah (sepertiga lebar)
          lg={3}     // 4 kolom di layar besar (seperempat lebar) - TAMBAHAN INI
          className="d-flex" // Penting untuk tinggi kartu yang sama
        >
          <Card className="text-center shadow flex-fill team-card"> {/* flex-fill penting dengan d-flex di Col */}
            <Card.Img variant="top" src={member.image} className="team-img" />
            <Card.Body className="d-flex flex-column"> {/* d-flex flex-column untuk mengatur konten dalam body */}
              <Card.Title>{member.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
              <Card.Text className="mt-auto">{member.bio}</Card.Text> {/* mt-auto untuk mendorong ke bawah */}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default TeamsPage;