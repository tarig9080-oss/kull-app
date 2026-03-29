import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, PlusCircle, User, LogOut, Shield, Package, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import i18n from '../i18n';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const toggleLang = () => { const l = i18n.language === 'ar' ? 'en' : 'ar'; i18n.changeLanguage(l); document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = l; };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">ك</div>
            <span className="text-xl font-bold text-gray-900">{t('app.name')}</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium">{t('nav.home')}</Link>
            {user && (
              <>
                <Link to="/products/new" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"><PlusCircle size={15} />{t('nav.sell')}</Link>
                {user.role === 'seller' && <Link to="/dashboard/seller" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium">{t('nav.dashboard')}</Link>}
                <Link to="/dashboard/buyer" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"><Package size={15} />{t('nav.orders')}</Link>
                {user.role === 'admin' && <Link to="/admin" className="px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"><Shield size={15} />{t('nav.admin')}</Link>}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">{i18n.language === 'ar' ? 'EN' : 'ع'}</button>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={18} /></button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/auth/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium px-3 py-1.5">{t('nav.login')}</Link>
                <Link to="/auth/register" className="btn-primary text-sm py-1.5 px-4">{t('nav.register')}</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">{t('nav.home')}</Link>
            {user ? (
              <>
                <Link to="/products/new" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">{t('nav.sell')}</Link>
                <Link to="/dashboard/buyer" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">{t('nav.orders')}</Link>
                {user.role === 'seller' && <Link to="/dashboard/seller" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">{t('nav.dashboard')}</Link>}
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-lg text-sm">{t('nav.admin')}</Link>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-right px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">{t('nav.login')}</Link>
                <Link to="/auth/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium">{t('nav.register')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
