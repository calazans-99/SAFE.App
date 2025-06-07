import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../services/api';
import theme from '../styles/theme';

interface Estacao {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  cidade: string;
}

interface Sensor {
  id: number;
  tipo: string;
  unidade: string;
  descricao: string;
}

export default function MapaScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<Estacao | null>(null);

  const fetchEstacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get<Estacao[]>('/estacoes');
      setEstacoes(response.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as estações.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSensoresDaEstacao = async (estacaoId: number) => {
    try {
      const response = await api.get<Sensor[]>(`/sensor?estacaoId=${estacaoId}`);
      setSensores(response.data);
    } catch {
      Alert.alert('Erro', 'Falha ao buscar sensores da estação.');
    }
  };

  const handlePressMarker = (estacao: Estacao) => {
    setEstacaoSelecionada(estacao);
    fetchSensoresDaEstacao(estacao.id);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchEstacoes();
  }, []);

  const estacoesFiltradas = estacoes.filter(
    (e) =>
      e.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      e.cidade.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar estação por nome ou cidade"
        value={filtro}
        onChangeText={setFiltro}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: estacoes.length > 0 ? estacoes[0].latitude : -23.5,
            longitude: estacoes.length > 0 ? estacoes[0].longitude : -46.6,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {estacoesFiltradas.map((est) => (
            <Marker
              key={est.id}
              coordinate={{ latitude: est.latitude, longitude: est.longitude }}
              title={est.nome}
              description={`Cidade: ${est.cidade}`}
              onPress={() => handlePressMarker(est)}
            />
          ))}
        </MapView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Sensores da estação: {estacaoSelecionada?.nome}
            </Text>
            {sensores.length === 0 ? (
              <Text style={styles.modalEmpty}>Nenhum sensor encontrado.</Text>
            ) : (
              <FlatList
                data={sensores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.sensorCard}>
                    <Text>📟 Tipo: {item.tipo}</Text>
                    <Text>🔧 Unidade: {item.unidade}</Text>
                    <Text>📝 Descrição: {item.descricao}</Text>
                  </View>
                )}
              />
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.fechar}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  modalEmpty: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  sensorCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  fechar: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
