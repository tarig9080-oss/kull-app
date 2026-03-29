import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import EscrowBadge from '../../components/EscrowBadge';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  delivered: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  disputed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');

  const fetchOrder = () => api.get(`/orders/${id}`).then(r => setOrder(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { fetchOrder(); }, [id]);

  const confirmDelivery = async () => {
    if (!confirm('هل تؤكد استلام المنتج وسلامته؟ سيتم إطلاق المبلغ للبائع.')) return;
    setActionLoading(true);
    try { await api.post(`/orders/${id}/confirm-delivery`); fetchOrder(); }
    catch (err: any) { alert(err.response?.data?.message); }
    finally { setActionLoading(false); }
  };

  const openDispute = async () => {
    if (!confirm('هل تريد فتح نزاع؟ سيتم تجميد المبلغ حتى حل المشكلة.')) return;
    setActionLoading(true);
    try { await api.post(`/orders/${id}/dispute`); fetchOrder(); }
    catch (err: any) { alert(err.response?.data?.message); }
    finally { setActionLoading(false); }
  };

  const setDelivery = async () => {
    setActionLoading(true);
    try { await api.put(`/orders/${id}/delivery-method`, { deliveryMethod }); fetchOrder(); }
    catch (err: any) { alert(err.response?.data?.message); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" /></div>;
  if (!order) return <div className="text-center py-20">الطلب غير موجود</div>;

  const isBuyer = user?.id === order.buyerId;
  const isSeller = user?.id === order.product?.sellerId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t('order.title')}</h1>
        <div className="flex gap-2">
          <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{t(`status.${order.status}`)}</span>
          <EscrowBadge status={order.escrowStatus} />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-gray-700 mb-3">تفاصيل المنتج</h2>
        <div className="flex gap-4">
          {order.product?.images?.[0] ? <img src={order.product.images[0]} alt="" className="w-20 h-20 object-cover rounded-xl" /> : <div className="w-20 h-20 bg-gray-100 rounded-xl" />}
          <div>
            <p className="font-semibold text-gray-900">{order.product?.title}</p>
            <p className="text-primary-600 font-bold mt-1">{order.amount?.toLocaleString()} {t('common.SDG')}</p>
            <p className="text-xs text-gray-500 mt-1">عمولة التطبيق: {order.commission?.toLocaleString()} ج.س</p>
            <p className="text-xs text-green-600 mt-0.5">البائع يستلم: {order.sellerAmount?.toLocaleString()} ج.س</p>
          </div>
        </div>
      </div>

      {order.payment && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-700 mb-2">حالة الدفع</h2>
          <div className="flex items-center gap-2">
            <span className={`badge ${order.payment.status === 'confirmed' ? 'bg-green-100 text-green-700' : order.payment.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {order.payment.status === 'confirmed' ? 'مؤكد' : order.payment.status === 'failed' ? 'فشل' : 'في الانتظار'}
            </span>
            <span className="text-sm text-gray-600">{order.payment.method?.replace('_', ' ')}</span>
          </div>
          {order.payment.receiptUrl && <img src={order.payment.receiptUrl} alt="إيصال" className="mt-3 max-h-40 rounded-lg" />}
        </div>
      )}

      {order.status === 'paid' && isSeller && !order.deliveryMethod && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Truck size={18} />تحديد طريقة التوصيل</h2>
          <div className="flex gap-2">
            <input value={deliveryMethod} onChange={e => setDeliveryMethod(e.target.value)} placeholder="مثال: توصيل عبر فودافون كاش، استلام شخصي..." className="input-field flex-1" />
            <button onClick={setDelivery} disabled={actionLoading || !deliveryMethod} className="btn-primary">تأكيد</button>
          </div>
        </div>
      )}

      {order.deliveryMethod && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-indigo-700 mb-1">طريقة التوصيل المتفق عليها:</p>
          <p className="text-indigo-600">{order.deliveryMethod}</p>
        </div>
      )}

      {isBuyer && ['paid', 'delivered'].includes(order.status) && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p>بعد تأكيد الاستلام سيتم إطلاق المبلغ للبائع ولن يمكنك الرجوع.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={confirmDelivery} disabled={actionLoading} className="btn-primary flex items-center justify-center gap-2">
              <CheckCircle size={18} />تأكيد الاستلام
            </button>
            <button onClick={openDispute} disabled={actionLoading} className="btn-danger flex items-center justify-center gap-2">
              <AlertTriangle size={18} />فتح نزاع
            </button>
          </div>
        </div>
      )}

      {order.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-2" />
          <p className="font-bold text-green-700">تمت الصفقة بنجاح!</p>
          <p className="text-sm text-green-600 mt-1">تم إطلاق {order.sellerAmount?.toLocaleString()} ج.س للبائع</p>
        </div>
      )}

      {order.status === 'disputed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-2" />
          <p className="font-bold text-red-700">نزاع مفتوح</p>
          <p className="text-sm text-red-600 mt-1">سيتواصل معك فريق الدعم خلال 24 ساعة</p>
        </div>
      )}
    </div>
  );
}
