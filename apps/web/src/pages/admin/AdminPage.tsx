import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Package } from 'lucide-react';
import api from '../../lib/api';

export default function AdminPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'disputes' | 'stats'>('stats');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, p, d] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/payments/pending'),
        api.get('/admin/disputes'),
      ]);
      setStats(s.data.data);
      setPendingPayments(p.data.data);
      setDisputes(d.data.data);
    } catch (err: any) { alert(err.response?.data?.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const confirmPayment = async (id: string) => {
    await api.post(`/admin/payments/${id}/confirm`);
    fetchData();
  };

  const rejectPayment = async (id: string) => {
    await api.post(`/admin/payments/${id}/reject`);
    fetchData();
  };

  const resolveDispute = async (id: string, resolution: 'buyer' | 'seller') => {
    await api.post(`/admin/disputes/${id}/resolve`, { resolution });
    fetchData();
  };

  const tabs = [
    { key: 'stats', label: 'الإحصائيات', icon: Package },
    { key: 'payments', label: `دفعات (${pendingPayments.length})`, icon: DollarSign },
    { key: 'disputes', label: `نزاعات (${disputes.length})`, icon: AlertTriangle },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg"><Users size={20} /></span>{t('admin.title')}
      </h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === key ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {loading ? <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}</div> : (
        <>
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'المستخدمون', value: stats.users, color: 'bg-blue-50 text-blue-600' },
                { label: 'المنتجات', value: stats.products, color: 'bg-purple-50 text-purple-600' },
                { label: 'الطلبات', value: stats.orders, color: 'bg-amber-50 text-amber-600' },
                { label: 'إجمالي العمولات', value: `${stats.totalRevenue?.toLocaleString()} ج.س`, color: 'bg-green-50 text-green-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`card p-5 text-center ${color}`}>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm mt-1 opacity-80">{label}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {pendingPayments.length === 0 ? <p className="text-center text-gray-400 py-10">لا توجد دفعات معلقة</p> : pendingPayments.map(p => (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{p.order?.product?.title}</p>
                      <p className="text-sm text-gray-600">المشتري: {p.order?.buyer?.name} - {p.order?.buyer?.phone}</p>
                      <p className="text-primary-600 font-bold">{p.order?.amount?.toLocaleString()} ج.س</p>
                      <p className="text-xs text-gray-500">الطريقة: {p.method?.replace('_', ' ')}</p>
                    </div>
                    {p.receiptUrl && <img src={p.receiptUrl} alt="إيصال" className="w-20 h-20 object-cover rounded-lg" />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => confirmPayment(p.id)} className="btn-primary text-sm py-1.5 flex items-center gap-1"><CheckCircle size={14} />{t('admin.confirm')}</button>
                    <button onClick={() => rejectPayment(p.id)} className="btn-danger text-sm py-1.5 flex items-center gap-1"><XCircle size={14} />{t('admin.reject')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-4">
              {disputes.length === 0 ? <p className="text-center text-gray-400 py-10">لا توجد نزاعات</p> : disputes.map(d => (
                <div key={d.id} className="card p-4 border-r-4 border-red-500">
                  <p className="font-semibold text-gray-900">{d.product?.title}</p>
                  <p className="text-sm text-gray-600">المشتري: {d.buyer?.name} | البائع: {d.product?.seller?.name}</p>
                  <p className="text-primary-600 font-bold">{d.amount?.toLocaleString()} ج.س</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => resolveDispute(d.id, 'buyer')} className="btn-secondary text-sm py-1.5">إرجاع للمشتري</button>
                    <button onClick={() => resolveDispute(d.id, 'seller')} className="btn-primary text-sm py-1.5">إطلاق للبائع</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
