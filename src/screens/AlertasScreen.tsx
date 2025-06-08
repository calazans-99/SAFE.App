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
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroTexto, setFiltroTexto] = useState('');

  const carregarAlertas = useCallback(() => {
    setCarregando(true);
    api.get<Alerta[]>('/alertas')
      .then((response) => setAlertas(response.data))
      .catch(() => Alert.alert('Erro', 'Falha ao carregar os alertas'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregarAlertas();
  }, [carregarAlertas]);

  const limparCampos = () => {
    setMensagem('');
    setNivelRisco('');
    setEditando(null);
  };

  const salvarAlerta = () => {
    if (!mensagem.trim() || !nivelRisco.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const novoAlerta = { mensagem, nivelRisco };

    const requisicao = editando
      ? api.put(`/alertas/${editando.id}`, novoAlerta)
      : api.post('/alertas', novoAlerta);

    requisicao
      .then(() => {
        carregarAlertas();
        limparCampos();
      })
      .catch(() => Alert.alert('Erro', 'Falha ao salvar o alerta'));
  };

  const editarAlerta = (alerta: Alerta) => {
    setEditando(alerta);
    setMensagem(alerta.mensagem);
    setNivelRisco(alerta.nivelRisco);
  };

  const excluirAlerta = (id: number) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este alerta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          api.delete(`/alertas/${id}`)
            .then(() => carregarAlertas())
            .catch(() => Alert.alert('Erro', 'Falha ao excluir o alerta'));
        },
      },
    ]);
  };

  const alertasFiltrados = alertas.filter((alerta) => {
    const nivelOk = filtroNivel ? alerta.nivelRisco === filtroNivel : true;
    const textoOk = alerta.mensagem?.toLowerCase().includes(filtroTexto.toLowerCase()) ?? false;
    return nivelOk && textoOk;
  });

  const renderAlerta = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>⚠️ {item.nivelRisco}</Text>
      <Text style={styles.cardMensagem}>{item.mensagem}</Text>
      <Text style={styles.cardData}>📅 {new Date(item.dataHora).toLocaleString()}</Text>
      <View style={styles.botoes}>
        <TouchableOpacity onPress={() => editarAlerta(item)} style={styles.botaoEditar}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => excluirAlerta(item.id)} style={styles.botaoExcluir}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {carregando ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={alertasFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAlerta}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <View style={styles.formulario}>
              <Text style={styles.titulo}>Gerenciar Alertas</Text>

              <TextInput
                placeholder="Mensagem do alerta"
                style={styles.input}
                value={mensagem}
                onChangeText={setMensagem}
              />

              <Picker
                selectedValue={nivelRisco}
                onValueChange={(itemValue) => setNivelRisco(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="Selecione o nível de risco" value="" />
                <Picker.Item label="Baixo" value="Baixo" />
                <Picker.Item label="Moderado" value="Moderado" />
                <Picker.Item label="Alto" value="Alto" />
                <Picker.Item label="Crítico" value="Crítico" />
              </Picker>

              <Button title={editando ? 'Atualizar Alerta' : 'Salvar'} onPress={salvarAlerta} />

              <View style={styles.filtros}>
                <TextInput
                  style={styles.input}
                  placeholder="🔍 Buscar por mensagem"
                  value={filtroTexto}
                  onChangeText={setFiltroTexto}
                />
                <Picker
                  selectedValue={filtroNivel}
                  onValueChange={(value) => setFiltroNivel(value)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  titulo: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  formulario: {
    padding: theme.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: theme.spacing.small,
    marginBottom: theme.spacing.small,
    backgroundColor: '#fff',
  },
  lista: {
    paddingBottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
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
  filtros: {
    marginTop: theme.spacing.medium,
  },
});
