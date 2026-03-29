import { Tabs } from 'expo-router';
import { Home, Search, PlusCircle, ShoppingBag, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#ea580c',
      tabBarInactiveTintColor: '#9ca3af',
      tabBarStyle: { borderTopColor: '#f3f4f6', paddingBottom: 5 },
      headerStyle: { backgroundColor: '#ea580c' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name="index" options={{ title: 'الرئيسية', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: 'بحث', tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }} />
      <Tabs.Screen name="sell" options={{ title: 'بيع', tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'طلباتي', tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'حسابي', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
