import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import theme from '../styles/theme';

interface Sensor {
  id: number;
  tipo: string;
  unidade: string;
  descricao: string;
  estacaoId?: number;
}

interface Estacao {
  id: number;
  nome: string;
}

export default function SensoresScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [tipo, setTipo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<number | null>(null);

  const carregarSensores = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = estacaoSelecionada
        ? `/sensor?estacaoId=${estacaoSelecionada}`
        : '/sensor';

      const res = await api.get<Sensor[]>(endpoint);
      setSensores(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar sensores');
    } finally {
      setLoading(false);
    }
  }, [estacaoSelecionada]);

  const carregarEstacoes = async () => {
    try {
      const res = await api.get<Estacao[]>('/estacoes');
      setEstacoes(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar estações');
    }
  };

  useEffect(() => {
    carregarEstacoes();
    carregarSensores();
  }, [carregarSensores]);

  const salvarOuAtualizarSensor = async () => {
    if (!tipo || !unidade || !estacaoSelecionada) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const sensor = {
      tipo,
      unidade,
      descricao,
      estacaoId: estacaoSelecionada,
    };

    setLoading(true);
    try {
      if (editandoId !== null) {
        await api.put(`/sensor/${editandoId}`, sensor);
      } else {
        await api.post('/sensor', sensor);
      }

      setTipo('');
      setUnidade('');
      setDescricao('');
      setEditandoId(null);
      await carregarSensores();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar ou atualizar sensor');
    } finally {
      setLoading(false);
    }
  };

  const editarSensor = (sensor: Sensor) => {
    setTipo(sensor.tipo);
    setUnidade(sensor.unidade);
    setDescricao(sensor.descricao);
    setEstacaoSelecionada(sensor.estacaoId || null);
    setEditandoId(sensor.id);
  };

  const excluirSensor = (id: number) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este sensor?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/sensor/${id}`);
            await carregarSensores();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir sensor');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderSensor = ({ item }: { item: Sensor }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.tipo}</Text>
      <Text style={styles.cardInfo}>Unidade: {item.unidade}</Text>
      <Text style={styles.cardInfo}>Descrição: {item.descricao}</Text>
      <Button title="Editar" onPress={() => editarSensor(item)} />
      <Button title="Excluir" onPress={() => excluirSensor(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Sensores</Text>

      <Picker
        selectedValue={estacaoSelecionada}
        onValueChange={(value) => setEstacaoSelecionada(value)}
        style={styles.input}
      >
        <Picker.Item label="Selecione uma estação" value={null} />
        {estacoes.map((e) => (
          <Picker.Item key={e.id} label={e.nome} value={e.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Unidade"
        value={unidade}
        onChangeText={setUnidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button
        title={editandoId ? 'Atualizar Sensor' : 'Salvar Sensor'}
        onPress={salvarOuAtualizarSensor}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={sensores}
          renderItem={renderSensor}
          keyExtractor={(item) => item.id.toString()}
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
  cardInfo: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
  },
  list: {
    paddingBottom: theme.spacing.large,
  },
});
