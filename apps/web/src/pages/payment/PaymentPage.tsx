import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Upload, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { PAYMENT_METHODS } from '@kull/shared';

const METHOD_KEYS = ['bank_khartoum', 'fawry', 'bank_transfer'] as const;

export default function PaymentPage() {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('bank_khartoum');
  const [payment, setPayment] = useState<any>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [transRef, setTransRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => setOrder(r.data.data));
  }, [orderId]);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/initiate', { orderId, method: selectedMethod });
      setPayment(res.data.data);
    } catch (err: any) { alert(err.response?.data?.message); }
    finally { setLoading(false); }
  };

  const uploadReceipt = async () => {
    if (!receipt || !payment) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('receipt', receipt);
      if (transRef) fd.append('transactionRef', transRef);
      await api.post(`/payments/${payment.id}/upload-receipt`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (err: any) { alert(err.response?.data?.message); }
    finally { setLoading(false); }
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);
  const info = PAYMENT_METHODS[selectedMethod as keyof typeof PAYMENT_METHODS];

  if (!order) return <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" /></div>;

  if (submitted) return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال الإيصال</h2>
      <p className="text-gray-600 mb-6">سيتم مراجعة دفعتك خلال ساعات قليلة وتفعيل الطلب</p>
      <button onClick={() => navigate(`/orders/${orderId}`)} className="btn-primary">عرض تفاصيل الطلب</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('payment.title')}</h1>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-primary-700 mb-1">المنتج: <strong>{order.product?.title}</strong></p>
        <p className="text-2xl font-bold text-primary-700">{order.amount?.toLocaleString()} {t('common.SDG')}</p>
        <p className="text-xs text-primary-600 mt-1">عمولة التطبيق: {order.commission?.toLocaleString()} ج.س (1%)</p>
      </div>

      {!payment ? (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{t('payment.method')}</h2>
          <div className="space-y-2">
            {METHOD_KEYS.map(key => {
              const m = PAYMENT_METHODS[key];
              return (
                <label key={key} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedMethod === key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="method" value={key} checked={selectedMethod === key} onChange={() => setSelectedMethod(key)} className="text-primary-600" />
                  <span className="font-medium text-gray-800">{m.nameAr}</span>
                </label>
              );
            })}
          </div>
          <button onClick={initiatePayment} disabled={loading} className="btn-primary w-full">{loading ? t('common.loading') : 'متابعة'}</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">تفاصيل الدفع — {info.nameAr}</h2>
            <div className="space-y-3 text-sm">
              {'accountNumber' in info && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">{t('payment.accountNum')}: <strong>{(info as any).accountNumber}</strong></span>
                  <button onClick={() => copy((info as any).accountNumber)} className="text-primary-600 hover:text-primary-700"><Copy size={15} /></button>
                </div>
              )}
              {'walletNumber' in info && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">{t('payment.walletNum')}: <strong>{(info as any).walletNumber}</strong></span>
                  <button onClick={() => copy((info as any).walletNumber)} className="text-primary-600 hover:text-primary-700"><Copy size={15} /></button>
                </div>
              )}
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600">{t('payment.accountName')}: <strong>{info.accountName}</strong></span>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-amber-800">
                <p className="font-semibold mb-1">{t('payment.instructions')}:</p>
                <p>{info.instructions}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-gray-900">{t('payment.uploadReceipt')}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('payment.transRef')} (اختياري)</label>
              <input value={transRef} onChange={e => setTransRef(e.target.value)} className="input-field" placeholder="مرجع العملية أو رقم الإيصال" />
            </div>
            <div>
              <label className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                <Upload size={28} className="text-gray-400" />
                <span className="text-sm text-gray-500">{receipt ? receipt.name : 'اضغط لرفع صورة الإيصال'}</span>
                <input type="file" accept="image/*,application/pdf" onChange={e => setReceipt(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>
            <button onClick={uploadReceipt} disabled={loading || !receipt} className="btn-primary w-full disabled:opacity-50">
              {loading ? t('common.loading') : t('payment.submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
