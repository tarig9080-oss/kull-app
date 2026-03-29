import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'غير مصرح / Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, role: true, email: true } });
    if (!user) return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'رمز غير صالح / Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'غير مصرح - يلزم صلاحية مشرف' });
  }
  next();
};
