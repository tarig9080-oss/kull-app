import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const login = async () => {
    if (!email || !password) return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      await setAuth(res.data.data.user, res.data.data.token);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('خطأ', e.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logo}><Text style={styles.logoText}>ك</Text></View>
      <Text style={styles.title}>تسجيل الدخول</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} textAlign="right" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>كلمة المرور</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} textAlign="right" />
        </View>
        <TouchableOpacity onPress={login} disabled={loading} style={[styles.btn, loading && { opacity: 0.6 }]}>
          <Text style={styles.btnText}>{loading ? 'جاري الدخول...' : 'دخول'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.link}>
          <Text style={styles.linkText}>ليس لديك حساب؟ إنشاء حساب جديد</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f9fafb' },
  logo: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#ea580c', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#ea580c', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  logoText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 28 },
  form: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 22, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'right', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#ea580c', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#ea580c', fontSize: 14, fontWeight: '500' },
});
