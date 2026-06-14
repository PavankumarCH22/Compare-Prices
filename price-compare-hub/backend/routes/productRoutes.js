import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getDashboardStats,
  addProductDeal
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.post('/bulk-upload', protect, admin, upload.single('file'), bulkUploadProducts);
router.get('/stats/dashboard', protect, admin, getDashboardStats);

router.route('/:id/deals')
  .post(protect, addProductDeal);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;

