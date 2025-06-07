import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';

export default function ConfigScreen() {
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

  const handleSaveSettings = async () => {
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Configurações</Text>

      <View style={styles.option}>
        <Text style={styles.label}>🔔 Notificações</Text>
        <Switch
          value={notificacoes}
          onValueChange={(value) => {
            setNotificacoes(value);
            handleSaveSettings(); 
          }}
          trackColor={{ true: theme.colors.primary }}
          accessible={true}
          accessibilityLabel="Ativar/desativar notificações"
          accessibilityRole="switch"
          accessibilityState={{ checked: notificacoes }}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>🌙 Modo Escuro</Text>
        <Switch
          value={modoEscuro}
          onValueChange={(value) => {
            setModoEscuro(value);
            handleSaveSettings();
          }}
          trackColor={{ true: theme.colors.primary }}
          accessible={true}
          accessibilityLabel="Ativar/desativar modo escuro"
          accessibilityRole="switch"
          accessibilityState={{ checked: modoEscuro }}
        />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>🌐 Idioma</Text>
        <Picker
          selectedValue={idioma}
          onValueChange={(itemValue: string) => {
            setIdioma(itemValue);
            handleSaveSettings();
          }}
          style={styles.picker}
          accessible={true}
          accessibilityLabel="Selecione o idioma"
          accessibilityRole="combobox"
          accessibilityValue={{ text: idioma }} 
        >
          <Picker.Item label="Português" value="pt" />
          <Picker.Item label="Inglês" value="en" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : null}
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
    backgroundColor: '#fff',
    marginTop: theme.spacing.small,
    borderRadius: 8,
  },
});
