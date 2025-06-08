import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';
import { logout } from '../utils/logout';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigationTypes';

export default function ConfigScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [idioma, setIdioma] = useState('pt');
  const [loading, setLoading] = useState(false);

  const carregarConfiguracoes = useCallback(async () => {
    try {
      const notificacoesSalvas = await AsyncStorage.getItem('notificacoes');
      const modoEscuroSalvo = await AsyncStorage.getItem('modoEscuro');
      const idiomaSalvo = await AsyncStorage.getItem('idioma');

      if (notificacoesSalvas) setNotificacoes(JSON.parse(notificacoesSalvas));
      if (modoEscuroSalvo) setModoEscuro(JSON.parse(modoEscuroSalvo));
      if (idiomaSalvo) setIdioma(idiomaSalvo);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar configurações');
    }
  }, []);

  useEffect(() => {
    carregarConfiguracoes();
  }, [carregarConfiguracoes]);

  const salvarConfiguracoes = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('notificacoes', JSON.stringify(notificacoes));
      await AsyncStorage.setItem('modoEscuro', JSON.stringify(modoEscuro));
      await AsyncStorage.setItem('idioma', idioma);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const restaurarPadroes = async () => {
    setNotificacoes(true);
    setModoEscuro(false);
    setIdioma('pt');
    await salvarConfiguracoes();
  };

  const confirmarLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(navigation),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Configurações</Text>

      <View style={styles.option}>
        <Text style={styles.label}>🔔 Notificações</Text>
        <Switch
          value={notificacoes}
          onValueChange={(value) => {
            setNotificacoes(value);
            salvarConfiguracoes();
          }}
          trackColor={{ true: theme.colors.primary }}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>🌙 Modo Escuro</Text>
        <Switch
          value={modoEscuro}
          onValueChange={(value) => {
            setModoEscuro(value);
            salvarConfiguracoes();
          }}
          trackColor={{ true: theme.colors.primary }}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>🌐 Idioma</Text>
        <Picker
          selectedValue={idioma}
          onValueChange={(itemValue: string) => {
            setIdioma(itemValue);
            salvarConfiguracoes();
          }}
          style={styles.picker}
        >
          <Picker.Item label="Português" value="pt" />
          <Picker.Item label="Inglês" value="en" />
        </Picker>
      </View>

      <View style={styles.logoutContainer}>
        <Button title="Logout" color={theme.colors.alert} onPress={confirmarLogout} />
        <View style={{ height: theme.spacing.small }} />
        <Button title="Restaurar Padrões" onPress={restaurarPadroes} />
      </View>

      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  picker: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  logoutContainer: {
    marginTop: theme.spacing.large,
  },
});
