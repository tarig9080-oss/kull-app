import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Phone, Tag, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Product } from '@kull/shared';
import { WARRANTY_OPTIONS } from '@kull/shared';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) return navigate('/auth/login');
    setBuying(true);
    try {
      const res = await api.post('/orders', { productId: id });
      navigate(`/payment/${res.data.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || t('common.error'));
    } finally { setBuying(false); }
  };

  if (loading) return <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto" /></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">المنتج غير موجود</div>;

  const warranty = WARRANTY_OPTIONS.find(w => w.value === product.warrantyDays);
  const warrantyLabel = warranty ? (isAr ? warranty.labelAr : warranty.labelEn) : '';
  const isMine = user?.id === product.sellerId;
  const isAvailable = product.status === 'active';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {product.images[0] ? <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Tag size={60} className="text-gray-300" /></div>}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => <img key={i} src={img} alt="" className="aspect-square object-cover rounded-xl" />)}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <div className="text-3xl font-bold text-primary-600">{product.price.toLocaleString()} <span className="text-lg">{t('common.SDG')}</span></div>

          {product.warrantyDays !== 0 && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl p-3 text-sm">
              <Shield size={18} /><span>ضمان: {warrantyLabel}</span>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">🔒 نظام الدفع الآمن</p>
            <p>{t('common.escrowInfo')}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">{t('product.seller')}</p>
            <p className="font-semibold text-gray-900">{(product.seller as any)?.name}</p>
            {(product.seller as any)?.phone && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1"><Phone size={14} />{(product.seller as any)?.phone}</div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">الوصف</p>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>عمولة التطبيق: <strong className="text-primary-600">1%</strong> = {(product.price * 0.01).toLocaleString()} {t('common.SDG')}</span>
            <ChevronRight size={14} />
            <span>البائع يستلم: <strong className="text-green-600">{(product.price * 0.99).toLocaleString()} {t('common.SDG')}</strong></span>
          </div>

          {!isMine && isAvailable && (
            <button onClick={handleBuy} disabled={buying} className="btn-primary w-full text-lg py-3">
              {buying ? t('common.loading') : `${t('product.buy')} — ${product.price.toLocaleString()} ${t('common.SDG')}`}
            </button>
          )}
          {!isAvailable && <div className="text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">{product.status === 'sold' ? t('product.sold') : t('product.pending')}</div>}
          {isMine && <div className="text-center py-3 bg-blue-50 text-blue-600 rounded-xl text-sm">هذا منتجك</div>}
        </div>
      </div>
    </div>
  );
}
