import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { COMMISSION_RATE } from '@kull/shared';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
    if (product.status !== 'active') return res.status(400).json({ success: false, message: 'المنتج غير متاح' });
    if (product.sellerId === req.user!.id) return res.status(400).json({ success: false, message: 'لا يمكنك شراء منتجك' });

    const commission = product.price * COMMISSION_RATE;
    const sellerAmount = product.price - commission;

    const order = await prisma.order.create({
      data: {
        buyerId: req.user!.id,
        productId,
        amount: product.price,
        commission,
        sellerAmount,
        status: 'pending',
        escrowStatus: 'held',
      },
      include: { product: { include: { seller: { select: { id: true, name: true, phone: true } } } }, buyer: { select: { id: true, name: true, phone: true } } },
    });

    await prisma.product.update({ where: { id: productId }, data: { status: 'pending' } });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { buyerId: req.user!.id },
    include: { product: true, payment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders.map(o => ({ ...o, product: { ...o.product, images: JSON.parse(o.product.images) } })) });
});

router.get('/seller', authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { product: { sellerId: req.user!.id } },
    include: { product: true, buyer: { select: { id: true, name: true, phone: true } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders.map(o => ({ ...o, product: { ...o.product, images: JSON.parse(o.product.images) } })) });
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { product: { include: { seller: { select: { id: true, name: true, phone: true } } } }, buyer: { select: { id: true, name: true, phone: true } }, payment: true },
  });
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  const isParty = order.buyerId === req.user!.id || order.product.sellerId === req.user!.id || req.user!.role === 'admin';
  if (!isParty) return res.status(403).json({ success: false, message: 'غير مصرح' });
  res.json({ success: true, data: { ...order, product: { ...order.product, images: JSON.parse(order.product.images) } } });
});

router.post('/:id/confirm-delivery', authenticate, async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  if (order.buyerId !== req.user!.id) return res.status(403).json({ success: false, message: 'فقط المشتري يمكنه التأكيد' });
  if (order.status !== 'paid') return res.status(400).json({ success: false, message: 'لا يمكن تأكيد الاستلام - الطلب لم يُدفع بعد' });

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: 'completed', escrowStatus: 'released' },
  });
  await prisma.product.update({ where: { id: order.productId }, data: { status: 'sold' } });
  res.json({ success: true, data: updated, message: 'تم تأكيد الاستلام وتحرير المبلغ للبائع' });
});

router.post('/:id/dispute', authenticate, async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  const isParty = order.buyerId === req.user!.id;
  if (!isParty) return res.status(403).json({ success: false, message: 'غير مصرح' });
  if (!['paid', 'delivered'].includes(order.status)) return res.status(400).json({ success: false, message: 'لا يمكن فتح نزاع على هذا الطلب' });

  const updated = await prisma.order.update({ where: { id: req.params.id }, data: { status: 'disputed' } });
  res.json({ success: true, data: updated, message: 'تم فتح نزاع - سيتواصل معك فريق الدعم خلال 24 ساعة' });
});

router.put('/:id/delivery-method', authenticate, async (req: AuthRequest, res: Response) => {
  const { deliveryMethod } = req.body;
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { product: true } });
  if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  const isParty = order.buyerId === req.user!.id || order.product.sellerId === req.user!.id;
  if (!isParty) return res.status(403).json({ success: false, message: 'غير مصرح' });

  const updated = await prisma.order.update({ where: { id: req.params.id }, data: { deliveryMethod, status: 'delivered' } });
  res.json({ success: true, data: updated });
});

export default router;
