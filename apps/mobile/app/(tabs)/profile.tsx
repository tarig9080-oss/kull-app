import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Phone, LogOut, Plus, Package, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('تأكيد', 'هل تريد تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: () => { logout(); router.replace('/'); } },
    ]);
  };

  if (!user) return (
    <View style={styles.center}>
      <View style={styles.avatar}><User color="#fff" size={40} /></View>
      <Text style={styles.heading}>مرحباً بك في كُـل</Text>
      <Text style={styles.sub}>سجّل دخولك للوصول إلى حسابك</Text>
      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.btn}>
        <Text style={styles.btnText}>تسجيل الدخول</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.btnSecondary}>
        <Text style={styles.btnSecondaryText}>إنشاء حساب جديد</Text>
      </TouchableOpacity>
    </View>
  );

  const menuItems = [
    { icon: Plus, label: 'إضافة منتج', onPress: () => router.push('/products/new') },
    { icon: Package, label: 'طلباتي', onPress: () => router.push('/(tabs)/orders') },
    { icon: Shield, label: 'نظام الضمان الآمن', onPress: () => Alert.alert('كيف يعمل الضمان؟', 'أموالك محتجزة لدى التطبيق حتى تؤكد استلام المنتج وسلامته. بعد التأكيد يُطلق المبلغ للبائع ناقص 1% عمولة.') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user.name[0]}</Text></View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.roleBadge}>{user.role === 'seller' ? 'بائع' : user.role === 'admin' ? 'مشرف' : 'مشتري'}</Text>
      </View>

      <View style={styles.infoCard}>
        {[{ icon: Mail, text: user.email }, { icon: Phone, text: user.phone }].map(({ icon: Icon, text }) => (
          <View key={text} style={styles.infoRow}>
            <Icon color="#6b7280" size={18} />
            <Text style={styles.infoText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuCard}>
        {menuItems.map(({ icon: Icon, label, onPress }) => (
          <TouchableOpacity key={label} onPress={onPress} style={styles.menuItem}>
            <Icon color="#ea580c" size={20} />
            <Text style={styles.menuLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <LogOut color="#ef4444" size={18} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>كُـل — السوق السوداني الأول | عمولة 1% فقط</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  header: { backgroundColor: '#ea580c', alignItems: 'center', paddingVertical: 32 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#c2410c', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  roleBadge: { color: '#fed7aa', fontSize: 13, marginTop: 4 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  sub: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  btn: { backgroundColor: '#ea580c', borderRadius: 14, paddingVertical: 13, paddingHorizontal: 40, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnSecondary: { borderWidth: 1.5, borderColor: '#ea580c', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 40 },
  btnSecondaryText: { color: '#ea580c', fontWeight: '600', fontSize: 15 },
  infoCard: { margin: 14, backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 14, color: '#374151' },
  menuCard: { marginHorizontal: 14, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  menuLabel: { fontSize: 15, color: '#111827', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 14, padding: 14, borderWidth: 1, borderColor: '#fecaca', borderRadius: 14, backgroundColor: '#fff5f5' },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 15 },
  footer: { textAlign: 'center', color: '#9ca3af', fontSize: 12, marginBottom: 30 },
});
