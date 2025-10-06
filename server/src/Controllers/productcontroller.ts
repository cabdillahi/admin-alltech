import { PrismaClient } from "@prisma/client";
import { CustomUserRequest } from "../helpers/secure/Jwt";
import cloudinary from "../helpers/Muler/Cloudinary";
import { createSlug } from "../utils/slug";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// ========================
// Create Product
// ========================

export const createProduct = async (req: CustomUserRequest, res: any) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      condition,
      rating,
      contactMethod,
      categoryCategoryid,
    } = req.body;

    const userId = req.user?.Userid;

    // --- Validation ---
    if (!name || !price || !categoryCategoryid || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // --- Image Upload ---
    const file = req.file;
    let url = null;

    if (file?.path) {
      const image = await cloudinary.uploader.upload(file.path);
      url = image.secure_url;
    }

    const checkProduct = await prisma.product.findUnique({
      where: {
        name,
      },
    });

    if (checkProduct) {
      return res.status(400).json({
        message: "product name is already exitst",
      });
    }

    // --- Parse numeric fields ---
    const parsedPrice = parseFloat(price);
    const parsedOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
    const parsedRating = rating ? parseFloat(rating) : undefined;
    const parsedCategoryId = parseInt(categoryCategoryid, 10);

    if (isNaN(parsedPrice) || isNaN(parsedCategoryId)) {
      return res
        .status(400)
        .json({ message: "Invalid price or category format." });
    }

    // --- Create slug ---
    const slug = createSlug(name);

    // --- Create product in database ---
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price: parsedPrice,
        oldPrice: parsedOldPrice,
        condition: condition || "NEW",
        rating: parsedRating,
        imageUrl: url!,
        contactMethod: contactMethod || null,
        categoryCategoryid: parsedCategoryId,
        userUserid: userId,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

// ========================
// Get All Products with Filtering, Sorting, Pagination, Search
// ========================

export const getAllProducts = async (req: CustomUserRequest, res: any) => {
  try {
    const {
      page = "1",
      limit = "12",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      categoryCategoryid,
      minPrice,
      maxPrice,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    const where: any = {};

    if (categoryCategoryid)
      where.categoryCategoryid = Number(categoryCategoryid);
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy as string]: sortOrder === "asc" ? "asc" : "desc" },
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// ========================
// Get Product by ID
// ========================
export const getProductById = async (req: CustomUserRequest, res: any) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { Productid: productId },
      include: { User: true, Category: true },
    });

    if (!product || product.isdeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

// ========================
// Update Product
// ========================
export const updateProduct = async (req: CustomUserRequest, res: any) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;

    const updatedProduct = await prisma.product.update({
      where: { Productid: productId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// ========================
// Soft Delete Product
// ========================
export const deleteProduct = async (req: CustomUserRequest, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { Productid: id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

// get slug product

export const getProductBySlug = async (req: Request, res: any) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        Category: true,
        User: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product found", data: product });
  } catch (error: any) {
    console.error("Get product by slug error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};
