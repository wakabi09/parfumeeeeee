import Product from '../models/productModel.js';

// [GET] Ambil semua produk
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk', error: error.message });
  }
};

// [GET] Ambil produk berdasarkan ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail produk', error: error.message });
  }
};

// [POST] Tambah produk baru
export const createProduct = async (req, res) => {
  const { name, image, brand, description, price, countInStock, scentNotes } = req.body;

  if (!name || !image || !brand || price == null || countInStock == null) {
    return res.status(400).json({ message: 'Nama, gambar, brand, harga, dan stok wajib diisi' });
  }

  const parsedPrice = Number(price);
  const parsedStock = Number(countInStock);

  if (isNaN(parsedPrice) || parsedPrice < 0 || isNaN(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ message: 'Harga dan stok harus berupa angka positif' });
  }

  try {
    const newProduct = new Product({
      name,
      image,
      brand,
      description: description || '',
      price: parsedPrice,
      countInStock: parsedStock,
      scentNotes: scentNotes || '',
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambahkan produk', error: error.message });
  }
};

// [PUT] Update produk
export const updateProduct = async (req, res) => {
  const { name, image, brand, description, price, countInStock, scentNotes } = req.body;

  if (
    (price != null && (isNaN(Number(price)) || Number(price) < 0)) ||
    (countInStock != null && (isNaN(Number(countInStock)) || Number(countInStock) < 0))
  ) {
    return res.status(400).json({ message: 'Harga dan stok tidak boleh negatif atau bukan angka' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    product.name = name ?? product.name;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.description = description ?? product.description;
    product.price = price != null ? Number(price) : product.price;
    product.countInStock = countInStock != null ? Number(countInStock) : product.countInStock;
    product.scentNotes = scentNotes ?? product.scentNotes;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Gagal mengupdate produk', error: error.message });
  }
};

// [DELETE] Hapus produk berdasarkan ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
  }
};
