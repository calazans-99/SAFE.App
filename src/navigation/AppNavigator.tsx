// src/navigation/AppNavigator.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import api from '../services/api';
import Tabs from '../navigation/Tabs';
import LoginScreen from '../screens/LoginScreen';
import { RootStackParamList } from '../navigation/navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [logado, setLogado] = useState<boolean | null>(null);

  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return setLogado(false);

      try {
        await api.get('/alertas');
        setLogado(true);
      } catch {
        await AsyncStorage.removeItem('token');
        setLogado(false);
      }
    };

    verificarToken();
  }, []);

  if (logado === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {logado ? (
          <Stack.Screen name="Tabs" component={Tabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
