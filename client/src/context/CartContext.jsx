import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.js';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  
  const prevUserRef = useRef();

  useEffect(() => {
    const fetchUserCart = async (authToken) => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        const { data } = await axios.get('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart', config);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Failed to fetch user cart:', error);
      } finally {
        setLoading(false);
      }
    };

    const mergeAndFetchCart = async (authToken) => {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (guestCart.length > 0) {
        try {
          const config = { headers: { Authorization: `Bearer ${authToken}` } };
          await axios.post('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart/merge', { items: guestCart }, config);
          localStorage.removeItem('guestCart');
        } catch (error) {
          console.error('Failed to merge cart:', error);
        }
      }
      await fetchUserCart(authToken);
    };

    const hasLoggedIn = !prevUserRef.current && user;
    const hasLoggedOut = prevUserRef.current && !user;

    if (hasLoggedIn) {
      mergeAndFetchCart(token);
    } else if (hasLoggedOut) {
      setCartItems([]);
    } else if (!user) {
      const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(localCart);
    }
    
    prevUserRef.current = user;
  }, [user, token]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product) => {
    if (user && token) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart/item', { productId: product._id, quantity: 1 }, config);
        setCartItems(data.items);
      } catch (error) {
        console.error('Failed to add item:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems((prev) => {
        const exists = prev.find((item) => item._id === product._id);
        if (exists) {
          return prev.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user && token) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.delete(`https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart/item/${productId}`, config);
        setCartItems(data.items);
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== productId));
    }
  };

  const updateQty = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    if (user && token) {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.put(`https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart/item/${productId}`, { quantity }, config);
        setCartItems(data.items);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item._id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = async () => {
    if (user && token) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete('https://mahaparfum-dhbdeyasgzhbg9ct.southeastasia-01.azurewebsites.net/api/cart/clear', config);
      } catch (error) {
        console.error('Failed to clear server cart:', error);
      }
    }
    setCartItems([]);
    localStorage.removeItem('guestCart');
  };

  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}