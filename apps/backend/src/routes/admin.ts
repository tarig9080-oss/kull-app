import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireAdmin);

router.get('/dashboard', async (_req, res) => {
  const [users, products, orders, pendingPayments] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.payment.count({ where: { status: 'pending' } }),
  ]);
  const revenue = await prisma.order.aggregate({ where: { status: 'completed' }, _sum: { commission: true } });
  res.json({ success: true, data: { users, products, orders, pendingPayments, totalRevenue: revenue._sum.commission || 0 } });
});

router.get('/payments/pending', async (_req, res) => {
  const payments = await prisma.payment.findMany({
    where: { status: 'pending', receiptUrl: { not: null } },
    include: { order: { include: { buyer: { select: { id: true, name: true, phone: true } }, product: true } } },
    orderBy: { order: { createdAt: 'desc' } },
  });
  res.json({ success: true, data: payments });
});

router.post('/payments/:id/confirm', async (req, res) => {
  const payment = await prisma.payment.update({
    where: { id: req.params.id },
    data: { status: 'confirmed', paidAt: new Date() },
  });
  await prisma.order.update({ where: { id: payment.orderId }, data: { status: 'paid' } });
  res.json({ success: true, data: payment, message: 'تم تأكيد الدفع وتفعيل الضمان' });
});

router.post('/payments/:id/reject', async (req, res) => {
  await prisma.payment.update({ where: { id: req.params.id }, data: { status: 'failed' } });
  const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
  if (payment) await prisma.order.update({ where: { id: payment.orderId }, data: { status: 'pending' } });
  res.json({ success: true, message: 'تم رفض الدفع' });
});

router.get('/disputes', async (_req, res) => {
  const disputes = await prisma.order.findMany({
    where: { status: 'disputed' },
    include: { buyer: { select: { id: true, name: true, phone: true } }, product: { include: { seller: { select: { id: true, name: true, phone: true } } } }, payment: true },
  });
  res.json({ success: true, data: disputes });
});

router.post('/disputes/:id/resolve', async (req, res) => {
  const { resolution } = req.body; // 'buyer' or 'seller'
  const escrowStatus = resolution === 'seller' ? 'released' : 'refunded';
  const status = resolution === 'seller' ? 'completed' : 'refunded';
  const updated = await prisma.order.update({ where: { id: req.params.id }, data: { status, escrowStatus } });
  if (status === 'completed') await prisma.product.update({ where: { id: updated.productId }, data: { status: 'sold' } });
  else await prisma.product.update({ where: { id: updated.productId }, data: { status: 'active' } });
  res.json({ success: true, data: updated });
});

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
  res.json({ success: true, data: users });
});

export default router;
