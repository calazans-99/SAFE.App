import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../services/api';
import theme from '../styles/theme'; 

interface Risco {
  id: number;
  descricao: string;
  nivel: string;
  data: string;
}

const RISKS_API_URL = '/riscos'; 

export default function RiscosScreen() {
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarRiscos = async () => {
    setLoading(true); 
    try {
      const res = await api.get<Risco[]>(RISKS_API_URL); 
      setRiscos(res.data); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Erro ao carregar riscos', error.message);
      } else {
        Alert.alert('Erro ao carregar riscos', 'Erro desconhecido.');
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    carregarRiscos(); 
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Riscos Detectados</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.light.primary} />
      ) : riscos.length === 0 ? (
        <Text style={styles.empty}>Nenhum risco detectado.</Text>
      ) : (
        riscos.map(risco => (
          <View key={risco.id} style={styles.card}>
            <Text style={styles.nivel}>⚠️ Nível: {risco.nivel}</Text>
            <Text>{risco.descricao}</Text>
            <Text style={styles.data}>
              📅 {new Date(risco.data).toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.light.background,  
    flexGrow: 1,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.light.primary,  
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  card: {
    backgroundColor: theme.colors.light.white, 
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.small,
    elevation: 2,
  },
  nivel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: theme.fontSizes.medium,
  },
  data: {
    marginTop: 4,
    color: theme.colors.light.text, 
    fontSize: theme.fontSizes.small,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.light.text,  
    fontStyle: 'italic',
  },
});
