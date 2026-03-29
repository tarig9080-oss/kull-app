import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { orderId, revieweeId, rating, comment } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'التقييم يجب أن يكون بين 1 و 5' });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'completed') return res.status(400).json({ success: false, message: 'لا يمكن التقييم قبل إتمام الصفقة' });

  const existing = await prisma.review.findFirst({ where: { orderId, reviewerId: req.user!.id } });
  if (existing) return res.status(400).json({ success: false, message: 'لقد قمت بالتقييم مسبقاً' });

  const review = await prisma.review.create({
    data: { orderId, reviewerId: req.user!.id, revieweeId, rating, comment },
  });
  res.status(201).json({ success: true, data: review });
});

router.get('/user/:userId', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: req.params.userId },
    include: { reviewer: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ success: true, data: { reviews, average: avg, count: reviews.length } });
});

export default router;
