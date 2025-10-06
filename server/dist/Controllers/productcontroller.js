"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const Cloudinary_1 = __importDefault(require("../helpers/Muler/Cloudinary"));
const prisma = new client_1.PrismaClient();
// ========================
// Create Product
// ========================
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, price, oldPrice, condition, rating, contactMethod, categoryCategoryid, } = req.body;
        const file = req.file;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.Userid;
        // --- Validation ---
        if (!name || !price || !categoryCategoryid || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // --- Image Upload ---
        let imageUrl = "https://cdn-icons-png.flaticon.com/512/1386/1386270.png";
        if (file === null || file === void 0 ? void 0 : file.path) {
            const uploadedImage = yield Cloudinary_1.default.uploader.upload(file.path, { folder: "products" });
            imageUrl = uploadedImage.secure_url;
        }
        // --- Parse numeric fields ---
        const parsedPrice = parseFloat(price);
        const parsedOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
        const parsedRating = rating ? parseFloat(rating) : undefined;
        const parsedCategoryId = parseInt(categoryCategoryid, 10);
        if (isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
            return res.status(400).json({ message: "Invalid price or category format." });
        }
        // --- Create product in database ---
        const newProduct = yield prisma.product.create({
            data: {
                name,
                description: description || null,
                price: parsedPrice,
                oldPrice: parsedOldPrice,
                condition: condition || "NEW",
                rating: parsedRating,
                imageUrl,
                contactMethod: contactMethod || null,
                categoryCategoryid: parsedCategoryId,
                userUserid: userId,
            },
        });
        res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    }
    catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});
exports.createProduct = createProduct;
// ========================
// Get All Products with Filtering, Sorting, Pagination, Search
// ========================
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '12', sortBy = 'createdAt', sortOrder = 'desc', search, categoryCategoryid, minPrice, maxPrice, } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const where = {};
        if (categoryCategoryid)
            where.categoryCategoryid = Number(categoryCategoryid);
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const [products, total] = yield Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder === "asc" ? "asc" : "desc" },
                include: { User: true, Category: true },
            }),
            prisma.product.count({ where }),
        ]);
        res.status(200).json({
            data: products,
            meta: {
                total,
                totalPages: Math.ceil(total / pageSize),
                currentPage: pageNumber,
                limit: pageSize,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products", error });
    }
});
exports.getAllProducts = getAllProducts;
// ========================
// Get Product by ID
// ========================
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const product = yield prisma.product.findUnique({
            where: { Productid: productId },
            include: { User: true, Category: true },
        });
        if (!product || product.isdeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product', error });
    }
});
exports.getProductById = getProductById;
// ========================
// Update Product
// ========================
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const updates = req.body;
        const updatedProduct = yield prisma.product.update({
            where: { Productid: productId },
            data: Object.assign(Object.assign({}, updates), { updatedAt: new Date() }),
        });
        res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error });
    }
});
exports.updateProduct = updateProduct;
// ========================
// Soft Delete Product
// ========================
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const deletedProduct = yield prisma.product.update({
            where: { Productid: productId },
            data: { isdeleted: true, isactive: false, isAvailable: false },
        });
        res.status(200).json({ message: 'Product soft-deleted successfully', data: deletedProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product', error });
    }
});
exports.deleteProduct = deleteProduct;
