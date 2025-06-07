import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation: NavigationProp<RootStackParamList>) => {
  try {
    await AsyncStorage.removeItem('token');

    Alert.alert('Logout realizado', 'Você foi desconectado com sucesso.');

    // Redefine a navegação e leva para a tela de login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    Alert.alert('Erro', 'Houve um problema ao tentar sair.');
  }
};
