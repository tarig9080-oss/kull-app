import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Upload, AlertCircle, MapPin } from 'lucide-react';
import api from '../../lib/api';
import { WARRANTY_OPTIONS } from '@kull/shared';
import { SUDAN_STATES } from '../../lib/sudanStates';

export default function AddProductPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { register, handleSubmit } = useForm({ defaultValues: { warrantyDays: '0' } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('description', data.description);
      fd.append('price', data.price);
      fd.append('warrantyDays', data.warrantyDays);
      fd.append('state', data.state || '');
      images.forEach(img => fd.append('images', img));
      const res = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/products/${res.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('product.add')}</h1>
      <div className="card p-6">
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 mb-4 flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.title')} *</label>
            <input {...register('title')} className="input-field" required minLength={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.description')} *</label>
            <textarea {...register('description')} className="input-field min-h-[100px] resize-none" required minLength={10} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.price')} * <span className="text-red-500 text-xs">(إلزامي)</span></label>
            <div className="relative">
              <input {...register('price')} type="number" min="1" step="0.01" className="input-field pl-16" required />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">{t('common.SDG')}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5"><MapPin size={14} className="inline ml-1 text-primary-500" />الولاية *</label>
            <select {...register('state')} className="input-field" required>
              <option value="">اختر الولاية</option>
              {SUDAN_STATES.map(s => (
                <option key={s.value} value={s.value}>{s.emoji} {s.value}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.warranty')}</label>
            <select {...register('warrantyDays')} className="input-field">
              {WARRANTY_OPTIONS.map(w => <option key={w.value} value={w.value}>{isAr ? w.labelAr : w.labelEn}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('product.images')} (حتى 5 صور)</label>
            <label className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload size={28} className="text-gray-400" />
              <span className="text-sm text-gray-500">اضغط لرفع الصور</span>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {previews.map((p, i) => <img key={i} src={p} alt="" className="aspect-square object-cover rounded-lg" />)}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('common.loading') : t('product.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
