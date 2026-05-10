// Main App Component - Temo Thuo Market
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { WalletProvider } from './src/contexts/WalletContext';
import { AuthNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WalletProvider>
                <NavigationContainer>
                  <StatusBar style="dark" backgroundColor={COLORS.background} />
                  <AuthNavigator />
                </NavigationContainer>
              </WalletProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
