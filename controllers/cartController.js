import Cart from '../models/cartModel.js';

// GET /api/cart/ -> Mendapatkan keranjang milik pengguna
export const getUserCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price image');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/cart/item -> Menambah item ke keranjang
export const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image');
    res.status(201).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/cart/item/:productId -> Menghapus item dari keranjang
export const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image');
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/cart/item/:productId -> Mengubah kuantitas item
export const updateItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ user: userId });
        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image');
            return res.json(updatedCart);
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /api/cart/clear -> Mengosongkan keranjang
export const clearUserCart = async (req, res) => {
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json(cart || { user: userId, items: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /api/cart/merge -> Menggabungkan keranjang tamu
export const mergeGuestCart = async (req, res) => {
    const { items: guestItems } = req.body;
    const userId = req.user.id;
    try {
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            userCart = await Cart.create({ user: userId, items: [] });
        }

        guestItems.forEach(guestItem => {
            // Perbaikan di sini: Menggunakan guestItem._id
            const itemIndex = userCart.items.findIndex(p => p.product.toString() === guestItem._id);
            if (itemIndex > -1) {
                userCart.items[itemIndex].quantity += guestItem.quantity;
            } else {
                // Perbaikan di sini: Menggunakan guestItem._id
                userCart.items.push({ product: guestItem._id, quantity: guestItem.quantity });
            }
        });

        await userCart.save();
        const updatedCart = await Cart.findById(userCart._id).populate('items.product', 'name price image');
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};