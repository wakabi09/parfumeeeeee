import { BlobServiceClient } from '@azure/storage-blob';
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_CONTAINER_NAME,
  AZURE_STORAGE_SAS_TOKEN
} = process.env;

// Base URL untuk Azure Blob
const AZURE_BASE_URL = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

// === [POST] Upload Gambar ===
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `${AZURE_BASE_URL}?${AZURE_STORAGE_SAS_TOKEN}`
    );

    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

    const blobName = Date.now() + '-' + req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const imageUrl = `${AZURE_BASE_URL}/${AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error('Upload gagal:', err.message);
    res.status(500).json({ message: 'Upload gagal ke Azure Blob' });
  }
});

// === [GET] List Semua Gambar ===
router.get('/list', async (req, res) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `${AZURE_BASE_URL}?${AZURE_STORAGE_SAS_TOKEN}`
    );

    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

    const imageUrls = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      imageUrls.push(`${AZURE_BASE_URL}/${AZURE_STORAGE_CONTAINER_NAME}/${blob.name}`);
    }

    res.json(imageUrls);
  } catch (err) {
    console.error('Gagal mengambil daftar gambar:', err.message);
    res.status(500).json({ message: 'Gagal mengambil gambar dari Azure' });
  }
});

export default router;
