import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Package, TrendingUp, DollarSign } from 'lucide-react';
import api from '../../lib/api';

export default function SellerDashboard() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/seller/my'),
      api.get('/orders/seller'),
    ]).then(([p, o]) => { setProducts(p.data.data); setOrders(o.data.data); }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s: number, o: any) => s + o.sellerAmount, 0);
  const activeProducts = products.filter(p => p.status === 'active').length;
  const pendingOrders = orders.filter(o => ['pending', 'paid'].includes(o.status)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.seller')}</h1>
        <Link to="/products/new" className="btn-primary text-sm flex items-center gap-1"><PlusCircle size={16} />{t('dashboard.addProduct')}</Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: 'منتجات نشطة', value: activeProducts, color: 'text-blue-600 bg-blue-50' },
          { icon: TrendingUp, label: 'طلبات نشطة', value: pendingOrders, color: 'text-amber-600 bg-amber-50' },
          { icon: DollarSign, label: 'إجمالي الأرباح', value: `${totalRevenue.toLocaleString()} ج.س`, color: 'text-green-600 bg-green-50' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}><Icon size={20} /></div>
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}</div> : (
        <>
          <h2 className="font-bold text-gray-900 mb-3">{t('dashboard.products')}</h2>
          <div className="space-y-2 mb-8">
            {products.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="card p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-gray-100 rounded-lg" />}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                    <p className="text-primary-600 text-sm font-bold">{p.price?.toLocaleString()} ج.س</p>
                  </div>
                </div>
                <span className={`badge ${p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'sold' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status === 'active' ? 'نشط' : p.status === 'sold' ? 'مُباع' : 'معلق'}
                </span>
              </Link>
            ))}
          </div>

          <h2 className="font-bold text-gray-900 mb-3">{t('dashboard.orders')}</h2>
          <div className="space-y-2">
            {orders.map(o => (
              <Link key={o.id} to={`/orders/${o.id}`} className="card p-3 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{o.product?.title}</p>
                  <p className="text-sm text-gray-500">المشتري: {o.buyer?.name} - {o.buyer?.phone}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-green-600 text-sm">{o.sellerAmount?.toLocaleString()} ج.س</p>
                  <span className={`badge text-xs ${o.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status === 'completed' ? 'مكتمل' : 'نشط'}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
