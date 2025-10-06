"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoryControllers_1 = require("../Controllers/CategoryControllers");
const Jwt_1 = require("../helpers/secure/Jwt");
const router = express_1.default.Router();
router.post("/register", Jwt_1.decodeToken, CategoryControllers_1.createCategory);
router.get("/all", Jwt_1.decodeToken, CategoryControllers_1.getAllCategories);
router.get("/one/:id", Jwt_1.decodeToken, CategoryControllers_1.getCategoryById);
router.put("/update/:id", Jwt_1.decodeToken, CategoryControllers_1.updateCategory);
router.delete("/delete/:id", Jwt_1.decodeToken, CategoryControllers_1.deleteCategory);
exports.default = router;
