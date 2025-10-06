import express from "express"
import {
  createProductSection,
  getAllProductSections,
  getProductSectionById,
  updateProductSection,
  deleteProductSection,
} from "../Controllers/productSectioncontroller"
import { decodeToken } from "../helpers/secure/Jwt"

const router = express.Router()

router.post("/register", decodeToken, createProductSection)
router.get("/all", decodeToken, getAllProductSections)
router.get("/one/:id", decodeToken, getProductSectionById)
router.put("/update/:id", decodeToken, updateProductSection)
router.delete("/delete/:id", decodeToken, deleteProductSection)

export default router
