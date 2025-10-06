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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ========================
// Create Category
// ========================
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, Userid } = req.body;
        const newCategory = yield prisma.category.create({
            data: {
                name,
                description,
                userUserid: (_a = req.user) === null || _a === void 0 ? void 0 : _a.Userid,
            },
        });
        res.status(201).json({ message: 'Category created successfully', data: newCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create category', error });
    }
});
exports.createCategory = createCategory;
// ========================
// Get All Categories with Filtering, Sorting, Pagination, Search
// ========================
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', isactive, isdeleted, search, userUserid, } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const where = {};
        if (isactive !== undefined)
            where.isactive = isactive === 'true';
        if (isdeleted !== undefined)
            where.isdeleted = isdeleted === 'true';
        if (userUserid)
            where.userUserid = Number(userUserid);
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [categories, total] = yield Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
                },
                include: { User: true, Product: true },
            }),
            prisma.category.count({ where }),
        ]);
        res.status(200).json({
            data: categories,
            meta: {
                total,
                page: pageNumber,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch categories', error });
    }
});
exports.getAllCategories = getAllCategories;
// ========================
// Get Category by ID
// ========================
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const category = yield prisma.category.findUnique({
            where: { Categoryid: categoryId },
            include: { User: true, Product: true },
        });
        if (!category || category.isdeleted) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ data: category });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch category', error });
    }
});
exports.getCategoryById = getCategoryById;
// ========================
// Update Category
// ========================
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, description, isactive } = req.body;
        const updatedCategory = yield prisma.category.update({
            where: { Categoryid: categoryId },
            data: {
                name,
                description,
                isactive,
                updatedAt: new Date(),
            },
        });
        res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update category', error });
    }
});
exports.updateCategory = updateCategory;
// ========================
// Soft Delete Category
// ========================
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.id);
        const deletedCategory = yield prisma.category.update({
            where: { Categoryid: categoryId },
            data: { isdeleted: true, isactive: false },
        });
        res.status(200).json({ message: 'Category soft-deleted successfully', data: deletedCategory });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete category', error });
    }
});
exports.deleteCategory = deleteCategory;
