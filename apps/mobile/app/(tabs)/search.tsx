import { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function SearchScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const doSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/products', { params: { search } });
      setProducts(res.data.data.products);
    } catch { } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          value={search} onChangeText={setSearch}
          placeholder="ابحث عن أي منتج..."
          style={styles.input} returnKeyType="search"
          onSubmitEditing={doSearch}
        />
        <TouchableOpacity onPress={doSearch} style={styles.btn}>
          <Text style={styles.btnText}>بحث</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/products/${item.id}`)} style={styles.item}>
            {item.images?.[0]
              ? <Image source={{ uri: `http://localhost:3001${item.images[0]}` }} style={styles.thumb} />
              : <View style={[styles.thumb, { backgroundColor: '#f3f4f6' }]} />}
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>{item.price?.toLocaleString()} ج.س</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchBar: { flexDirection: 'row', gap: 8, padding: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  input: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, textAlign: 'right' },
  btn: { backgroundColor: '#ea580c', paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  item: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  thumb: { width: 80, height: 80 },
  title: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'right' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#ea580c', textAlign: 'right', marginTop: 4 },
});
