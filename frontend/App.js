import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { POSProvider } from './src/context/POSContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <POSProvider>
          <AppNavigator />
        </POSProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
