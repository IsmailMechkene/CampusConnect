import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/* -------------------------------------------------------
   CREATE UPLOAD FOLDER
--------------------------------------------------------*/
const productImagesDir = path.join(process.cwd(), "uploads", "products");

if (!fs.existsSync(productImagesDir)) {
  fs.mkdirSync(productImagesDir, { recursive: true });
}

/* -------------------------------------------------------
   MULTER STORAGE
--------------------------------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productImagesDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid image type"));
  },
});

/* -------------------------------------------------------
   VERIFY TOKEN
--------------------------------------------------------*/
const verifyToken = (req: Request, res: Response, next: Function) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token required" });

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as { id: string };

    (req as any).userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* -------------------------------------------------------
   GET ALL PRODUCTS OF THE STORE
--------------------------------------------------------*/
router.get("/my-products", verifyToken, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).userId;

    const store = await prisma.stores.findFirst({
      where: { owner_id: ownerId },
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    const products = await prisma.products.findMany({
      where: { store_id: store.id },
    });

    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------------
   ADD PRODUCT
--------------------------------------------------------*/
router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).userId;

      const store = await prisma.stores.findFirst({
        where: { owner_id: ownerId },
      });

      if (!store)
        return res.status(404).json({ message: "You don't have a store" });

      const {
        name,
        description,
        price,
        stock,
        Category,
        tag1,
        tag2,
        tag3,
        tag4,
      } = req.body;

      if (!name || !price)
        return res.status(400).json({ message: "Name and price required" });

      const image = req.file ? `/uploads/products/${req.file.filename}` : null;

      const product = await prisma.products.create({
        data: {
          store_id: store.id,
          name,
          description: description || null,
          price: Number(price),
          stock: Number(stock) || 0,
          Category: Category || null,
          tag1: tag1 || null,
          tag2: tag2 || null,
          tag3: tag3 || null,
          tag4: tag4 || null,
          image: image ?? "",
        },
      });

      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      console.error("Create product error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------------------------------------------------------
   UPDATE PRODUCT
--------------------------------------------------------*/
router.put(
  "/update/:id",
  verifyToken,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ownerId = (req as any).userId;

      const product = await prisma.products.findUnique({
        where: { id },
      });

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const store = await prisma.stores.findFirst({
        where: { id: product.store_id, owner_id: ownerId },
      });

      if (!store) return res.status(403).json({ message: "Unauthorized" });

      const {
        name,
        description,
        price,
        stock,
        Category,
        tag1,
        tag2,
        tag3,
        tag4,
      } = req.body;

      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (stock !== undefined) updateData.stock = Number(stock);
      if (Category !== undefined) updateData.Category = Category;

      if (tag1 !== undefined) updateData.tag1 = tag1;
      if (tag2 !== undefined) updateData.tag2 = tag2;
      if (tag3 !== undefined) updateData.tag3 = tag3;
      if (tag4 !== undefined) updateData.tag4 = tag4;

      if (req.file) {
        const newPath = `/uploads/products/${req.file.filename}`;
        updateData.image = newPath;

        if (product.image) {
          const oldPath = path.join(
            process.cwd(),
            "uploads",
            "products",
            path.basename(product.image)
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const updated = await prisma.products.update({
        where: { id },
        data: updateData,
      });

      return res.json({
        message: "Product updated successfully",
        product: updated,
      });
    } catch (err) {
      console.error("Update product error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------------------------------------------------------
   DELETE PRODUCT
--------------------------------------------------------*/
router.delete(
  "/delete/:id",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ownerId = (req as any).userId;

      const product = await prisma.products.findUnique({
        where: { id },
      });

      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const store = await prisma.stores.findFirst({
        where: { id: product.store_id, owner_id: ownerId },
      });

      if (!store) return res.status(403).json({ message: "Unauthorized" });

      if (product.image) {
        const imgPath = path.join(
          process.cwd(),
          "uploads",
          "products",
          path.basename(product.image)
        );
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      await prisma.products.delete({
        where: { id },
      });

      return res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Delete product error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
