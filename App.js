import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AuthScreen from './src/screens/AuthScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={CategoryScreen} />
      <Stack.Screen name="ProductList" component={ListScreen} />
      <Stack.Screen name="ProductDetail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help-circle';
          
          if (route.name === 'Shop') iconName = 'basket';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'My Orders') iconName = 'list';
          else if (route.name === 'User Profile') iconName = 'person';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Shop" component={ShopStack} options={{ headerShown: false }} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ tabBarBadge: totalQuantity > 0 ? totalQuantity : null }}
      />
      <Tab.Screen 
        name="My Orders" 
        component={OrdersScreen} 
      />
      <Tab.Screen 
        name="User Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}