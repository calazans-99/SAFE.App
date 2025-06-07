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
  const [loading, setLoading] = useState(false);

  // Função para carregar sensores
  const carregarSensores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Sensor[]>('/sensores'); // Tipando a resposta
      setSensores(res.data); // Atualiza a lista de sensores
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Erro ao carregar sensores', error.message);
      } else {
        Alert.alert('Erro ao carregar sensores', 'Erro desconhecido.');
      }
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }, []);

  // Carregar sensores ao montar o componente
  useEffect(() => {
    carregarSensores();
  }, [carregarSensores]);

  // Função para salvar sensor
  const salvarSensor = async () => {
    if (!tipo || !unidade) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const novoSensor = { tipo, unidade, descricao };

    setLoading(true);
    try {
      await api.post('/sensores', novoSensor); // Tipando a requisição
      setTipo('');
      setUnidade('');
      setDescricao('');
      await carregarSensores(); // Atualiza a lista de sensores após o cadastro
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Erro ao salvar sensor', error.message);
      } else {
        Alert.alert('Erro ao salvar sensor', 'Erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para excluir sensor
  const excluirSensor = (id: number) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este sensor?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/sensores/${id}`); // Exclui o sensor
            await carregarSensores(); // Atualiza a lista de sensores
          } catch (error: unknown) {
            if (error instanceof Error) {
              Alert.alert('Erro ao excluir sensor', error.message);
            } else {
              Alert.alert('Erro ao excluir sensor', 'Erro desconhecido.');
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // Função para renderizar cada item da lista
  const renderSensor = ({ item }: { item: Sensor }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.tipo}</Text>
      <Text style={styles.cardInfo}>Unidade: {item.unidade}</Text>
      <Text style={styles.cardInfo}>Descrição: {item.descricao}</Text>
      <Button
        title="Excluir"
        onPress={() => excluirSensor(item.id)} // Corrigido o evento de onPress
        accessibilityLabel="Excluir este sensor"
      />
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
        accessible={true}
        accessibilityLabel="Digite o tipo do sensor"
      />
      <TextInput
        style={styles.input}
        placeholder="Unidade"
        value={unidade}
        onChangeText={setUnidade}
        accessible={true}
        accessibilityLabel="Digite a unidade de medida"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        accessible={true}
        accessibilityLabel="Digite a descrição do sensor"
      />

      <Button
        title="Salvar Sensor"
        onPress={salvarSensor}
        accessibilityLabel="Salvar novo sensor"
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
