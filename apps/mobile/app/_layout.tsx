import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => { init(); }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#ea580c' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: 'تسجيل الدخول' }} />
        <Stack.Screen name="auth/register" options={{ title: 'إنشاء حساب' }} />
        <Stack.Screen name="products/[id]" options={{ title: 'تفاصيل المنتج' }} />
        <Stack.Screen name="products/new" options={{ title: 'إضافة منتج' }} />
        <Stack.Screen name="orders/[id]" options={{ title: 'تفاصيل الطلب' }} />
      </Stack>
    </>
  );
}
