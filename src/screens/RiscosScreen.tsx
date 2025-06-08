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
import api from '../services/api';
import theme from '../styles/theme';

interface Risco {
  id: number;
  tipo: string;
  descricao: string;
  valor: number;
  dataHora: string;
}

export default function RiscosScreen() {
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const limparFormulario = () => {
    setDescricao('');
    setTipo('');
    setValor('');
    setEditandoId(null);
  };

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

  const salvarOuAtualizar = () => {
    if (!descricao || !tipo || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const dados = {
      descricao,
      tipo,
      valor: parseFloat(valor),
    };

    Alert.alert(
      editandoId ? 'Confirmar Atualização' : 'Confirmar Cadastro',
      `Deseja ${editandoId ? 'atualizar' : 'salvar'} este risco?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSalvando(true);
            try {
              if (editandoId !== null) {
                await api.put(`/risco/${editandoId}`, dados);
              } else {
                await api.post('/risco', dados);
              }

              limparFormulario();
              carregarRiscos();
            } catch {
              Alert.alert('Erro', 'Falha ao salvar risco.');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  const editar = (r: Risco) => {
    setDescricao(r.descricao);
    setTipo(r.tipo);
    setValor(r.valor.toString());
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
      <Text style={styles.cardTitle}>⚠️ {item.tipo}</Text>
      <Text style={styles.cardInfo}>Descrição: {item.descricao}</Text>
      <Text style={styles.cardInfo}>Valor: {item.valor}</Text>
      <Text style={styles.cardData}>📅 {new Date(item.dataHora).toLocaleString()}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editar(item)}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluir(item.id)}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📉 Gerenciar Riscos</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Tipo do risco (ex: Incêndio)"
          value={tipo}
          onChangeText={setTipo}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição do risco"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor do risco (ex: 0.8)"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
        />

        <Button
          title={editandoId ? 'Atualizar Risco' : 'Salvar Risco'}
          onPress={salvarOuAtualizar}
        />

        {editandoId && (
          <Button title="Cancelar Edição" color="gray" onPress={limparFormulario} />
        )}
      </View>

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
    backgroundColor: '#fff7f0',
    borderRadius: 8,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 2,
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
  cardData: {
    color: '#666',
    fontSize: theme.fontSizes.small,
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
