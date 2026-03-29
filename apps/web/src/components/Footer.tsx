import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-2xl font-bold text-white mb-2">كُـل</div>
        <p className="text-sm">{t('app.tagline')} — {t('app.description')}</p>
        <p className="text-xs mt-4 text-gray-600">© 2026 كُـل. جميع الحقوق محفوظة | السودان</p>
      </div>
    </footer>
  );
}
