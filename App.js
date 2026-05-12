import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your existing screens
import CategoryScreen from './src/screens/CategoryScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
// 1. Import your new CartScreen
import CartScreen from './src/screens/CartScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Your Milestone 1 Shop flow
function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={CategoryScreen} />
      <Stack.Screen name="ProductList" component={ListScreen} />
      <Stack.Screen name="ProductDetail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

// 2. Extract the Tabs into a separate component so it can access Redux
function MainTabs() {
  // Read the cart items to calculate the badge number
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Shop' ? 'basket' : 'cart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Shop" 
        component={ShopStack} 
        options={{ headerShown: false }} 
      />
      
      {/* 3. Your real Cart Screen with the dynamic badge */}
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          // Show the badge only if there are items, otherwise show nothing (null)
          tabBarBadge: totalQuantity > 0 ? totalQuantity : null,
        }}
      />
    </Tab.Navigator>
  );
}

// The Root App wraps everything in the Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </Provider>
  );
}