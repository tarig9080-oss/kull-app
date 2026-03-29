import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Shield, Phone } from 'lucide-react-native';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const WARRANTY_OPTIONS: Record<number, string> = { 0: 'بدون ضمان', 7: 'أسبوع', 30: 'شهر', 90: '3 أشهر', 180: '6 أشهر', 365: 'سنة', [-1]: 'حسب الاتفاق' };

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) return router.push('/auth/login');
    setBuying(true);
    try {
      const res = await api.post('/orders', { productId: id });
      router.push(`/orders/${res.data.data.id}`);
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'فشل في الشراء');
    } finally { setBuying(false); }
  };

  if (loading) return <ActivityIndicator size="large" color="#ea580c" style={{ marginTop: 60 }} />;
  if (!product) return <View style={styles.center}><Text>المنتج غير موجود</Text></View>;

  const isMine = user?.id === product.sellerId;
  const warrantyLabel = WARRANTY_OPTIONS[product.warrantyDays] || '';

  return (
    <ScrollView style={styles.container}>
      {product.images?.[0]
        ? <Image source={{ uri: `http://localhost:3001${product.images[0]}` }} style={styles.heroImage} />
        : <View style={styles.imagePlaceholder} />}

      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price?.toLocaleString()} ج.س</Text>

        {product.warrantyDays !== 0 && (
          <View style={styles.warrantyBadge}>
            <Shield color="#16a34a" size={16} />
            <Text style={styles.warrantyText}>ضمان: {warrantyLabel}</Text>
          </View>
        )}

        <View style={styles.escrowBox}>
          <Text style={styles.escrowTitle}>🔒 نظام الدفع الآمن</Text>
          <Text style={styles.escrowText}>أموالك محتجزة لدى التطبيق حتى تؤكد استلام المنتج وسلامته</Text>
        </View>

        <View style={styles.sellerCard}>
          <Text style={styles.sellerLabel}>البائع</Text>
          <Text style={styles.sellerName}>{product.seller?.name}</Text>
          {product.seller?.phone && (
            <View style={styles.phoneRow}><Phone color="#6b7280" size={14} /><Text style={styles.phoneText}>{product.seller.phone}</Text></View>
          )}
        </View>

        <Text style={styles.descLabel}>الوصف</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.commissionRow}>
          <Text style={styles.commissionText}>عمولة التطبيق: <Text style={{ color: '#ea580c' }}>1% = {(product.price * 0.01).toLocaleString()} ج.س</Text></Text>
          <Text style={styles.commissionText}>البائع يستلم: <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>{(product.price * 0.99).toLocaleString()} ج.س</Text></Text>
        </View>

        {!isMine && product.status === 'active' && (
          <TouchableOpacity onPress={handleBuy} disabled={buying} style={[styles.buyBtn, buying && { opacity: 0.6 }]}>
            <Text style={styles.buyBtnText}>{buying ? 'جاري المعالجة...' : `اشتري الآن — ${product.price?.toLocaleString()} ج.س`}</Text>
          </TouchableOpacity>
        )}
        {product.status === 'sold' && <View style={styles.soldBadge}><Text style={styles.soldText}>مُباع</Text></View>}
        {isMine && <View style={styles.mineBadge}><Text style={styles.mineText}>هذا منتجك</Text></View>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: { width: '100%', aspectRatio: 1 },
  imagePlaceholder: { width: '100%', aspectRatio: 1, backgroundColor: '#f3f4f6' },
  body: { padding: 18 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 8 },
  price: { fontSize: 26, fontWeight: 'bold', color: '#ea580c', textAlign: 'right', marginBottom: 14 },
  warrantyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 10, padding: 10, marginBottom: 12 },
  warrantyText: { color: '#16a34a', fontWeight: '600', fontSize: 14 },
  escrowBox: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 12, padding: 12, marginBottom: 14 },
  escrowTitle: { fontWeight: 'bold', color: '#92400e', marginBottom: 4, textAlign: 'right' },
  escrowText: { fontSize: 13, color: '#92400e', textAlign: 'right', lineHeight: 20 },
  sellerCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  sellerLabel: { fontSize: 12, color: '#9ca3af', textAlign: 'right' },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#111827', textAlign: 'right' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  phoneText: { color: '#6b7280', fontSize: 14 },
  descLabel: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'right', marginBottom: 6 },
  desc: { fontSize: 14, color: '#6b7280', textAlign: 'right', lineHeight: 22, marginBottom: 16 },
  commissionRow: { backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, marginBottom: 18, gap: 4 },
  commissionText: { fontSize: 13, color: '#374151', textAlign: 'right' },
  buyBtn: { backgroundColor: '#ea580c', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  soldBadge: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  soldText: { color: '#6b7280', fontWeight: '600', fontSize: 16 },
  mineBadge: { backgroundColor: '#eff6ff', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  mineText: { color: '#3b82f6', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
