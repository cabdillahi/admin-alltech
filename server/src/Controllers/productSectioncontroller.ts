import { PrismaClient } from '@prisma/client'
import { CustomUserRequest } from '../helpers/secure/Jwt'

const prisma = new PrismaClient()

// ========================
// Create ProductSection
// ========================
export const createProductSection = async (req: CustomUserRequest, res: any) => {
  try {
    const {  displayOrder } = req.body

    const newSection = await prisma.productSection.create({
      data: {
        sectionType:req.body.sectionType,
        displayOrder,
        productProductid:+req.body.productProductid,
        userUserid:req.user?.Userid,
      },
    })

    res.status(201).json({ message: 'ProductSection created successfully', data: newSection })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create product section', error })
  }
}

// ========================
// Get All ProductSections with Filtering, Sorting, Pagination, Search
// ========================
export const getAllProductSections = async (req: CustomUserRequest, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isactive,
      isdeleted,
      sectionType,
      search,
      userUserid,
    } = req.query

    const pageNumber = parseInt(page as string, 10)
    const pageSize = parseInt(limit as string, 10)
    const skip = (pageNumber - 1) * pageSize

    const where: any = {}

    if (isactive !== undefined) where.isactive = isactive === 'true'
    if (isdeleted !== undefined) where.isdeleted = isdeleted === 'true'
    if (sectionType) where.sectionType = sectionType as string
    if (userUserid) where.userUserid = Number(userUserid)
    if (search) {
      where.OR = [
        { sectionType: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const [sections, total] = await Promise.all([
      prisma.productSection.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: { User: true },
      }),
      prisma.productSection.count({ where }),
    ])

    res.status(200).json({
      data: sections,
      meta: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch product sections', error })
  }
}

// ========================
// Get ProductSection by ID
// ========================
export const getProductSectionById = async (req: CustomUserRequest, res: any) => {
  try {
    const sectionId = parseInt(req.params.id)

    const section = await prisma.productSection.findUnique({
      where: { ProductSectionid: sectionId },
      include: { User: true },
    })

    if (!section || section.isdeleted) {
      return res.status(404).json({ message: 'ProductSection not found' })
    }

    res.status(200).json({ data: section })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch product section', error })
  }
}

// ========================
// Update ProductSection
// ========================
export const updateProductSection = async (req: CustomUserRequest, res: any) => {
  try {
    const sectionId = parseInt(req.params.id)
    const updates = req.body

    const updatedSection = await prisma.productSection.update({
      where: { ProductSectionid: sectionId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    res.status(200).json({ message: 'ProductSection updated successfully', data: updatedSection })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update product section', error })
  }
}

// ========================
// Soft Delete ProductSection
// ========================
export const deleteProductSection = async (req: CustomUserRequest, res: any) => {
  try {
    const sectionId = parseInt(req.params.id)

    const deletedSection = await prisma.productSection.update({
      where: { ProductSectionid: sectionId },
      data: { isdeleted: true, isactive: false },
    })

    res.status(200).json({ message: 'ProductSection soft-deleted successfully', data: deletedSection })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete product section', error })
  }
}
