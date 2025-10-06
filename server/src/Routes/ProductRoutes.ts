import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
} from "../Controllers/productcontroller";
import { decodeToken } from "../helpers/secure/Jwt";
import upload from "../helpers/Muler/Muler";

const router = express.Router();

router.post("/register", decodeToken, upload.single("imageUrl"), createProduct);
router.get("/all", getAllProducts);
router.get("/one/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
router.put("/update/:id", decodeToken, updateProduct);
router.delete("/delete/:id", decodeToken, deleteProduct);

export default router;