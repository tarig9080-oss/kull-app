import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Shield } from 'lucide-react-native';
import api from '../../lib/api';

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchProducts = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get('/products', { params: q ? { search: q } : {} });
      setProducts(res.data.data.products);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/products/${item.id}`)} style={styles.card}>
      <View style={styles.imageContainer}>
        {item.images?.[0]
          ? <Image source={{ uri: `http://localhost:3001${item.images[0]}` }} style={styles.image} />
          : <View style={[styles.image, styles.imagePlaceholder]} />}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardPrice}>{item.price?.toLocaleString()} ج.س</Text>
        {item.warrantyDays > 0 && (
          <View style={styles.warrantyBadge}>
            <Shield color="#16a34a" size={12} />
            <Text style={styles.warrantyText}>ضمان {item.warrantyDays} يوم</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>كُـل — السوق السوداني</Text>
        <Text style={styles.heroSub}>اشتري وبيع بأمان مع ضمان 100%</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder="ابحث عن منتج..."
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => fetchProducts(search)}
          />
          <TouchableOpacity onPress={() => fetchProducts(search)} style={styles.searchBtn}>
            <Search color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading
        ? <ActivityIndicator size="large" color="#ea580c" style={{ marginTop: 40 }} />
        : <FlatList
            data={products} renderItem={renderItem} keyExtractor={i => i.id}
            numColumns={2} columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  hero: { backgroundColor: '#ea580c', padding: 20, paddingTop: 30 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'right' },
  heroSub: { color: '#fed7aa', fontSize: 13, textAlign: 'right', marginBottom: 14 },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, textAlign: 'right' },
  searchBtn: { backgroundColor: '#c2410c', borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, width: '48%', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  imageContainer: { aspectRatio: 1 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { backgroundColor: '#f3f4f6' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 13, fontWeight: '600', color: '#111827', textAlign: 'right', marginBottom: 4 },
  cardPrice: { fontSize: 15, fontWeight: 'bold', color: '#ea580c', textAlign: 'right' },
  warrantyBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  warrantyText: { fontSize: 11, color: '#16a34a', fontWeight: '500' },
});
