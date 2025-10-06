"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productcontroller_1 = require("../Controllers/productcontroller");
const Jwt_1 = require("../helpers/secure/Jwt");
const Muler_1 = __importDefault(require("../helpers/Muler/Muler"));
const router = express_1.default.Router();
router.post("/register", Jwt_1.decodeToken, Muler_1.default.single("file"), productcontroller_1.createProduct);
router.get("/all", Jwt_1.decodeToken, productcontroller_1.getAllProducts);
router.get("/one/:id", Jwt_1.decodeToken, productcontroller_1.getProductById);
router.put("/update/:id", Jwt_1.decodeToken, productcontroller_1.updateProduct);
router.delete("/delete/:id", Jwt_1.decodeToken, productcontroller_1.deleteProduct);
exports.default = router;
