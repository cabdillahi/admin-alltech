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
exports.getDashboardOverview = exports.prisma = void 0;
const date_fns_1 = require("date-fns");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const getDashboardOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const sixMonthsAgo = (0, date_fns_1.subMonths)((0, date_fns_1.startOfMonth)(now), 5);
        const userRoles = yield exports.prisma.user.groupBy({
            by: ["role"],
            _count: true,
            where: { isdeleted: false },
        });
        const [totalProducts, newProducts] = yield Promise.all([
            exports.prisma.product.count({ where: { isdeleted: false } }),
            exports.prisma.product.count({
                where: { isdeleted: false, createdAt: { gte: (0, date_fns_1.startOfMonth)(now) } },
            }),
        ]);
        const productConditions = yield exports.prisma.product.groupBy({
            by: ["condition"],
            _count: true,
            where: { isdeleted: false },
        });
        // 4. Categories count
        const [totalCategories, activeCategories, inactiveCategories] = yield Promise.all([
            exports.prisma.category.count({ where: { isdeleted: false } }),
            exports.prisma.category.count({ where: { isdeleted: false, isactive: true } }),
            exports.prisma.category.count({ where: { isdeleted: false, isactive: false } }),
        ]);
        // 5. Product Sections grouped by type
        const sectionTypes = yield exports.prisma.productSection.groupBy({
            by: ["sectionType"],
            _count: true,
            where: { isdeleted: false },
        });
        // 6. Trends: new products per month in last 6 months
        const productTrends = yield exports.prisma.$queryRaw `
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        COUNT(*)::int AS total
      FROM "Product"
      WHERE "isdeleted" = false AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY month
      ORDER BY month ASC
    `;
        // 7. Recent Products & Categories
        const [recentProducts, recentCategories] = yield Promise.all([
            exports.prisma.product.findMany({
                where: { isdeleted: false },
                include: { Category: true, User: true },
                orderBy: { createdAt: "desc" },
                take: 5,
            }),
            exports.prisma.category.findMany({
                where: { isdeleted: false },
                include: { User: true },
                orderBy: { createdAt: "desc" },
                take: 5,
            }),
        ]);
        // Structure Response
        res.status(200).json({
            users: userRoles.map((r) => ({ role: r.role, count: r._count })),
            products: {
                total: totalProducts,
                newThisMonth: newProducts,
                byCondition: productConditions.map((c) => ({
                    condition: c.condition,
                    count: c._count,
                })),
            },
            categories: {
                total: totalCategories,
                active: activeCategories,
                inactive: inactiveCategories,
            },
            productSections: {
                byType: sectionTypes.map((s) => ({
                    type: s.sectionType,
                    count: s._count,
                })),
            },
            trends: {
                products: productTrends,
            },
            recentActivity: {
                products: recentProducts,
                categories: recentCategories,
            },
        });
    }
    catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getDashboardOverview = getDashboardOverview;
