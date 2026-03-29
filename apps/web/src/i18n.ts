import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const ar = {
  translation: {
    app: { name: 'كُـل', tagline: 'السوق السوداني الأول', description: 'اشتري وبيع بأمان مع ضمان حقوق الطرفين' },
    nav: { home: 'الرئيسية', sell: 'بيع منتج', orders: 'طلباتي', profile: 'حسابي', dashboard: 'لوحة التحكم', login: 'دخول', register: 'تسجيل', logout: 'خروج', admin: 'الإدارة' },
    auth: { email: 'البريد الإلكتروني', password: 'كلمة المرور', name: 'الاسم الكامل', phone: 'رقم الجوال', role: 'نوع الحساب', buyer: 'مشتري', seller: 'بائع', loginBtn: 'دخول', registerBtn: 'إنشاء حساب', noAccount: 'ليس لديك حساب؟', haveAccount: 'لديك حساب بالفعل؟', forgotPass: 'نسيت كلمة المرور؟' },
    product: { add: 'إضافة منتج', title: 'عنوان المنتج', description: 'وصف المنتج', price: 'السعر (جنيه)', warranty: 'مدة الضمان', images: 'صور المنتج', submit: 'نشر المنتج', noWarranty: 'بدون ضمان', byAgreement: 'حسب الاتفاق', buy: 'اشتري الآن', sold: 'مُباع', pending: 'قيد المراجعة', active: 'متاح', details: 'تفاصيل المنتج', seller: 'البائع', warranty_badge: 'ضمان', currency: 'جنيه' },
    order: { title: 'تفاصيل الطلب', status: 'حالة الطلب', escrow: 'حالة الضمان', held: 'محتجز', released: 'مُطلق', refunded: 'مُسترد', confirmDelivery: 'تأكيد استلام المنتج', dispute: 'فتح نزاع', deliveryMethod: 'طريقة التوصيل', commission: 'عمولة التطبيق (1%)', sellerAmount: 'المبلغ للبائع', myOrders: 'طلباتي' },
    payment: { title: 'إتمام الدفع', method: 'طريقة الدفع', bankKhartoum: 'بنك الخرطوم', fawry: 'فوري / موبايل كاش', transfer: 'تحويل بنكي', accountNum: 'رقم الحساب', walletNum: 'رقم المحفظة', accountName: 'اسم الحساب', uploadReceipt: 'رفع إيصال الدفع', transRef: 'مرجع العملية', submit: 'إرسال للمراجعة', pending: 'في الانتظار', confirmed: 'مؤكد', failed: 'فشل', instructions: 'التعليمات' },
    dashboard: { seller: 'لوحة البائع', products: 'منتجاتي', orders: 'الطلبات الواردة', revenue: 'الأرباح', addProduct: 'إضافة منتج جديد' },
    admin: { title: 'لوحة الإدارة', users: 'المستخدمون', pendingPayments: 'دفعات للمراجعة', disputes: 'النزاعات', confirm: 'تأكيد', reject: 'رفض', resolve: 'حل النزاع', totalRevenue: 'إجمالي العمولات' },
    common: { search: 'بحث...', filter: 'تصفية', all: 'الكل', loading: 'جاري التحميل...', error: 'حدث خطأ', success: 'تمت العملية بنجاح', cancel: 'إلغاء', save: 'حفظ', edit: 'تعديل', delete: 'حذف', back: 'رجوع', noResults: 'لا توجد نتائج', SDG: 'ج.س', rating: 'التقييم', review: 'اكتب تقييم', viewAll: 'عرض الكل', currency: 'جنيه سوداني', escrowInfo: 'أموالك محمية - سيتم إطلاق المبلغ للبائع فقط بعد تأكيدك استلام المنتج' },
    status: { pending: 'معلق', paid: 'مدفوع', delivered: 'تم التوصيل', completed: 'مكتمل', disputed: 'نزاع', refunded: 'مسترد' },
  }
};

const en = {
  translation: {
    app: { name: 'Kull', tagline: 'Sudan\'s #1 Marketplace', description: 'Buy and sell safely with guaranteed rights for both parties' },
    nav: { home: 'Home', sell: 'Sell', orders: 'My Orders', profile: 'Profile', dashboard: 'Dashboard', login: 'Login', register: 'Register', logout: 'Logout', admin: 'Admin' },
    auth: { email: 'Email', password: 'Password', name: 'Full Name', phone: 'Phone Number', role: 'Account Type', buyer: 'Buyer', seller: 'Seller', loginBtn: 'Login', registerBtn: 'Create Account', noAccount: 'No account?', haveAccount: 'Already have an account?', forgotPass: 'Forgot password?' },
    product: { add: 'Add Product', title: 'Product Title', description: 'Product Description', price: 'Price (SDG)', warranty: 'Warranty Period', images: 'Product Images', submit: 'Publish Product', noWarranty: 'No Warranty', byAgreement: 'By Agreement', buy: 'Buy Now', sold: 'Sold', pending: 'Pending', active: 'Available', details: 'Product Details', seller: 'Seller', warranty_badge: 'Warranty', currency: 'SDG' },
    order: { title: 'Order Details', status: 'Order Status', escrow: 'Escrow Status', held: 'Held', released: 'Released', refunded: 'Refunded', confirmDelivery: 'Confirm Receipt', dispute: 'Open Dispute', deliveryMethod: 'Delivery Method', commission: 'App Commission (1%)', sellerAmount: 'Seller Amount', myOrders: 'My Orders' },
    payment: { title: 'Complete Payment', method: 'Payment Method', bankKhartoum: 'Bank of Khartoum', fawry: 'Fawry / Mobile Cash', transfer: 'Bank Transfer', accountNum: 'Account Number', walletNum: 'Wallet Number', accountName: 'Account Name', uploadReceipt: 'Upload Receipt', transRef: 'Transaction Reference', submit: 'Submit for Review', pending: 'Pending', confirmed: 'Confirmed', failed: 'Failed', instructions: 'Instructions' },
    dashboard: { seller: 'Seller Dashboard', products: 'My Products', orders: 'Incoming Orders', revenue: 'Revenue', addProduct: 'Add New Product' },
    admin: { title: 'Admin Panel', users: 'Users', pendingPayments: 'Pending Payments', disputes: 'Disputes', confirm: 'Confirm', reject: 'Reject', resolve: 'Resolve', totalRevenue: 'Total Commission' },
    common: { search: 'Search...', filter: 'Filter', all: 'All', loading: 'Loading...', error: 'An error occurred', success: 'Operation successful', cancel: 'Cancel', save: 'Save', edit: 'Edit', delete: 'Delete', back: 'Back', noResults: 'No results found', SDG: 'SDG', rating: 'Rating', review: 'Write a Review', viewAll: 'View All', currency: 'Sudanese Pound', escrowInfo: 'Your money is protected - funds will only be released to the seller after you confirm receipt.' },
    status: { pending: 'Pending', paid: 'Paid', delivered: 'Delivered', completed: 'Completed', disputed: 'Disputed', refunded: 'Refunded' },
  }
};

i18n.use(initReactI18next).init({
  resources: { ar, en },
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});

export default i18n;
