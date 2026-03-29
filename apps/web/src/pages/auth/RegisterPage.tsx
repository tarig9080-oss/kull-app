import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm({ defaultValues: { role: 'buyer', lang: 'ar' } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/register', data);
      setAuth(res.data.data.user, res.data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">ك</div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.registerBtn')}</h1>
          </div>
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl p-3 mb-4 border border-red-200">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.name')}</label>
              <input {...register('name')} className="input-field" required minLength={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.email')}</label>
              <input {...register('email')} type="email" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.phone')}</label>
              <input {...register('phone')} type="tel" className="input-field" placeholder="09XXXXXXXX" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.password')}</label>
              <input {...register('password')} type="password" className="input-field" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.role')}</label>
              <select {...register('role')} className="input-field">
                <option value="buyer">{t('auth.buyer')}</option>
                <option value="seller">{t('auth.seller')}</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : t('auth.registerBtn')}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">{t('auth.haveAccount')} <Link to="/auth/login" className="text-primary-600 font-semibold hover:underline">{t('auth.loginBtn')}</Link></p>
        </div>
      </div>
    </div>
  );
}
