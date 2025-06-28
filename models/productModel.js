import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Gambar produk wajib diisi'],
    },
    brand: {
      type: String,
      required: [true, 'Brand produk wajib diisi'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Harga wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Stok wajib diisi'],
      min: [0, 'Stok tidak boleh negatif'],
    },
    scentNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
