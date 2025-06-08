import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import theme from '../styles/theme';
import { RootStackParamList } from '../navigation/navigationTypes';

export default function InstrucoesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const Secao = ({
    icon,
    label,
    description,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color={theme.colors.alert} />
        <Text style={styles.sectionTitle}> {label}</Text>
      </View>
      <Text style={styles.text}>{description}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📖 Instruções de Uso</Text>

      <Secao
        icon="map-outline"
        label="Mapa"
        description="Acesse o mapa para visualizar as estações e riscos em tempo real."
      />
      <Secao
        icon="stats-chart-outline"
        label="Leituras"
        description="Veja as leituras dos sensores, como temperatura, umidade e pressão."
      />
      <Secao
        icon="warning-outline"
        label="Alertas"
        description="Cadastre, atualize ou exclua alertas de risco identificados."
      />
      <Secao
        icon="pulse-outline"
        label="Riscos"
        description="Acompanhe os níveis de risco por região e data."
      />
      <Secao
        icon="location-outline"
        label="Estações"
        description="Consulte as estações cadastradas e sua localização."
      />
      <Secao
        icon="settings-outline"
        label="Configurações"
        description="Ajuste notificações e preferências do aplicativo."
      />

      <View style={styles.logout}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          accessibilityLabel="Sair do aplicativo"
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
  section: {
    marginBottom: theme.spacing.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
    color: theme.colors.alert,
  },
  text: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
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
