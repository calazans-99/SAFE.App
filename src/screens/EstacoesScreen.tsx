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
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarEstacoes = async () => {
    setLoading(true);
    try {
      const res = await api.get<Estacao[]>('/estacoes');
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

  const salvarOuAtualizar = async () => {
    if (!nome || !localizacao || !cidade || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const dados = {
      nome,
      localizacao,
      cidade,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    setSalvando(true);
    try {
      if (editandoId !== null) {
        await api.put(`/estacoes/${editandoId}`, dados);
      } else {
        await api.post('/estacoes', dados);
      }

      setNome('');
      setLocalizacao('');
      setCidade('');
      setLatitude('');
      setLongitude('');
      setEditandoId(null);
      carregarEstacoes();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar estação.');
    } finally {
      setSalvando(false);
    }
  };

  const editarEstacao = (e: Estacao) => {
    setEditandoId(e.id);
    setNome(e.nome);
    setLocalizacao(e.localizacao);
    setCidade(e.cidade);
    setLatitude(e.latitude.toString());
    setLongitude(e.longitude.toString());
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
            Alert.alert('Erro', 'Falha ao excluir estação.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerenciar Estações</Text>

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
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <Button
        title={editandoId ? 'Atualizar Estação' : 'Cadastrar Estação'}
        onPress={salvarOuAtualizar}
      />

      {salvando && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        estacoes.map((e) => (
          <View key={e.id} style={styles.card}>
            <Text style={styles.cardTitle}>{e.nome}</Text>
            <Text style={styles.cardInfo}>📍 {e.localizacao} - {e.cidade}</Text>
            <Text style={styles.cardInfo}>🌐 {e.latitude}, {e.longitude}</Text>
            <Button title="Editar" onPress={() => editarEstacao(e)} />
            <Button title="Excluir" onPress={() => excluirEstacao(e.id)} />
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
});
