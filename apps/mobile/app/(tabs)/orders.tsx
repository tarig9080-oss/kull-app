import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'معلق', color: '#92400e', bg: '#fef3c7' },
  paid: { label: 'مدفوع', color: '#1e40af', bg: '#dbeafe' },
  delivered: { label: 'موصّل', color: '#312e81', bg: '#e0e7ff' },
  completed: { label: 'مكتمل', color: '#065f46', bg: '#d1fae5' },
  disputed: { label: 'نزاع', color: '#7f1d1d', bg: '#fee2e2' },
  refunded: { label: 'مسترد', color: '#374151', bg: '#f3f4f6' },
};

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) api.get('/orders/my').then(r => setOrders(r.data.data)).finally(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.centeredText}>يجب تسجيل الدخول لعرض طلباتك</Text>
      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.btn}>
        <Text style={styles.btnText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#ea580c" style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={<View style={styles.center}><Text style={styles.centeredText}>لا توجد طلبات بعد</Text></View>}
        renderItem={({ item }) => {
          const s = STATUS_LABELS[item.status] || STATUS_LABELS.pending;
          return (
            <TouchableOpacity onPress={() => router.push(`/orders/${item.id}`)} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productTitle} numberOfLines={1}>{item.product?.title}</Text>
                <Text style={styles.price}>{item.amount?.toLocaleString()} ج.س</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: s.bg }]}>
                <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  productTitle: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'right' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#ea580c', textAlign: 'right', marginTop: 3 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 14 },
  centeredText: { fontSize: 15, color: '#6b7280' },
  btn: { backgroundColor: '#ea580c', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
});
