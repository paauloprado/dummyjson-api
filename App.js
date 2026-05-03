import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import ProductsScreen from './src/screens/ProductsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { color: '#17202a', fontWeight: '700' },
          headerTintColor: '#17202a',
          contentStyle: { backgroundColor: '#f4f6f8' },
        }}
      >
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: 'Produtos' }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Detalhes do produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
