import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import theme from '../styles/theme';

interface Alerta {
  id: number;
  mensagem: string;
  nivelRisco: string;
  dataHora: string;
}

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [nivelRisco, setNivelRisco] = useState('');
  const [editando, setEditando] = useState<Alerta | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroTexto, setFiltroTexto] = useState('');

  const carregarAlertas = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await api.get<Alerta[]>('/alertas');
      setAlertas(res.data);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar os alertas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAlertas();
  }, [carregarAlertas]);

  const limparCampos = () => {
    setMensagem('');
    setNivelRisco('');
    setEditando(null);
  };

  const salvarAlerta = async () => {
    if (!mensagem || !nivelRisco) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const dados = { mensagem, nivelRisco };

    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/alertas/${editando.id}`, dados);
      } else {
        await api.post('/alertas', dados);
      }
      limparCampos();
      carregarAlertas();
    } catch {
      Alert.alert('Erro', 'Erro ao salvar alerta.');
    } finally {
      setSalvando(false);
    }
  };

  const editarAlerta = (alerta: Alerta) => {
    setEditando(alerta);
    setMensagem(alerta.mensagem);
    setNivelRisco(alerta.nivelRisco);
  };

  const excluirAlerta = (id: number) => {
    Alert.alert('Confirmar', 'Deseja excluir este alerta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/alertas/${id}`);
            carregarAlertas();
          } catch {
            Alert.alert('Erro', 'Erro ao excluir alerta.');
          }
        },
      },
    ]);
  };

  const alertasFiltrados = alertas.filter((alerta) => {
  const nivelOk = filtroNivel ? alerta.nivelRisco === filtroNivel : true;
  const textoOk = (alerta.mensagem ?? '').toLowerCase().includes(filtroTexto.toLowerCase());
  return nivelOk && textoOk;
});

  const renderItem = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>⚠️ {item.nivelRisco}</Text>
      <Text style={styles.cardMensagem}>{item.mensagem}</Text>
      <Text style={styles.cardData}>📅 {new Date(item.dataHora).toLocaleString()}</Text>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editarAlerta(item)}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirAlerta(item.id)}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Gerenciar Alertas</Text>

      <View style={styles.formulario}>
        <TextInput
          placeholder="Mensagem do alerta"
          style={styles.input}
          value={mensagem}
          onChangeText={setMensagem}
        />

        <Picker
          selectedValue={nivelRisco}
          onValueChange={setNivelRisco}
          style={styles.input}
        >
          <Picker.Item label="Selecione o nível de risco" value="" />
          <Picker.Item label="Baixo" value="Baixo" />
          <Picker.Item label="Moderado" value="Moderado" />
          <Picker.Item label="Alto" value="Alto" />
          <Picker.Item label="Crítico" value="Crítico" />
        </Picker>

        <Button title={editando ? 'Atualizar' : 'Salvar'} onPress={salvarAlerta} />
      </View>

      <View style={styles.filtros}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Buscar por mensagem"
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

      {carregando || salvando ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={alertasFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
  },
  titulo: {
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
  filtros: {
    marginBottom: theme.spacing.medium,
  },
  lista: {
    paddingBottom: theme.spacing.large,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    elevation: 3,
  },
  cardTitulo: {
    fontWeight: 'bold',
    fontSize: theme.fontSizes.medium,
  },
  cardMensagem: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
  },
  cardData: {
    color: '#666',
    fontSize: theme.fontSizes.small,
  },
  botoes: {
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
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
