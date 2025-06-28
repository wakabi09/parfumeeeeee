import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/products');
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul className="list-group">
        {products.map(p => (
          <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            {p.name}
            <button onClick={() => deleteProduct(p._id)} className="btn btn-danger btn-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
