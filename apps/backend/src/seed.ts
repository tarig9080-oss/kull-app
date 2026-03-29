import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kull.sd' },
    update: {},
    create: { name: 'مشرف كُـل', email: 'admin@kull.sd', phone: '0912345678', password: adminPass, role: 'admin', lang: 'ar' },
  });

  const sellerPass = await bcrypt.hash('seller123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: { name: 'أحمد محمد', email: 'seller@test.com', phone: '0911111111', password: sellerPass, role: 'seller', lang: 'ar' },
  });

  const products = [
    { title: 'لابتوب Dell Core i7', description: 'لابتوب ديل حالة ممتازة، رام 16 جيجا، هارد SSD 512', price: 85000, warrantyDays: 30, sellerId: seller.id, images: JSON.stringify([]) },
    { title: 'آيفون 14 برو', description: 'آيفون 14 برو 256 جيجا، لون أسود، بحالة جيدة جداً', price: 120000, warrantyDays: 7, sellerId: seller.id, images: JSON.stringify([]) },
    { title: 'سيارة تويوتا كورولا 2020', description: 'تويوتا كورولا موديل 2020، مسافة 50 ألف كيلو، فحص كامل', price: 4500000, warrantyDays: -1, sellerId: seller.id, images: JSON.stringify([]) },
  ];
  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('✅ البيانات الأولية أُضيفت بنجاح');
  console.log('Admin: admin@kull.sd / admin123');
  console.log('Seller: seller@test.com / seller123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
