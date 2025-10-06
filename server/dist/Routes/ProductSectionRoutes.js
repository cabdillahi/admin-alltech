"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productSectioncontroller_1 = require("../Controllers/productSectioncontroller");
const Jwt_1 = require("../helpers/secure/Jwt");
const router = express_1.default.Router();
router.post("/register", Jwt_1.decodeToken, productSectioncontroller_1.createProductSection);
router.get("/all", Jwt_1.decodeToken, productSectioncontroller_1.getAllProductSections);
router.get("/one/:id", Jwt_1.decodeToken, productSectioncontroller_1.getProductSectionById);
router.put("/update/:id", Jwt_1.decodeToken, productSectioncontroller_1.updateProductSection);
router.delete("/delete/:id", Jwt_1.decodeToken, productSectioncontroller_1.deleteProductSection);
exports.default = router;
