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
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import theme from '../styles/theme';

interface Estacao {
  id: number;
  nome: string;
  cidade: string;
  latitude: number;
  longitude: number;
}

export default function EstacoesScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const limparFormulario = () => {
    setNome('');
    setCidade('');
    setLatitude('');
    setLongitude('');
    setEditandoId(null);
  };

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

  const salvarOuAtualizar = () => {
    if (!nome || !cidade || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const dados = {
      nome,
      cidade,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    Alert.alert(
      editandoId ? 'Atualizar Estação' : 'Cadastrar Estação',
      `Deseja realmente ${editandoId ? 'atualizar' : 'salvar'} esta estação?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSalvando(true);
            try {
              if (editandoId !== null) {
                await api.put(`/estacoes/${editandoId}`, dados);
              } else {
                await api.post('/estacoes', dados);
              }
              limparFormulario();
              carregarEstacoes();
            } catch {
              Alert.alert('Erro', 'Falha ao salvar estação.');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  const editarEstacao = (e: Estacao) => {
    setEditandoId(e.id);
    setNome(e.nome);
    setCidade(e.cidade);
    setLatitude(e.latitude.toString());
    setLongitude(e.longitude.toString());
  };

  const excluirEstacao = (id: number) => {
    Alert.alert('Excluir estação', 'Deseja excluir esta estação?', [
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
      <Text style={styles.title}>🏭 Gerenciar Estações</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nome da Estação"
          value={nome}
          onChangeText={setNome}
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

        {editandoId && (
          <Button title="Cancelar Edição" color="gray" onPress={limparFormulario} />
        )}
      </View>

      {salvando || loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        estacoes.map((e) => (
          <View key={e.id} style={styles.card}>
            <Text style={styles.cardTitle}>{e.nome}</Text>
            <Text style={styles.cardInfo}>📍 {e.cidade}</Text>
            <Text style={styles.cardInfo}>🌐 {e.latitude}, {e.longitude}</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.botaoEditar} onPress={() => editarEstacao(e)}>
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirEstacao(e.id)}>
                <Text style={styles.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
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
    marginBottom: theme.spacing.large,
  },
  formulario: {
    marginBottom: theme.spacing.large,
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
    backgroundColor: '#eef7ff',
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    borderRadius: theme.radius.medium,
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
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.small,
  },
  botaoEditar: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 5,
  },
  botaoExcluir: {
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
