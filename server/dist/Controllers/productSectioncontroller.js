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
exports.deleteProductSection = exports.updateProductSection = exports.getProductSectionById = exports.getAllProductSections = exports.createProductSection = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ========================
// Create ProductSection
// ========================
const createProductSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { displayOrder } = req.body;
        const newSection = yield prisma.productSection.create({
            data: {
                sectionType: req.body.sectionType,
                displayOrder,
                productProductid: +req.body.productProductid,
                userUserid: (_a = req.user) === null || _a === void 0 ? void 0 : _a.Userid,
            },
        });
        res.status(201).json({ message: 'ProductSection created successfully', data: newSection });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product section', error });
    }
});
exports.createProductSection = createProductSection;
// ========================
// Get All ProductSections with Filtering, Sorting, Pagination, Search
// ========================
const getAllProductSections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', isactive, isdeleted, sectionType, search, userUserid, } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const where = {};
        if (isactive !== undefined)
            where.isactive = isactive === 'true';
        if (isdeleted !== undefined)
            where.isdeleted = isdeleted === 'true';
        if (sectionType)
            where.sectionType = sectionType;
        if (userUserid)
            where.userUserid = Number(userUserid);
        if (search) {
            where.OR = [
                { sectionType: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [sections, total] = yield Promise.all([
            prisma.productSection.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: {
                    [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
                },
                include: { User: true },
            }),
            prisma.productSection.count({ where }),
        ]);
        res.status(200).json({
            data: sections,
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
        res.status(500).json({ message: 'Failed to fetch product sections', error });
    }
});
exports.getAllProductSections = getAllProductSections;
// ========================
// Get ProductSection by ID
// ========================
const getProductSectionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sectionId = parseInt(req.params.id);
        const section = yield prisma.productSection.findUnique({
            where: { ProductSectionid: sectionId },
            include: { User: true },
        });
        if (!section || section.isdeleted) {
            return res.status(404).json({ message: 'ProductSection not found' });
        }
        res.status(200).json({ data: section });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product section', error });
    }
});
exports.getProductSectionById = getProductSectionById;
// ========================
// Update ProductSection
// ========================
const updateProductSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sectionId = parseInt(req.params.id);
        const updates = req.body;
        const updatedSection = yield prisma.productSection.update({
            where: { ProductSectionid: sectionId },
            data: Object.assign(Object.assign({}, updates), { updatedAt: new Date() }),
        });
        res.status(200).json({ message: 'ProductSection updated successfully', data: updatedSection });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product section', error });
    }
});
exports.updateProductSection = updateProductSection;
// ========================
// Soft Delete ProductSection
// ========================
const deleteProductSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sectionId = parseInt(req.params.id);
        const deletedSection = yield prisma.productSection.update({
            where: { ProductSectionid: sectionId },
            data: { isdeleted: true, isactive: false },
        });
        res.status(200).json({ message: 'ProductSection soft-deleted successfully', data: deletedSection });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product section', error });
    }
});
exports.deleteProductSection = deleteProductSection;
