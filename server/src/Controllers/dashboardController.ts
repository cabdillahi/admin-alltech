import { Response } from "express"
import { subMonths, startOfMonth } from "date-fns"
import { CustomUserRequest } from "../helpers/secure/Jwt"
import { PrismaClient, UserRole, Condition, SectionType } from "@prisma/client"

export const prisma = new PrismaClient()

export const getDashboardOverview = async (req: CustomUserRequest, res: any) => {
  try {
    const now = new Date()
    const sixMonthsAgo = subMonths(startOfMonth(now), 5)

    const userRoles = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
      where: { isdeleted: false },
    })

    const [totalProducts, newProducts] = await Promise.all([
      prisma.product.count({ where: { isdeleted: false } }),
      prisma.product.count({
        where: { isdeleted: false, createdAt: { gte: startOfMonth(now) } },
      }),
    ])

    const productConditions = await prisma.product.groupBy({
      by: ["condition"],
      _count: true,
      where: { isdeleted: false },
    })

    // 4. Categories count
    const [totalCategories, activeCategories, inactiveCategories] =
      await Promise.all([
        prisma.category.count({ where: { isdeleted: false } }),
        prisma.category.count({ where: { isdeleted: false, isactive: true } }),
        prisma.category.count({ where: { isdeleted: false, isactive: false } }),
      ])

    // 5. Product Sections grouped by type
    const sectionTypes = await prisma.productSection.groupBy({
      by: ["sectionType"],
      _count: true,
      where: { isdeleted: false },
    })

    // 6. Trends: new products per month in last 6 months
    const productTrends =
      await prisma.$queryRaw<Array<{ month: Date; total: number }>>`
      SELECT
        DATE_TRUNC('month', "createdAt") AS month,
        COUNT(*)::int AS total
      FROM "Product"
      WHERE "isdeleted" = false AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY month
      ORDER BY month ASC
    `

    // 7. Recent Products & Categories
    const [recentProducts, recentCategories] = await Promise.all([
      prisma.product.findMany({
        where: { isdeleted: false },
        include: { Category: true, User: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.category.findMany({
        where: { isdeleted: false },
        include: { User: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

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
    })
  } catch (error) {
    console.error("Dashboard Error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
