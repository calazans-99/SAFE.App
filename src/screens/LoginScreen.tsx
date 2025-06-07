import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const scheme = useColorScheme(); 
  const currentTheme = theme.colors[scheme ?? 'light'];  

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {

        navigation.replace('Tabs');
      }
    };
    checkLoggedIn();
  }, []);

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      Alert.alert('Login bem-sucedido');
      navigation.replace('Tabs');
    } catch (error) {
    
      if (error instanceof AxiosError) {

        const errorMessage = error?.response?.data?.message || 'Usuário ou senha inválidos';
        Alert.alert('Erro', errorMessage);
      } else {
   
        Alert.alert('Erro', 'Ocorreu um erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SAFE.Guard Login</Text>

      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        accessible={true}
        accessibilityLabel="Digite o seu nome de usuário"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        accessible={true}
        accessibilityLabel="Digite a sua senha"
      />

      <Pressable
        onPress={login}
        accessible={true}
        accessibilityLabel="Realizar login"
        accessibilityRole="button"
      >
        <Button title="Entrar" onPress={login} />
      </Pressable>

      {loading && <ActivityIndicator size="large" color={currentTheme.primary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.light.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: theme.spacing.small,
    marginBottom: theme.spacing.small,
    borderRadius: theme.radius.small,
  },
});
