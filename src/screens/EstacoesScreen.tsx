import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from 'react-native';
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
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [cidade, setCidade] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarEstacoes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/estacoes');
      setEstacoes(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar estações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstacoes();
  }, []);

  const salvarOuAtualizarEstacao = async () => {
    if (!nome || !localizacao || !cidade) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setSalvando(true);
    try {
      if (editandoId !== null) {
        await api.put(`/estacoes/${editandoId}`, { nome, localizacao, cidade });
      } else {
        await api.post('/estacoes', { nome, localizacao, cidade });
      }

      setNome('');
      setLocalizacao('');
      setCidade('');
      setEditandoId(null);
      carregarEstacoes();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar estação');
    } finally {
      setSalvando(false);
    }
  };

  const editarEstacao = (estacao: Estacao) => {
    setNome(estacao.nome);
    setLocalizacao(estacao.localizacao);
    setCidade(estacao.cidade);
    setEditandoId(estacao.id);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerenciar Estações</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        autoFocus={editandoId !== null}
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

      <Button
        title={editandoId ? 'Atualizar Estação' : 'Cadastrar Estação'}
        onPress={salvarOuAtualizarEstacao}
        disabled={salvando}
      />

      {salvando && <ActivityIndicator size="large" color={theme.colors.primary} />}

      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        estacoes.map((estacao) => (
          <View key={estacao.id} style={styles.card}>
            <Text style={styles.cardTitle}>{estacao.nome}</Text>
            <Text style={styles.cardInfo}>📍 Localização: {estacao.localizacao}</Text>
            <Text style={styles.cardInfo}>🏙️ Cidade: {estacao.cidade}</Text>

            <View style={styles.buttonRow}>
              <Button title="Editar" onPress={() => editarEstacao(estacao)} />
              <Button title="Excluir" onPress={() => excluirEstacao(estacao.id)} />
            </View>
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
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: theme.spacing.large,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
