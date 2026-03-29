import { useTranslation } from 'react-i18next';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { EscrowStatus } from '@kull/shared';

export default function EscrowBadge({ status }: { status: EscrowStatus }) {
  const { t } = useTranslation();
  const config = {
    held: { icon: Lock, bg: 'bg-amber-100', text: 'text-amber-700', label: t('order.held') },
    released: { icon: Unlock, bg: 'bg-green-100', text: 'text-green-700', label: t('order.released') },
    refunded: { icon: RefreshCw, bg: 'bg-blue-100', text: 'text-blue-700', label: t('order.refunded') },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`badge ${config.bg} ${config.text}`}><Icon size={12} />{config.label}</span>
  );
}
