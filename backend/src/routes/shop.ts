import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

/* -------------------------------------------------------
   Create Upload Folders
--------------------------------------------------------*/
const logoDir = path.join(process.cwd(), "uploads", "brandsLogo");
const bannerDir = path.join(process.cwd(), "uploads", "bannersLogo");

[logoDir, bannerDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* -------------------------------------------------------
   Multer Storage Config
--------------------------------------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") cb(null, logoDir);
    else if (file.fieldname === "banner") cb(null, bannerDir);
    else cb(new Error("Invalid file field"), "");
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
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/webp"];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Image type invalid (png, jpg, webp only)"));
  },
});

/* -------------------------------------------------------
   JWT Verify Middleware
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
  } catch (error) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

/* -------------------------------------------------------
   CREATE SHOP
   POST /api/shop/create
--------------------------------------------------------*/
router.post(
  "/create",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const data = req.body.data ? JSON.parse(req.body.data) : req.body;
      const {
        brandName,
        moto,
        description,
        keyword,
        brandEmail,
        phoneNumber,
        tag1,
        tag2,
        tag3,
        tag4,
        instagram,
        facebook,
        linkedin,
        x,
        tiktok,
      } = req.body;

      const ownerId = (req as any).userId;

      if (!brandName)
        return res.status(400).json({ message: "brandName is required" });

      // Images
      const logo =
        req.files && (req.files as any).logo
          ? `/uploads/brandsLogo/${(req.files as any).logo[0].filename}`
          : null;

      const banner =
        req.files && (req.files as any).banner
          ? `/uploads/bannersLogo/${(req.files as any).banner[0].filename}`
          : null;

      const shop = await prisma.stores.create({
        data: {
          owner_id: ownerId,
          brandName: brandName,
          moto: moto,
          keyword: keyword,
          description,
          brandEmail: brandEmail || null,
          phoneNumber: phoneNumber || null,

          tag1: tag1 || null,
          tag2: tag2 || null,
          tag3: tag3 || null,
          tag4: tag4 || null,

          instagram: instagram || null,
          facebook: facebook || null,
          linkedin: linkedin || null,
          x: x || null,
          tiktok: tiktok || null,

          logo,
          banner_image: banner,
        },
      });

      return res.status(201).json({
        message: "Shop created successfully",
        shop,
      });
    } catch (err) {
      console.error("Create shop error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------------------------------------------------------
   UPDATE SHOP
   PUT /api/shop/update/:id
--------------------------------------------------------*/
router.put(
  "/update/:id",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const shop = await prisma.stores.findUnique({
        where: { id },
      });

      if (!shop) return res.status(404).json({ message: "Shop not found" });

      if (shop.owner_id !== userId)
        return res
          .status(403)
          .json({ message: "You are not the owner of this shop" });

      const {
        brandName,
        moto,
        description,
        keyword,
        brandEmail,
        phoneNumber,
        tag1,
        tag2,
        tag3,
        tag4,
        instagram,
        facebook,
        linkedin,
        x,
        tiktok,
      } = req.body;

      const updateData: any = {
        name: brandName || shop.brandName,
        moto: moto || shop.moto,
        description: description ?? shop.description,
        keyword: keyword || shop.keyword,
        brandEmail: brandEmail ?? shop.brandEmail,
        phoneNumber: phoneNumber ?? shop.phoneNumber,

        tag1: tag1 ?? shop.tag1,
        tag2: tag2 ?? shop.tag2,
        tag3: tag3 ?? shop.tag3,
        tag4: tag4 ?? shop.tag4,

        instagram: instagram ?? shop.instagram,
        facebook: facebook ?? shop.facebook,
        linkedin: linkedin ?? shop.linkedin,
        x: x ?? shop.x,
        tiktok: tiktok ?? shop.tiktok,
      };

      // Replace Logo
      if (req.files && (req.files as any).logo) {
        const newFile = (req.files as any).logo[0];
        const newPath = `/uploads/brandsLogo/${newFile.filename}`;
        updateData.logo = newPath;

        // delete old logo
        if (shop.logo) {
          const oldPath = path.join(
            process.cwd(),
            "uploads",
            "brandsLogo",
            path.basename(shop.logo)
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      // Replace Banner
      if (req.files && (req.files as any).banner) {
        const newFile = (req.files as any).banner[0];
        const newPath = `/uploads/bannersLogo/${newFile.filename}`;
        updateData.banner_image = newPath;

        // delete old banner
        if (shop.banner_image) {
          const oldPath = path.join(
            process.cwd(),
            "uploads",
            "bannersLogo",
            path.basename(shop.banner_image)
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const updatedShop = await prisma.stores.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json({
        message: "Shop updated successfully",
        shop: updatedShop,
      });
    } catch (err) {
      console.error("Update shop error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * Récupérer le shop du user connecté
 */
router.get("/my-shop", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const shop = await prisma.stores.findFirst({
      where: { owner_id: userId },
      select: {
        id: true,
        brandName: true,
        description: true,
        owner_id: true,
        created_at: true,
        moto: true,
        keyword: true,
        brandEmail: true,
        phoneNumber: true,
        tag1: true,
        tag2: true,
        tag3: true,
        tag4: true,
        instagram: true,
        facebook: true,
        linkedin: true,
        x: true,
        tiktok: true,
        logo: true,
        banner_image: true,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "No shop found for this user" });
    }

    return res.json(shop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
