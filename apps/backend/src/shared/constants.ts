export const COMMISSION_RATE = 0.01; // 1%

export const WARRANTY_OPTIONS = [
  { value: 0, labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
  { value: 7, labelAr: 'أسبوع', labelEn: '1 Week' },
  { value: 30, labelAr: 'شهر', labelEn: '1 Month' },
  { value: 90, labelAr: '3 أشهر', labelEn: '3 Months' },
  { value: 180, labelAr: '6 أشهر', labelEn: '6 Months' },
  { value: 365, labelAr: 'سنة', labelEn: '1 Year' },
  { value: -1, labelAr: 'حسب الاتفاق', labelEn: 'By Agreement' },
];

export const PAYMENT_METHODS = {
  bank_khartoum: {
    nameAr: 'بنك الخرطوم',
    nameEn: 'Bank of Khartoum',
    accountNumber: 'SD29 6000 0001 2345 6789 01',
    accountName: 'تطبيق كُـل للتجارة',
    instructions: 'قم بالتحويل إلى الحساب أعلاه وارفع إيصال الدفع',
  },
  fawry: {
    nameAr: 'فوري / موبايل كاش',
    nameEn: 'Fawry / Mobile Cash',
    walletNumber: '0912345678',
    accountName: 'كُـل ماركت',
    instructions: 'أرسل المبلغ على الرقم أعلاه وارفع الإيصال',
  },
  bank_transfer: {
    nameAr: 'تحويل بنكي عادي',
    nameEn: 'Bank Transfer',
    accountNumber: '1234567890',
    bankName: 'بنك السودان المركزي',
    accountName: 'شركة كُـل للتجارة الإلكترونية',
    instructions: 'قم بالتحويل البنكي وأرسل مرجع العملية',
  },
};
