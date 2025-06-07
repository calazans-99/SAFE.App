import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';

export default function InstrucoesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Instruções de Uso</Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="map-outline" size={20} color={theme.colors.alert} /> 📍 Mapa
      </Text>
      <Text style={styles.text}>
        Acesse o mapa para visualizar as estações e riscos em tempo real.
      </Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="stats-chart-outline" size={20} color={theme.colors.alert} /> 📡 Leituras
      </Text>
      <Text style={styles.text}>
        Veja as leituras dos sensores, como temperatura, umidade e pressão.
      </Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="warning-outline" size={20} color={theme.colors.alert} /> ⚠️ Alertas
      </Text>
      <Text style={styles.text}>
        Cadastre, atualize ou exclua alertas de risco identificados.
      </Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="pulse-outline" size={20} color={theme.colors.alert} /> 📊 Riscos
      </Text>
      <Text style={styles.text}>
        Acompanhe os níveis de risco por região e data.
      </Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="location-outline" size={20} color={theme.colors.alert} /> 📍 Estações
      </Text>
      <Text style={styles.text}>
        Consulte as estações cadastradas e sua localização.
      </Text>

      <Text style={styles.sectionTitle}>
        <Ionicons name="settings-outline" size={20} color={theme.colors.alert} /> 🛠️ Configurações
      </Text>
      <Text style={styles.text}>
        Ajuste notificações e preferências do aplicativo.
      </Text>

      <View style={styles.logout}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          accessible={true}
          accessibilityLabel="Sair e voltar para a tela de login"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>SAFE.Guard - Prever para proteger.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    color: theme.colors.alert,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  logout: {
    marginTop: theme.spacing.large,
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: theme.spacing.large,
    textAlign: 'center',
    fontStyle: 'italic',
    color: theme.colors.secondary,
  },
});
