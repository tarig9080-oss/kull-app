import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingBag, Shield, Zap, Smartphone, Download, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import StateFilter from '../components/StateFilter';
import { Product } from '@kull/shared';

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedState, setSelectedState] = useState('');

  const fetchProducts = async (q = '', state = '') => {
    setLoading(true);
    try {
      const params: any = {};
      if (q) params.search = q;
      if (state) params.state = state;
      const res = await api.get('/products', { params });
      setProducts(res.data.data.products);
      setTotal(res.data.data.total);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProducts(search, selectedState); };
  const handleStateChange = (state: string) => { setSelectedState(state); fetchProducts(search, state); };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('app.tagline')}</h1>
          <p className="text-primary-100 text-lg mb-8">{t('app.description')}</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search')} className="input-field pr-10 text-gray-900" />
            </div>
            <button type="submit" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">{t('common.search')}</button>
          </form>
          <div className="flex justify-center gap-6 mt-8 text-sm text-primary-200">
            <span className="flex items-center gap-1"><Shield size={16} /> دفع آمن مع ضمان</span>
            <span className="flex items-center gap-1"><Zap size={16} /> عمولة 1% فقط</span>
            <span className="flex items-center gap-1"><ShoppingBag size={16} /> آلاف المنتجات</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">
              أحدث المنتجات <span className="text-sm font-normal text-gray-500">({total})</span>
            </h2>
            <StateFilter value={selectedState} onChange={handleStateChange} />
          </div>
          <Link to="/products/new" className="btn-primary text-sm py-2 px-4">+ أضف منتجك</Link>
        </div>

        {selectedState && (
          <div className="mb-4 flex items-center gap-2 text-sm text-primary-700 bg-primary-50 rounded-xl px-4 py-2.5 border border-primary-100 w-fit">
            <span>📍 عرض المنتجات في: <strong>{selectedState}</strong></span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag size={60} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">لماذا كُـل؟</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'نظام الضمان الآمن', desc: 'أموالك محتجزة لدى التطبيق حتى تتأكد من استلام المنتج بسلامة', color: 'text-green-600 bg-green-100' },
              { icon: Zap, title: 'عمولة منخفضة 1%', desc: 'نأخذ 1% فقط من كل صفقة ناجحة لضمان استمرارية الخدمة', color: 'text-primary-600 bg-primary-100' },
              { icon: ShoppingBag, title: 'دفع بنكي سوداني', desc: 'ندعم بنك الخرطوم، فوري، والتحويل البنكي العادي', color: 'text-amber-600 bg-amber-100' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}><Icon size={28} /></div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text & Buttons */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Smartphone size={24} className="text-primary-400" />
                <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">تطبيق كُـل</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
                حمّل التطبيق على<br />
                <span className="text-primary-400">هاتفك الآن</span>
              </h2>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                تجربة تسوق أسرع وأسهل من هاتفك. اشتري وبيع في أي وقت ومن أي مكان في السودان.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=sd.kull.app"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-gray-900 rounded-2xl px-5 py-3.5 hover:bg-gray-100 transition-colors group"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
                    <path d="M3.18 23.76a2 2 0 0 0 2.09-.22l.09-.06 11.71-6.76-.04-.04-3.84-3.84L3.18 23.76z" fill="#EA4335"/>
                    <path d="M20.7 10.17l-2.5-1.45-4.33 4.33 4.34 4.34 2.48-1.43a2.03 2.03 0 0 0 0-3.52l-.0-.27z" fill="#FBBC04"/>
                    <path d="M3.18.24C2.83.43 2.6.83 2.6 1.33v21.34c0 .5.23.9.58 1.09l.09.05 11.96-11.96L3.18.24z" fill="#4285F4"/>
                    <path d="M13.19 12l3.99-3.99L5.36.47 5.27.41A2 2 0 0 0 3.18.24L13.19 12z" fill="#34A853"/>
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500 leading-none mb-0.5">تحميل من</div>
                    <div className="font-bold text-sm leading-none">Google Play</div>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="https://apps.apple.com/app/kull/id0000000000"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-gray-900 rounded-2xl px-5 py-3.5 hover:bg-gray-100 transition-colors group"
                >
                  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-xs text-gray-500 leading-none mb-0.5">تحميل من</div>
                    <div className="font-bold text-sm leading-none">App Store</div>
                  </div>
                </a>
              </div>

              {/* Direct APK */}
              <div className="mt-4">
                <a
                  href="/kull-app.apk"
                  download
                  className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                >
                  <Download size={15} />
                  تحميل APK مباشرة لأجهزة Android
                </a>
              </div>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <QrCode size={18} className="text-primary-600" />
                  <span className="text-gray-700 text-sm font-semibold">امسح للتحميل</span>
                </div>
                {/* QR Code SVG - links to Expo / App Store */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=exp%3A%2F%2F172.21.224.1%3A8081&color=ea580c&bgcolor=ffffff&margin=1"
                  alt="QR Code كُـل"
                  className="w-48 h-48 rounded-xl"
                  onError={(e) => {
                    // Fallback to local QR if no internet
                    (e.target as HTMLImageElement).src = '/qr-kull.png';
                  }}
                />
                <p className="text-center text-xs text-gray-400 mt-3">exp://172.21.224.1:8081</p>
              </div>
              <div className="text-center text-gray-400 text-sm space-y-1">
                <p className="flex items-center gap-1 justify-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  امسح الكود بتطبيق <strong className="text-white">Expo Go</strong>
                </p>
                <p>أو كاميرا الآيفون مباشرة</p>
              </div>
            </div>
          </div>

          {/* App features row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-10 border-t border-gray-700">
            {[
              { emoji: '🔒', label: 'دفع آمن' },
              { emoji: '📦', label: 'ضمان المنتج' },
              { emoji: '💰', label: 'عمولة 1% فقط' },
              { emoji: '🇸🇩', label: 'مخصص للسودان' },
            ].map(({ emoji, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-sm text-gray-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
