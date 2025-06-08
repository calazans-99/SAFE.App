import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../services/api';
import theme from '../styles/theme';

interface Estacao {
  id: number;
  nome: string;
  localizacao: string;
  cidade: string;
  latitude: number;
  longitude: number;
}

export default function EstacoesScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [filtroCidade, setFiltroCidade] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarEstacoes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/estacoes');
      setEstacoes(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar estações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstacoes();
  }, []);

  const salvarOuAtualizarEstacao = async () => {
    if (!nome || !localizacao || !cidade || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const estacao = {
      nome,
      localizacao,
      cidade,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    setSalvando(true);
    try {
      if (editandoId !== null) {
        await api.put(`/estacoes/${editandoId}`, estacao);
      } else {
        await api.post('/estacoes', estacao);
      }

      limparFormulario();
      carregarEstacoes();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar estação');
    } finally {
      setSalvando(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setLocalizacao('');
    setCidade('');
    setLatitude('');
    setLongitude('');
    setEditandoId(null);
  };

  const editarEstacao = (est: Estacao) => {
    setNome(est.nome);
    setLocalizacao(est.localizacao);
    setCidade(est.cidade);
    setLatitude(est.latitude.toString());
    setLongitude(est.longitude.toString());
    setEditandoId(est.id);
  };

  const excluirEstacao = (id: number) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir esta estação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/estacoes/${id}`);
            carregarEstacoes();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir estação');
          }
        },
      },
    ]);
  };

  const estacoesFiltradas = estacoes.filter((e) =>
    e.cidade.toLowerCase().includes(filtroCidade.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerenciar Estações</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Filtrar por cidade"
        value={filtroCidade}
        onChangeText={setFiltroCidade}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        keyboardType="numeric"
        value={latitude}
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        keyboardType="numeric"
        value={longitude}
        onChangeText={setLongitude}
      />

      <Button
        title={editandoId ? 'Atualizar Estação' : 'Cadastrar Estação'}
        onPress={salvarOuAtualizarEstacao}
      />

      {salvando && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : estacoesFiltradas.length === 0 ? (
        <Text style={styles.empty}>Nenhuma estação encontrada.</Text>
      ) : (
        estacoesFiltradas.map((estacao) => (
          <View key={estacao.id} style={styles.card}>
            <Text style={styles.cardTitle}>{estacao.nome}</Text>
            <Text style={styles.cardInfo}>📍 Localização: {estacao.localizacao}</Text>
            <Text style={styles.cardInfo}>🏙️ Cidade: {estacao.cidade}</Text>
            <Text style={styles.cardInfo}>🧭 Lat: {estacao.latitude}</Text>
            <Text style={styles.cardInfo}>🧭 Lng: {estacao.longitude}</Text>

            <Button title="Editar" onPress={() => editarEstacao(estacao)} />
            <Button title="Excluir" onPress={() => excluirEstacao(estacao.id)} />
          </View>
        ))
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: theme.spacing.small,
    marginBottom: theme.spacing.small,
    backgroundColor: '#fff',
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
  empty: {
    textAlign: 'center',
    color: theme.colors.text,
    fontStyle: 'italic',
    marginTop: 20,
  },
});
