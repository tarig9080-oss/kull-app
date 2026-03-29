import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Tag } from 'lucide-react';
import { Product } from '@kull/shared';
import { WARRANTY_OPTIONS } from '@kull/shared';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const warranty = WARRANTY_OPTIONS.find(w => w.value === product.warrantyDays);
  const warrantyLabel = warranty ? (isAr ? warranty.labelAr : warranty.labelEn) : '';

  return (
    <Link to={`/products/${product.id}`} className="card block hover:scale-[1.01] transition-transform duration-200">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={40} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">{product.price.toLocaleString()} {t('common.SDG')}</span>
          {product.warrantyDays !== 0 && (
            <span className="badge bg-green-100 text-green-700"><Shield size={12} />{warrantyLabel}</span>
          )}
        </div>
        {product.seller && <p className="text-xs text-gray-400 mt-2">{product.seller.name}</p>}
      </div>
    </Link>
  );
}
