import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/receipts'),
  filename: (_req, file, cb) => cb(null, `receipt-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/initiate', authenticate, async (req: AuthRequest, res: Response) => {
  const { orderId, method } = req.body;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  if (order.buyerId !== req.user!.id) return res.status(403).json({ success: false, message: 'غير مصرح' });
  if (order.status !== 'pending') return res.status(400).json({ success: false, message: 'هذا الطلب لا يمكن دفعه' });

  const existingPayment = await prisma.payment.findUnique({ where: { orderId } });
  if (existingPayment) return res.json({ success: true, data: existingPayment });

  const payment = await prisma.payment.create({
    data: { orderId, method, status: 'pending' },
  });
  res.status(201).json({ success: true, data: payment });
});

router.post('/:id/upload-receipt', authenticate, upload.single('receipt'), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'يرجى رفع إيصال الدفع' });
  const payment = await prisma.payment.findUnique({ where: { id: req.params.id }, include: { order: true } });
  if (!payment) return res.status(404).json({ success: false, message: 'الدفعة غير موجودة' });
  if (payment.order.buyerId !== req.user!.id) return res.status(403).json({ success: false, message: 'غير مصرح' });

  const updated = await prisma.payment.update({
    where: { id: req.params.id },
    data: { receiptUrl: `/uploads/receipts/${req.file.filename}`, transactionRef: req.body.transactionRef },
  });
  res.json({ success: true, data: updated, message: 'تم رفع الإيصال - سيتم مراجعته والتأكيد خلال ساعات' });
});

export default router;
