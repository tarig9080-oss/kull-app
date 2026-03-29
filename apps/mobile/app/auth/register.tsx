import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const register = async () => {
    if (!name || !email || !phone || !password) return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, phone, password, role, lang: 'ar' });
      await setAuth(res.data.data.user, res.data.data.token);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'فشل في إنشاء الحساب');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logo}><Text style={styles.logoText}>ك</Text></View>
      <Text style={styles.title}>إنشاء حساب جديد</Text>

      <View style={styles.form}>
        {[
          { label: 'الاسم الكامل', value: name, onChange: setName, type: 'default' },
          { label: 'البريد الإلكتروني', value: email, onChange: setEmail, type: 'email-address' },
          { label: 'رقم الجوال', value: phone, onChange: setPhone, type: 'phone-pad' },
          { label: 'كلمة المرور', value: password, onChange: setPassword, type: 'default', secure: true },
        ].map(({ label, value, onChange, type, secure }) => (
          <View key={label} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput value={value} onChangeText={onChange} keyboardType={type as any} secureTextEntry={secure} style={styles.input} textAlign="right" autoCapitalize="none" />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>نوع الحساب</Text>
          <View style={styles.roleRow}>
            {(['buyer', 'seller'] as const).map(r => (
              <TouchableOpacity key={r} onPress={() => setRole(r)} style={[styles.roleBtn, role === r && styles.roleBtnActive]}>
                <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>{r === 'buyer' ? 'مشتري' : 'بائع'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={register} disabled={loading} style={[styles.btn, loading && { opacity: 0.6 }]}>
          <Text style={styles.btnText}>{loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.link}>
          <Text style={styles.linkText}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 40, backgroundColor: '#f9fafb' },
  logo: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#ea580c', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#ea580c', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  logoText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 22 },
  form: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'right', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, backgroundColor: '#fafafa' },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: { flex: 1, borderWidth: 1.5, borderColor: '#d1d5db', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  roleBtnActive: { borderColor: '#ea580c', backgroundColor: '#fff7ed' },
  roleBtnText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  roleBtnTextActive: { color: '#ea580c', fontWeight: 'bold' },
  btn: { backgroundColor: '#ea580c', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 14, alignItems: 'center' },
  linkText: { color: '#ea580c', fontSize: 14, fontWeight: '500' },
});
