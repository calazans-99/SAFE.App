import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.0.67:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token ao cabeçalho da requisição
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para capturar erros de autenticação (token expirado, etc.)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou não autorizado
      await AsyncStorage.removeItem('token');
      Alert.alert(
        'Sessão Expirada',
        'Sua sessão expirou. Por favor, faça login novamente.',
        [{ 
          text: 'OK', 
          onPress: () => {
          }
        }]
      );
    }
    return Promise.reject(error);
  }
);

export default api;
