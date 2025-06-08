import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import api from '../services/api';
import theme from '../styles/theme';

interface Sensor {
  id: number;
  tipo: string;
  unidade: string;
  descricao: string;
}

export default function SensoresScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [tipo, setTipo] = useState('');
  const [unidade, setUnidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregarSensores = async () => {
    setLoading(true);
    try {
      const res = await api.get<Sensor[]>('/sensor');
      setSensores(res.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os sensores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSensores();
  }, []);

  const salvarOuAtualizarSensor = async () => {
    if (!tipo || !unidade || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const dados = { tipo, unidade, descricao };
    setSalvando(true);

    try {
      if (editandoId !== null) {
        await api.put(`/sensor/${editandoId}`, dados);
      } else {
        await api.post('/sensor', dados);
      }

      setTipo('');
      setUnidade('');
      setDescricao('');
      setEditandoId(null);
      carregarSensores();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar sensor');
    } finally {
      setSalvando(false);
    }
  };

  const editarSensor = (sensor: Sensor) => {
    setTipo(sensor.tipo);
    setUnidade(sensor.unidade);
    setDescricao(sensor.descricao);
    setEditandoId(sensor.id);
  };

  const excluirSensor = (id: number) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir este sensor?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/sensor/${id}`);
            carregarSensores();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir sensor');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Sensor }) => (
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

      {(loading || salvando) ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={sensores}
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
  cardInfo: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
  },
  list: {
    paddingBottom: theme.spacing.large,
  },
});
