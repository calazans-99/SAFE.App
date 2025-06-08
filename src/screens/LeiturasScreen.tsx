import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Button,
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

  const limparFormulario = () => {
    setValor('');
    setSensorId('');
    setEditandoId(null);
  };

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

  const salvarOuAtualizarLeitura = () => {
    if (!valor || !sensorId) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const dados = { valor: parseFloat(valor), sensorId };

    Alert.alert(
      editandoId ? 'Atualizar Leitura' : 'Salvar Leitura',
      `Deseja realmente ${editandoId ? 'atualizar' : 'salvar'} esta leitura?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSalvando(true);
            try {
              if (editandoId !== null) {
                await api.put(`/leitura/${editandoId}`, dados);
              } else {
                await api.post('/leitura', dados);
              }

              limparFormulario();
              carregarLeituras();
            } catch {
              Alert.alert('Erro', 'Falha ao salvar leitura');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  const editarLeitura = (leitura: Leitura) => {
    setValor(leitura.valor.toString());
    setSensorId(leitura.sensorId);
    setEditandoId(leitura.id);
  };

  const excluirLeitura = (id: number) => {
    Alert.alert('Excluir leitura', 'Deseja excluir esta leitura?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/leitura/${id}`);
            carregarLeituras();
          } catch {
            Alert.alert('Erro', 'Erro ao excluir leitura');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Leitura }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📍 Sensor ID: {item.sensorId}</Text>
      <Text style={styles.cardInfo}>Valor: {item.valor}</Text>
      <Text style={styles.cardData}>📅 {new Date(item.dataHora).toLocaleString()}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editarLeitura(item)}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirLeitura(item.id)}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Gerenciar Leituras</Text>

      <View style={styles.formulario}>
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

        {editandoId && (
          <Button title="Cancelar Edição" color="gray" onPress={limparFormulario} />
        )}
      </View>

      {(salvando || loading) ? (
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
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
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
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: theme.fontSizes.medium,
  },
  cardInfo: {
    fontSize: theme.fontSizes.small,
  },
  cardData: {
    fontSize: theme.fontSizes.small,
    color: '#666',
    marginTop: 4,
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
  list: {
    paddingBottom: theme.spacing.large,
  },
});
