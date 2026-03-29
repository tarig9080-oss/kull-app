import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const productSchema = z.object({
  title: z.string().min(3, 'العنوان مطلوب'),
  description: z.string().min(10, 'الوصف مطلوب'),
  price: z.number().positive('السعر يجب أن يكون موجباً'),
  warrantyDays: z.number().int().default(0),
  state: z.string().default(''),
});

router.get('/', async (req, res) => {
  const { search, minPrice, maxPrice, state, page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  const where: any = { status: 'active' };
  if (search) where.OR = [
    { title: { contains: search as string } },
    { description: { contains: search as string } },
  ];
  if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice as string) };
  if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
  if (state && state !== '') where.state = state as string;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, skip, take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
      include: { seller: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ success: true, data: { products: products.map(p => ({ ...p, images: JSON.parse(p.images) })), total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) } });
});

router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { seller: { select: { id: true, name: true, phone: true, createdAt: true } } },
  });
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  res.json({ success: true, data: { ...product, images: JSON.parse(product.images) } });
});

router.post('/', authenticate, upload.array('images', 5), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const body = { ...req.body, price: parseFloat(req.body.price), warrantyDays: parseInt(req.body.warrantyDays || '0'), state: req.body.state || '' };
    const data = productSchema.parse(body);
    const images = files?.map(f => `/uploads/${f.filename}`) || [];

    const product = await prisma.product.create({
      data: { ...data, images: JSON.stringify(images), sellerId: req.user!.id },
    });
    res.status(201).json({ success: true, data: { ...product, images } });
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ success: false, errors: err.errors });
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.put('/:id', authenticate, upload.array('images', 5), async (req: AuthRequest, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'غير مصرح' });
  }
  const files = req.files as Express.Multer.File[];
  const images = files?.length ? files.map(f => `/uploads/${f.filename}`) : JSON.parse(product.images);
  const updateData: any = { title: req.body.title, description: req.body.description };
  if (req.body.price) updateData.price = parseFloat(req.body.price);
  if (req.body.warrantyDays !== undefined) updateData.warrantyDays = parseInt(req.body.warrantyDays);
  if (req.body.status) updateData.status = req.body.status;
  updateData.images = JSON.stringify(images);

  const updated = await prisma.product.update({ where: { id: req.params.id }, data: updateData });
  res.json({ success: true, data: { ...updated, images } });
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  if (product.sellerId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'غير مصرح' });
  }
  await prisma.product.update({ where: { id: req.params.id }, data: { status: 'pending' } });
  res.json({ success: true, message: 'تم حذف المنتج' });
});

router.get('/seller/my', authenticate, async (req: AuthRequest, res: Response) => {
  const products = await prisma.product.findMany({
    where: { sellerId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: products.map(p => ({ ...p, images: JSON.parse(p.images) })) });
});

export default router;
