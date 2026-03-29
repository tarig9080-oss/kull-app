import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import api from '../../lib/api';
import EscrowBadge from '../../components/EscrowBadge';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
  delivered: 'bg-indigo-100 text-indigo-700', completed: 'bg-green-100 text-green-700',
  disputed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700',
};

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/orders/my').then(r => setOrders(r.data.data)).finally(() => setLoading(false)); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('order.myOrders')}</h1>
      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}</div>
        : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag size={50} className="mx-auto mb-3 opacity-30" />
            <p>لا توجد طلبات بعد</p>
            <Link to="/" className="btn-primary mt-4 inline-block text-sm">تصفح المنتجات</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {order.product?.images?.[0] ? <img src={order.product.images[0]} alt="" className="w-14 h-14 object-cover rounded-xl" /> : <div className="w-14 h-14 bg-gray-100 rounded-xl" />}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.product?.title}</p>
                    <p className="text-primary-600 font-bold">{order.amount?.toLocaleString()} {t('common.SDG')}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{t(`status.${order.status}`)}</span>
                  <EscrowBadge status={order.escrowStatus} />
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
