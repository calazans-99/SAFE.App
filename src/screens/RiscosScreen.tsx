import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import api from '../services/api';
import theme from '../styles/theme';

interface Risco {
  id: number;
  nivel: string;
  tipo: string;
  valor: number;
  dataRisco: string;
}

export default function RiscosScreen() {
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [nivel, setNivel] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarRiscos = async () => {
    setLoading(true);
    try {
      const res = await api.get<Risco[]>('/risco');
      setRiscos(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar riscos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRiscos();
  }, []);

  const salvarOuAtualizarRisco = async () => {
    if (!nivel || !tipo || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const riscoPayload = {
      nivel,
      tipo,
      valor: parseFloat(valor),
    };

    setSalvando(true);
    try {
      if (editandoId !== null) {
        await api.put(`/risco/${editandoId}`, riscoPayload);
      } else {
        await api.post('/risco', riscoPayload);
      }

      setNivel('');
      setTipo('');
      setValor('');
      setEditandoId(null);
      carregarRiscos();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar risco');
    } finally {
      setSalvando(false);
    }
  };

  const editarRisco = (risco: Risco) => {
    setNivel(risco.nivel);
    setTipo(risco.tipo);
    setValor(risco.valor.toString());
    setEditandoId(risco.id);
  };

  const excluirRisco = (id: number) => {
    Alert.alert('Confirmar exclusão', 'Deseja realmente excluir este risco?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/risco/${id}`);
            carregarRiscos();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir risco');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Riscos Detectados</Text>

      <TextInput
        style={styles.input}
        placeholder="Nível de risco"
        value={nivel}
        onChangeText={setNivel}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Button
        title={editandoId ? 'Atualizar Risco' : 'Cadastrar Risco'}
        onPress={salvarOuAtualizarRisco}
      />

      {salvando && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : riscos.length === 0 ? (
        <Text style={styles.empty}>Nenhum risco detectado.</Text>
      ) : (
        riscos.map((risco) => (
          <View key={risco.id} style={styles.card}>
            <Text style={styles.nivel}>⚠️ Nível: {risco.nivel}</Text>
            <Text>Tipo: {risco.tipo}</Text>
            <Text>Valor: {risco.valor}</Text>
            <Text style={styles.data}>📅 {new Date(risco.dataRisco).toLocaleString()}</Text>
            <Button title="Editar" onPress={() => editarRisco(risco)} />
            <Button title="Excluir" onPress={() => excluirRisco(risco.id)} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.light.background,
    flexGrow: 1,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.light.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
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
    backgroundColor: theme.colors.light.white,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.small,
    elevation: 2,
  },
  nivel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: theme.fontSizes.medium,
  },
  data: {
    marginTop: 4,
    color: theme.colors.light.text,
    fontSize: theme.fontSizes.small,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.light.text,
    fontStyle: 'italic',
  },
});
