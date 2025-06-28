import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container className="py-5">
      <h1 className="text-center fw-bold">Our Collection</h1>
      <p className="text-center text-muted mb-5">Explore our curated selection of fine fragrances.</p>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading products...</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CollectionPage;
