import React, { useEffect, useState } from 'react';
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
import api from '../services/api';
import theme from '../styles/theme';

interface Leitura {
  id: number;
  valor: number;
  dataHora: string;
}

export default function LeiturasScreen() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [valor, setValor] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [carregandoAcao, setCarregandoAcao] = useState(false);

  const carregarLeituras = async () => {
    setLoading(true);
    try {
      const res = await api.get<Leitura[]>('/leitura');
      setLeituras(res.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar leituras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLeituras();
  }, []);

  const salvarOuAtualizarLeitura = async () => {
    if (!valor || !sensorId) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const leitura = {
      valor: parseFloat(valor),
      sensorId: parseInt(sensorId),
    };

    setCarregandoAcao(true);
    try {
      if (editandoId !== null) {
        await api.put(`/leitura/${editandoId}`, leitura);
      } else {
        await api.post('/leitura', leitura);
      }

      setValor('');
      setSensorId('');
      setEditandoId(null);
      carregarLeituras();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar leitura');
    } finally {
      setCarregandoAcao(false);
    }
  };

  const editarLeitura = (leitura: Leitura) => {
    setValor(leitura.valor.toString());
    setEditandoId(leitura.id);
    // sensorId não vem da API, precisa ser preenchido manualmente ou com associação
  };

  const excluirLeitura = (id: number) => {
    Alert.alert('Excluir Leitura', 'Deseja excluir esta leitura?', [
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

  const renderLeitura = ({ item }: { item: Leitura }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Valor: {item.valor}</Text>
      <Text style={styles.cardData}>Data/Hora: {new Date(item.dataHora).toLocaleString()}</Text>
      <Button title="Editar" onPress={() => editarLeitura(item)} />
      <Button title="Excluir" onPress={() => excluirLeitura(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Leituras</Text>

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <TextInput
        style={styles.input}
        placeholder="ID do Sensor"
        keyboardType="numeric"
        value={sensorId}
        onChangeText={setSensorId}
      />

      <Button
        title={editandoId ? 'Atualizar Leitura' : 'Cadastrar Leitura'}
        onPress={salvarOuAtualizarLeitura}
      />

      {carregandoAcao && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={leituras}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeitura}
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
