import { PrismaClient } from '@prisma/client'
import { CustomUserRequest } from '../helpers/secure/Jwt'

const prisma = new PrismaClient()

// ========================
// Create Category
// ========================
export const createCategory = async (req: CustomUserRequest, res: any) => {
  try {
    const { name, description, Userid } = req.body

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        userUserid:req.user?.Userid,
      },
    })

    res.status(201).json({ message: 'Category created successfully', data: newCategory })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create category', error })
  }
}

// ========================
// Get All Categories with Filtering, Sorting, Pagination, Search
// ========================
export const getAllCategories = async (req: CustomUserRequest, res: any) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isactive,
      isdeleted,
      search,
      userUserid,
    } = req.query

    const pageNumber = parseInt(page as string, 10)
    const pageSize = parseInt(limit as string, 10)
    const skip = (pageNumber - 1) * pageSize

    const where: any = {}

    if (isactive !== undefined) where.isactive = isactive === 'true'
    if (isdeleted !== undefined) where.isdeleted = isdeleted === 'true'
    if (userUserid) where.userUserid = Number(userUserid)
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
        include: { User: true, Product: true },
      }),
      prisma.category.count({ where }),
    ])

    res.status(200).json({
      data: categories,
      meta: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch categories', error })
  }
}

// ========================
// Get Category by ID
// ========================
export const getCategoryById = async (req: CustomUserRequest, res: any) => {
  try {
    const categoryId = parseInt(req.params.id)

    const category = await prisma.category.findUnique({
      where: { Categoryid: categoryId },
      include: { User: true, Product: true },
    })

    if (!category || category.isdeleted) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json({ data: category })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch category', error })
  }
}

// ========================
// Update Category
// ========================
export const updateCategory = async (req: CustomUserRequest, res: any) => {
  try {
    const categoryId = parseInt(req.params.id)
    const { name, description, isactive } = req.body

    const updatedCategory = await prisma.category.update({
      where: { Categoryid: categoryId },
      data: {
        name,
        description,
        isactive,
        updatedAt: new Date(),
      },
    })

    res.status(200).json({ message: 'Category updated successfully', data: updatedCategory })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update category', error })
  }
}

// ========================
// Soft Delete Category
// ========================
export const deleteCategory = async (req: CustomUserRequest, res: any) => {
  try {
    const categoryId = parseInt(req.params.id)

    const deletedCategory = await prisma.category.update({
      where: { Categoryid: categoryId },
      data: { isdeleted: true, isactive: false },
    })

    res.status(200).json({ message: 'Category soft-deleted successfully', data: deletedCategory })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete category', error })
  }
}
