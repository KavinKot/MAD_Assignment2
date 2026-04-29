import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryScreen from './src/screens/CategoryScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Categories">
        <Stack.Screen name="Categories" component={CategoryScreen} options={{ title: 'Store Categories' }} />
        <Stack.Screen name="ProductList" component={ListScreen} options={{ title: 'Products' }} />
        <Stack.Screen name="ProductDetail" component={DetailScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}