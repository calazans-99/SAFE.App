import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Configurações</Text>

      <View style={styles.section}>
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

      <View style={styles.section}>
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

      <View style={styles.sectionColumn}>
        <Text style={styles.label}>🌐 Idioma</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={idioma}
            onValueChange={(itemValue: string) => {
              setIdioma(itemValue);
              salvarConfiguracoes();
            }}
          >
            <Picker.Item label="Português" value="pt" />
            <Picker.Item label="Inglês" value="en" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonLogout} onPress={confirmarLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDefault} onPress={restaurarPadroes}>
        <Text style={styles.buttonText}>Restaurar Padrões</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  sectionColumn: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonLogout: {
    backgroundColor: theme.colors.alert,
    padding: theme.spacing.medium,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  buttonDefault: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: theme.fontSizes.medium,
  },
});
