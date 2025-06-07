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
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import theme from '../styles/theme';

interface Alerta {
  id: number;
  mensagem: string;
  nivelRisco: string;
  status: string;
  dataHora: string;
}

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [nivelRisco, setNivelRisco] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [editando, setEditando] = useState<Alerta | null>(null);
  const [carregando, setCarregando] = useState(false);

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
    setStatus('Ativo');
    setEditando(null);
  };

  const salvarAlerta = () => {
    if (!mensagem.trim() || !nivelRisco.trim() || !status.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const novoAlerta = { mensagem, nivelRisco, status };

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
    setStatus(alerta.status);
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

  const renderAlerta = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitulo}>⚠️ {item.nivelRisco}</Text>
      <Text style={styles.cardMensagem}>{item.mensagem}</Text>
      <Text style={styles.cardStatus}>📌 Status: {item.status}</Text>
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
      <ScrollView contentContainerStyle={styles.formulario}>
        <Text style={styles.titulo}>Gerenciar Alertas</Text>

        <TextInput
          placeholder="Mensagem do alerta"
          style={styles.input}
          value={mensagem}
          onChangeText={setMensagem}
        />

        <Picker selectedValue={nivelRisco} onValueChange={setNivelRisco} style={styles.picker}>
          <Picker.Item label="Selecione o nível de risco" value="" />
          <Picker.Item label="Baixo" value="Baixo" />
          <Picker.Item label="Moderado" value="Moderado" />
          <Picker.Item label="Alto" value="Alto" />
          <Picker.Item label="Crítico" value="Crítico" />
        </Picker>

        <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
          <Picker.Item label="Ativo" value="Ativo" />
          <Picker.Item label="Resolvido" value="Resolvido" />
        </Picker>

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlerta}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>

      {carregando ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAlerta}
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
  picker: {
    backgroundColor: '#fff',
    marginBottom: theme.spacing.small,
    borderRadius: 8,
  },
  botaoSalvar: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lista: {
    paddingBottom: theme.spacing.large,
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
  cardStatus: {
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
    marginTop: 8,
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
});
