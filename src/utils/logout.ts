import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função de logout aprimorada
export const logout = async (navigation: NavigationProp<RootStackParamList>) => {
  try {
    // Mostra um carregamento enquanto o logout está sendo realizado
    Alert.alert('Aguarde', 'Saindo...', [{ text: 'OK' }]);

    // Removendo o token de AsyncStorage
    await AsyncStorage.removeItem('token');

    // Exibe uma mensagem de sucesso ao realizar o logout
    Alert.alert('Logout realizado', 'Você foi desconectado com sucesso.');

    // Aqui você pode redirecionar o usuário para a tela de login
    navigation.navigate('Login'); // Redireciona para a tela de login

  } catch (error) {
    // Em caso de erro, mostramos um alerta
    console.error('Erro ao fazer logout:', error);
    Alert.alert('Erro', 'Houve um problema ao tentar sair.');
  }
};
