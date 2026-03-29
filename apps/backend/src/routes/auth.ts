import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(9, 'رقم الجوال غير صالح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  role: z.enum(['buyer', 'seller']).default('buyer'),
  lang: z.enum(['ar', 'en']).default('ar'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' });

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, phone: true, role: true, lang: true, createdAt: true },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ success: false, errors: err.errors });
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, token } });
  } catch {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, phone: true, role: true, lang: true, createdAt: true },
  });
  res.json({ success: true, data: user });
});

router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, phone, lang } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone, lang },
    select: { id: true, name: true, email: true, phone: true, role: true, lang: true },
  });
  res.json({ success: true, data: user });
});

export default router;
