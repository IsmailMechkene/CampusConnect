// server/src/routes/favourites.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/products?is_favourite=true
 * Returns products where is_favourite = true (or all products if param absent)
 */
router.get('/products', async (req, res) => {
  try {
    const { is_favourite } = req.query;
    const where: any = {};

    if (is_favourite === 'true') where.is_favourite = true;
    // add pagination/ordering as needed

    const products = await prisma.products.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        store_id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        is_favourite: true
      }
    });

    // Prisma Decimal -> convert to string for JSON safety if needed
    const normalized = products.map(p => ({ ...p, price: p.price?.toString?.() ?? p.price }));
    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

/**
 * GET /api/stores?is_favourite=true
 */
router.get('/stores', async (req, res) => {
  try {
    const { is_favourite } = req.query;
    const where: any = {};
    if (is_favourite === 'true') where.is_favourite = true;

    const stores = await prisma.stores.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        owner_id: true,
        brandName: true,
        moto: true,
        description: true,
        logo: true,
        banner_image: true,
        keyword: true,
        is_favourite: true
      }
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

/**
 * PATCH /api/products/:id  { is_favourite: boolean }
 * Updates product's is_favourite
 */
router.patch('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { is_favourite } = req.body;
    if (typeof is_favourite !== 'boolean') {
      return res.status(400).json({ message: 'is_favourite must be boolean' });
    }
    const updated = await prisma.products.update({
      where: { id },
      data: { is_favourite }
    });

    res.json({ ...updated, price: updated.price?.toString?.() ?? updated.price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

/**
 * PATCH /api/stores/:id  { is_favourite: boolean }
 */
router.patch('/stores/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { is_favourite } = req.body;
    if (typeof is_favourite !== 'boolean') {
      return res.status(400).json({ message: 'is_favourite must be boolean' });
    }
    const updated = await prisma.stores.update({
      where: { id },
      data: { is_favourite }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update store' });
  }
});

export default router;
