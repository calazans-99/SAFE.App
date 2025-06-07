import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [loading, setLoading] = useState(true);
  const [carregandoAcao, setCarregandoAcao] = useState(false); // Controle de ações como salvar ou excluir

  // Função para carregar leituras
  const fetchLeituras = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/leituras', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeituras(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar leituras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeituras();
  }, []);

  // Função para adicionar uma nova leitura
  const handleAdd = async () => {
    if (!valor || !sensorId) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setCarregandoAcao(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/leituras',
        { valor: parseFloat(valor), sensorId: parseInt(sensorId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setValor('');
      setSensorId('');
      fetchLeituras(); // Recarregar leituras após salvar
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar leitura');
    } finally {
      setCarregandoAcao(false);
    }
  };

  // Função para excluir uma leitura
  const handleDelete = async (id: number) => {
    setCarregandoAcao(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/leituras/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLeituras(); // Recarregar leituras após excluir
    } catch (error) {
      Alert.alert('Erro', 'Falha ao excluir leitura');
    } finally {
      setCarregandoAcao(false);
    }
  };

  // Função para renderizar cada item da lista
  const renderLeitura = ({ item }: { item: Leitura }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Valor: {item.valor}</Text>
      <Text style={styles.cardData}>Data/Hora: {new Date(item.dataHora).toLocaleString()}</Text>
      <Button
        title="Excluir"
        onPress={() => handleDelete(item.id)} // Corrigido o evento de onPress
        accessibilityLabel="Excluir leitura"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Leituras</Text>

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        accessible={true}
        accessibilityLabel="Digite o valor da leitura"
      />
      <TextInput
        style={styles.input}
        placeholder="ID do Sensor"
        keyboardType="numeric"
        value={sensorId}
        onChangeText={setSensorId}
        accessible={true}
        accessibilityLabel="Digite o ID do sensor"
      />

      <Button
        title="Cadastrar Leitura"
        onPress={handleAdd}
        accessibilityLabel="Salvar leitura"
      />

      {/* Mostrar indicador de carregamento se necessário */}
      {carregandoAcao && <ActivityIndicator size="large" color={theme.colors.primary} />}

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
