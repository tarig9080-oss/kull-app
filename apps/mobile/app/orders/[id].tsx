import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CheckCircle, AlertTriangle } from 'lucide-react-native';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'معلق', color: '#92400e', bg: '#fef3c7' },
  paid: { label: 'مدفوع', color: '#1e40af', bg: '#dbeafe' },
  delivered: { label: 'موصّل', color: '#312e81', bg: '#e0e7ff' },
  completed: { label: 'مكتمل', color: '#065f46', bg: '#d1fae5' },
  disputed: { label: 'نزاع', color: '#7f1d1d', bg: '#fee2e2' },
  refunded: { label: 'مسترد', color: '#374151', bg: '#f3f4f6' },
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState('');

  const fetchOrder = () => api.get(`/orders/${id}`).then(r => setOrder(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { fetchOrder(); }, [id]);

  const confirmDelivery = () => {
    Alert.alert('تأكيد الاستلام', 'هل تؤكد استلام المنتج وسلامته؟ سيتم إطلاق المبلغ للبائع ولا يمكن التراجع.', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد', style: 'default', onPress: async () => { await api.post(`/orders/${id}/confirm-delivery`); fetchOrder(); } },
    ]);
  };

  const openDispute = () => {
    Alert.alert('فتح نزاع', 'هل تريد فتح نزاع؟ سيتجمّد المبلغ حتى يحل فريق الدعم المشكلة.', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'فتح نزاع', style: 'destructive', onPress: async () => { await api.post(`/orders/${id}/dispute`); fetchOrder(); } },
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#ea580c" style={{ marginTop: 60 }} />;
  if (!order) return <View style={styles.center}><Text>الطلب غير موجود</Text></View>;

  const isBuyer = user?.id === order.buyerId;
  const isSeller = user?.id === order.product?.sellerId;
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.statusRow}>
        <Text style={styles.heading}>تفاصيل الطلب</Text>
        <View style={[styles.badge, { backgroundColor: s.bg }]}>
          <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.productTitle}>{order.product?.title}</Text>
        <Text style={styles.amount}>{order.amount?.toLocaleString()} ج.س</Text>
        <Text style={styles.sub}>عمولة التطبيق: {order.commission?.toLocaleString()} ج.س</Text>
        <Text style={[styles.sub, { color: '#16a34a' }]}>البائع يستلم: {order.sellerAmount?.toLocaleString()} ج.س</Text>
      </View>

      {order.payment && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>حالة الدفع</Text>
          <View style={[styles.badge, { backgroundColor: order.payment.status === 'confirmed' ? '#d1fae5' : '#fef3c7' }]}>
            <Text style={{ color: order.payment.status === 'confirmed' ? '#065f46' : '#92400e', fontWeight: '600', fontSize: 13 }}>
              {order.payment.status === 'confirmed' ? 'مؤكد' : 'في الانتظار'}
            </Text>
          </View>
        </View>
      )}

      {order.status === 'paid' && isSeller && !order.deliveryMethod && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>تحديد طريقة التوصيل</Text>
          <TextInput value={deliveryMethod} onChangeText={setDeliveryMethod} placeholder="مثال: استلام شخصي، فوري..." style={styles.input} textAlign="right" />
          <TouchableOpacity onPress={async () => { await api.put(`/orders/${id}/delivery-method`, { deliveryMethod }); fetchOrder(); }} style={styles.btn}>
            <Text style={styles.btnText}>تأكيد</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.deliveryMethod && (
        <View style={[styles.card, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
          <Text style={styles.cardLabel}>طريقة التوصيل المتفق عليها</Text>
          <Text style={{ color: '#1e40af', textAlign: 'right', marginTop: 4 }}>{order.deliveryMethod}</Text>
        </View>
      )}

      {isBuyer && ['paid', 'delivered'].includes(order.status) && (
        <View style={{ gap: 10, marginTop: 8 }}>
          <View style={[styles.card, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
            <Text style={{ color: '#92400e', fontSize: 13, textAlign: 'right' }}>بعد تأكيد الاستلام سيُطلق المبلغ للبائع ولا يمكن التراجع.</Text>
          </View>
          <TouchableOpacity onPress={confirmDelivery} style={styles.confirmBtn}>
            <CheckCircle color="#fff" size={18} />
            <Text style={styles.btnText}>تأكيد استلام المنتج</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openDispute} style={styles.disputeBtn}>
            <AlertTriangle color="#fff" size={18} />
            <Text style={styles.btnText}>فتح نزاع</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'completed' && (
        <View style={[styles.card, { backgroundColor: '#d1fae5', borderColor: '#6ee7b7', alignItems: 'center' }]}>
          <CheckCircle color="#16a34a" size={40} />
          <Text style={{ fontWeight: 'bold', color: '#065f46', fontSize: 16, marginTop: 8 }}>تمت الصفقة بنجاح!</Text>
          <Text style={{ color: '#047857', marginTop: 4, fontSize: 13 }}>تم إطلاق {order.sellerAmount?.toLocaleString()} ج.س للبائع</Text>
        </View>
      )}

      {order.status === 'disputed' && (
        <View style={[styles.card, { backgroundColor: '#fee2e2', borderColor: '#fca5a5', alignItems: 'center' }]}>
          <AlertTriangle color="#ef4444" size={40} />
          <Text style={{ fontWeight: 'bold', color: '#7f1d1d', fontSize: 16, marginTop: 8 }}>نزاع مفتوح</Text>
          <Text style={{ color: '#991b1b', marginTop: 4, fontSize: 13 }}>سيتواصل معك فريق الدعم خلال 24 ساعة</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 8 },
  amount: { fontSize: 22, fontWeight: 'bold', color: '#ea580c', textAlign: 'right' },
  sub: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 3 },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#374151', textAlign: 'right', marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, marginBottom: 10 },
  btn: { backgroundColor: '#ea580c', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  confirmBtn: { backgroundColor: '#16a34a', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  disputeBtn: { backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
