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
  TouchableOpacity,
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

  const limparFormulario = () => {
    setTipo('');
    setUnidade('');
    setDescricao('');
    setEditandoId(null);
  };

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

    Alert.alert(
      editandoId ? 'Confirmar Atualização' : 'Confirmar Cadastro',
      `Deseja ${editandoId ? 'atualizar' : 'cadastrar'} este sensor?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSalvando(true);
            try {
              if (editandoId !== null) {
                await api.put(`/sensor/${editandoId}`, dados);
              } else {
                await api.post('/sensor', dados);
              }

              limparFormulario();
              carregarSensores();
            } catch {
              Alert.alert('Erro', 'Falha ao salvar sensor');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  const editarSensor = (sensor: Sensor) => {
    setTipo(sensor.tipo);
    setUnidade(sensor.unidade);
    setDescricao(sensor.descricao);
    setEditandoId(sensor.id);
  };

  const excluirSensor = (id: number) => {
    Alert.alert('Excluir Sensor', 'Tem certeza que deseja excluir?', [
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
      <Text style={styles.cardTitle}>🔧 {item.tipo}</Text>
      <Text style={styles.cardInfo}>Unidade: {item.unidade}</Text>
      <Text style={styles.cardInfo}>Descrição: {item.descricao}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editarSensor(item)}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirSensor(item.id)}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Gerenciar Sensores</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Tipo do sensor (ex: Temperatura)"
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={styles.input}
          placeholder="Unidade (ex: °C, %, ppm)"
          value={unidade}
          onChangeText={setUnidade}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição detalhada"
          value={descricao}
          onChangeText={setDescricao}
        />
        <Button
          title={editandoId ? 'Atualizar Sensor' : 'Salvar Sensor'}
          onPress={salvarOuAtualizarSensor}
        />
        {editandoId && (
          <Button title="Cancelar Edição" color="gray" onPress={limparFormulario} />
        )}
      </View>

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
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: theme.fontSizes.medium,
    marginBottom: 4,
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
  list: {
    paddingBottom: theme.spacing.large,
  },
});
