import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// endpoint مؤقت لإضافة البيانات الأولية — يُستدعى مرة واحدة فقط
router.post('/seed', async (_req, res) => {
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'admin@kull.sd' } });
    if (existing) return res.json({ success: true, message: 'البيانات موجودة بالفعل' });

    const adminPass = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { name: 'مشرف كُـل', email: 'admin@kull.sd', phone: '0912345678', password: adminPass, role: 'admin', lang: 'ar' },
    });

    const sellerPass = await bcrypt.hash('seller123', 10);
    const seller = await prisma.user.create({
      data: { name: 'أحمد محمد', email: 'seller@test.com', phone: '0911111111', password: sellerPass, role: 'seller', lang: 'ar' },
    });

    const seller2Pass = await bcrypt.hash('seller123', 10);
    const seller2 = await prisma.user.create({
      data: { name: 'فاطمة علي', email: 'seller2@test.com', phone: '0922222222', password: seller2Pass, role: 'seller', lang: 'ar' },
    });

    await prisma.product.createMany({
      data: [
        { title: 'لابتوب Dell Core i7', description: 'لابتوب ديل حالة ممتازة، رام 16 جيجا، هارد SSD 512 جيجا، يصلح للشغل والدراسة', price: 85000, warrantyDays: 30, state: 'الخرطوم', sellerId: seller.id, images: '[]' },
        { title: 'آيفون 14 برو 256 جيجا', description: 'آيفون 14 برو لون أسود، بحالة جيدة جداً، بطارية 89%، مع الشاحن الأصلي', price: 120000, warrantyDays: 7, state: 'الخرطوم', sellerId: seller.id, images: '[]' },
        { title: 'تويوتا كورولا 2020', description: 'تويوتا كورولا موديل 2020، مسافة 50 ألف كيلو، فحص كامل، لون أبيض', price: 4500000, warrantyDays: -1, state: 'الجزيرة', sellerId: seller.id, images: '[]' },
        { title: 'شقة للبيع - الخرطوم بحري', description: 'شقة 3 غرف وصالة، الطابق الثاني، قريبة من السوق', price: 8000000, warrantyDays: -1, state: 'الخرطوم', sellerId: seller2.id, images: '[]' },
        { title: 'سامسونج Galaxy S23', description: 'سامسونج S23 جديد تقريباً، 128 جيجا، لون أخضر', price: 95000, warrantyDays: 30, state: 'كسلا', sellerId: seller2.id, images: '[]' },
        { title: 'دراجة نارية هوندا', description: 'هوندا CG125 موديل 2022، حالة ممتازة، قليلة الاستخدام', price: 280000, warrantyDays: 7, state: 'نهر النيل', sellerId: seller.id, images: '[]' },
      ],
    });

    res.json({ success: true, message: '✅ تم إضافة البيانات الأولية بنجاح', accounts: { admin: 'admin@kull.sd / admin123', seller: 'seller@test.com / seller123', seller2: 'seller2@test.com / seller123' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
