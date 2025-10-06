import express from "express"
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../Controllers/CategoryControllers"
import { decodeToken } from "../helpers/secure/Jwt"

const router = express.Router()

router.post("/register", decodeToken, createCategory)
router.get("/all", decodeToken, getAllCategories)
router.get("/one/:id", decodeToken, getCategoryById)
router.put("/update/:id", decodeToken, updateCategory)
router.delete("/delete/:id", decodeToken, deleteCategory)

export default router
