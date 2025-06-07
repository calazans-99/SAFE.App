import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import theme from '../styles/theme';

interface Estacao {
  id: number;
  nome: string;
  localizacao: string;
  cidade: string;
}

export default function EstacoesScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/estacoes')
      .then(response => setEstacoes(response.data))
      .catch((error) => {
        console.error('Erro ao carregar estações:', error);
        Alert.alert('Erro', 'Falha ao carregar as estações. Tente novamente mais tarde.');
      })
      .finally(() => setLoading(false)); // Garantir que o carregamento seja finalizado
  }, []);

  const renderEstacao = (estacao: Estacao) => (
    <View key={estacao.id} style={styles.card}>
      <Text style={styles.cardTitle}>{estacao.nome}</Text>
      <Text style={styles.cardInfo}>📍 Localização: {estacao.localizacao}</Text>
      <Text style={styles.cardInfo}>🏙️ Cidade: {estacao.cidade}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert(`Estação ${estacao.nome} clicada!`)}
        accessible={true}
        accessibilityLabel={`Ver detalhes da estação ${estacao.nome}`}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estações Cadastradas</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        estacoes.map(renderEstacao)
      )}
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
    marginBottom: theme.spacing.medium,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    borderRadius: theme.radius.medium,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
  },
  cardInfo: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    marginTop: theme.spacing.medium,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
