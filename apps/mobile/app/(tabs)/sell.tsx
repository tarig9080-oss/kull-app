import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

const WARRANTY_OPTIONS = [
  { value: 0, label: 'بدون ضمان' }, { value: 7, label: 'أسبوع' },
  { value: 30, label: 'شهر' }, { value: 90, label: '3 أشهر' },
  { value: 365, label: 'سنة' }, { value: -1, label: 'حسب الاتفاق' },
];

export default function SellScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [warranty, setWarranty] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.centeredText}>يجب تسجيل الدخول أولاً</Text>
      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.btn}>
        <Text style={styles.btnText}>تسجيل الدخول</Text>
      </TouchableOpacity>
    </View>
  );

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });
    if (!result.canceled) setImages(result.assets.map(a => a.uri));
  };

  const submit = async () => {
    if (!title || !desc || !price) return Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title); fd.append('description', desc);
      fd.append('price', price); fd.append('warrantyDays', warranty.toString());
      images.forEach((uri, i) => fd.append('images', { uri, type: 'image/jpeg', name: `img${i}.jpg` } as any));
      const res = await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('تم!', 'تم نشر منتجك بنجاح', [{ text: 'حسناً', onPress: () => router.push(`/products/${res.data.data.id}`) }]);
    } catch (e: any) { Alert.alert('خطأ', e.response?.data?.message || 'فشل في النشر'); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.heading}>إضافة منتج جديد</Text>

      {[
        { label: 'عنوان المنتج *', value: title, onChange: setTitle, placeholder: 'مثال: لابتوب ديل i7...' },
        { label: 'الوصف *', value: desc, onChange: setDesc, placeholder: 'وصف تفصيلي للمنتج...', multiline: true },
      ].map(({ label, value, onChange, placeholder, multiline }) => (
        <View key={label} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput value={value} onChangeText={onChange} placeholder={placeholder} style={[styles.input, multiline && { height: 90, textAlignVertical: 'top' }]} multiline={multiline} textAlign="right" />
        </View>
      ))}

      <View style={styles.field}>
        <Text style={styles.label}>السعر * (جنيه سوداني)</Text>
        <TextInput value={price} onChangeText={setPrice} placeholder="0" keyboardType="numeric" style={styles.input} textAlign="right" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>مدة الضمان</Text>
        <View style={styles.warrantyRow}>
          {WARRANTY_OPTIONS.map(opt => (
            <TouchableOpacity key={opt.value} onPress={() => setWarranty(opt.value)} style={[styles.warrantyBtn, warranty === opt.value && styles.warrantyBtnActive]}>
              <Text style={[styles.warrantyBtnText, warranty === opt.value && styles.warrantyBtnTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={pickImages} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>+ إضافة صور ({images.length})</Text>
      </TouchableOpacity>
      {images.length > 0 && (
        <View style={styles.imageRow}>
          {images.map((uri, i) => <Image key={i} source={{ uri }} style={styles.previewImage} />)}
        </View>
      )}

      <TouchableOpacity onPress={submit} disabled={loading} style={[styles.btn, loading && { opacity: 0.6 }]}>
        <Text style={styles.btnText}>{loading ? 'جاري النشر...' : 'نشر المنتج'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'right', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#fff', fontSize: 14 },
  warrantyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  warrantyBtn: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  warrantyBtnActive: { borderColor: '#ea580c', backgroundColor: '#fff7ed' },
  warrantyBtnText: { fontSize: 13, color: '#6b7280' },
  warrantyBtnTextActive: { color: '#ea580c', fontWeight: '600' },
  imagePicker: { borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 12 },
  imagePickerText: { color: '#6b7280', fontSize: 14 },
  imageRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  previewImage: { width: 70, height: 70, borderRadius: 8 },
  btn: { backgroundColor: '#ea580c', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  centeredText: { fontSize: 16, color: '#6b7280' },
});
