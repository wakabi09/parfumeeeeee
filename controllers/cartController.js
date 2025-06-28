import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('userId', 'name email')
      .populate('productId', 'name brand price');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId', 'name brand price');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const newCart = new Cart({
      userId,
      productId,
      quantity: quantity || 1,
    });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.userId = userId;
    cart.productId = productId;
    cart.quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
