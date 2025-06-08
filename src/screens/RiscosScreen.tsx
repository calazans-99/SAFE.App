import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import theme from '../styles/theme';

interface Risco {
  id: number;
  descricao: string;
  nivel: string;
  data: string;
}

export default function RiscosScreen() {
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [descricao, setDescricao] = useState('');
  const [nivel, setNivel] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroTexto, setFiltroTexto] = useState('');

  useEffect(() => {
    carregarRiscos();
  }, []);

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

  const salvarOuAtualizarRisco = async () => {
    if (!descricao || !nivel) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    try {
      const data = { descricao, nivel };
      if (editandoId !== null) {
        await api.put(`/risco/${editandoId}`, data);
      } else {
        await api.post('/risco', data);
      }

      setDescricao('');
      setNivel('');
      setEditandoId(null);
      carregarRiscos();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar risco');
    } finally {
      setSalvando(false);
    }
  };

  const editarRisco = (risco: Risco) => {
    setDescricao(risco.descricao);
    setNivel(risco.nivel);
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

  const riscosFiltrados = riscos.filter((r) => {
    const nivelOk = filtroNivel ? r.nivel === filtroNivel : true;
    const textoOk = r.descricao?.toLowerCase().includes(filtroTexto.toLowerCase()) ?? false;
    return nivelOk && textoOk;
  });

  const renderItem = ({ item }: { item: Risco }) => (
    <View style={styles.card}>
      <Text style={styles.nivel}>⚠️ Nível: {item.nivel}</Text>
      <Text>{item.descricao}</Text>
      <Text style={styles.data}>
        📅 {new Date(item.data).toLocaleString()}
      </Text>
      <Button title="Editar" onPress={() => editarRisco(item)} />
      <Button title="Excluir" onPress={() => excluirRisco(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {salvando || loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={riscosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Riscos Detectados</Text>

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
                title={editandoId ? 'Atualizar Risco' : 'Cadastrar Risco'}
                onPress={salvarOuAtualizarRisco}
              />

              <View style={styles.filtros}>
                <TextInput
                  style={styles.input}
                  placeholder="🔍 Buscar por descrição"
                  value={filtroTexto}
                  onChangeText={setFiltroTexto}
                />
                <Picker
                  selectedValue={filtroNivel}
                  onValueChange={setFiltroNivel}
                  style={styles.input}
                >
                  <Picker.Item label="Todos os níveis" value="" />
                  <Picker.Item label="Baixo" value="Baixo" />
                  <Picker.Item label="Moderado" value="Moderado" />
                  <Picker.Item label="Alto" value="Alto" />
                  <Picker.Item label="Crítico" value="Crítico" />
                </Picker>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
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
    backgroundColor: theme.colors.white,
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
    color: theme.colors.text,
    fontSize: theme.fontSizes.small,
  },
  filtros: {
    marginTop: theme.spacing.large,
  },
  lista: {
    paddingBottom: theme.spacing.large,
  },
});
