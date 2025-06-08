import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import theme from '../styles/theme';

interface Risco {
  id: number;
  descricao: string;
  nivel: string;
  dataHora: string;
}

export default function RiscosScreen() {
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [descricao, setDescricao] = useState('');
  const [nivel, setNivel] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarRiscos = async () => {
    setLoading(true);
    try {
      const res = await api.get<Risco[]>('/risco');
      setRiscos(res.data);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar riscos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRiscos();
  }, []);

  const salvarOuAtualizar = async () => {
    if (!descricao || !nivel) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const dados = { descricao, nivel };

    setSalvando(true);
    try {
      if (editandoId !== null) {
        await api.put(`/risco/${editandoId}`, dados);
      } else {
        await api.post('/risco', dados);
      }

      setDescricao('');
      setNivel('');
      setEditandoId(null);
      carregarRiscos();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar risco.');
    } finally {
      setSalvando(false);
    }
  };

  const editar = (r: Risco) => {
    setDescricao(r.descricao);
    setNivel(r.nivel);
    setEditandoId(r.id);
  };

  const excluir = (id: number) => {
    Alert.alert('Excluir risco', 'Deseja mesmo excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/risco/${id}`);
            carregarRiscos();
          } catch {
            Alert.alert('Erro', 'Erro ao excluir risco.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Risco }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>⚠️ {item.nivel}</Text>
      <Text>{item.descricao}</Text>
      <Text style={styles.cardData}>📅 {new Date(item.dataHora).toLocaleString()}</Text>
      <Button title="Editar" onPress={() => editar(item)} />
      <Button title="Excluir" onPress={() => excluir(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Riscos</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição do risco"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Picker
        selectedValue={nivel}
        onValueChange={setNivel}
        style={styles.input}
      >
        <Picker.Item label="Selecione o nível de risco" value="" />
        <Picker.Item label="Baixo" value="Baixo" />
        <Picker.Item label="Moderado" value="Moderado" />
        <Picker.Item label="Alto" value="Alto" />
        <Picker.Item label="Crítico" value="Crítico" />
      </Picker>

      <Button
        title={editandoId ? 'Atualizar Risco' : 'Salvar Risco'}
        onPress={salvarOuAtualizar}
      />

      {(salvando || loading) ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={riscos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
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
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
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
    borderRadius: 8,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: theme.fontSizes.medium,
  },
  cardData: {
    color: '#666',
    fontSize: theme.fontSizes.small,
  },
  list: {
    paddingBottom: theme.spacing.large,
  },
});
