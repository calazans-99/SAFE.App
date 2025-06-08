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

interface Leitura {
  id: number;
  valor: number;
  dataHora: string;
  sensorId: number;
}

interface Sensor {
  id: number;
  tipo: string;
}

export default function LeiturasScreen() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [valor, setValor] = useState('');
  const [sensorId, setSensorId] = useState<number | ''>('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);

  const carregarSensores = async () => {
    try {
      const res = await api.get<Sensor[]>('/sensor');
      setSensores(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar sensores.');
    }
  };

  const carregarLeituras = async () => {
    setLoading(true);
    try {
      const endpoint = sensorId ? `/leitura?sensorId=${sensorId}` : '/leitura';
      const res = await api.get<Leitura[]>(endpoint);
      setLeituras(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar leituras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSensores();
  }, []);

  useEffect(() => {
    carregarLeituras();
  }, [sensorId]);

  const salvarOuAtualizarLeitura = async () => {
    if (!valor || !sensorId) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setSalvando(true);
    try {
      const dados = { valor: parseFloat(valor), sensorId };

      if (editandoId !== null) {
        await api.put(`/leitura/${editandoId}`, dados);
      } else {
        await api.post('/leitura', dados);
      }

      setValor('');
      setSensorId('');
      setEditandoId(null);
      carregarLeituras();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar leitura');
    } finally {
      setSalvando(false);
    }
  };

  const editarLeitura = (leitura: Leitura) => {
    setValor(leitura.valor.toString());
    setSensorId(leitura.sensorId);
    setEditandoId(leitura.id);
  };

  const excluirLeitura = (id: number) => {
    Alert.alert('Confirmação', 'Deseja excluir esta leitura?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/leitura/${id}`);
            carregarLeituras();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir leitura');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Leitura }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Valor: {item.valor}</Text>
      <Text style={styles.cardData}>
        Data/Hora: {new Date(item.dataHora).toLocaleString()}
      </Text>
      <Button title="Editar" onPress={() => editarLeitura(item)} />
      <Button title="Excluir" onPress={() => excluirLeitura(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Leituras</Text>

      <Picker
        selectedValue={sensorId}
        onValueChange={(value) => setSensorId(value)}
        style={styles.input}
      >
        <Picker.Item label="Selecione um sensor" value="" />
        {sensores.map((s) => (
          <Picker.Item key={s.id} label={`Sensor ${s.id} - ${s.tipo}`} value={s.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Valor da Leitura"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <Button
        title={editandoId ? 'Atualizar Leitura' : 'Salvar Leitura'}
        onPress={salvarOuAtualizarLeitura}
      />

      {salvando || loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={leituras}
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
