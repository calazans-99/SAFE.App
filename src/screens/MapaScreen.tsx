import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import theme from '../styles/theme';

interface Estacao {
  id: number;
  nome: string;
  cidade: string;
  latitude: number;
  longitude: number;
}

interface Sensor {
  id: number;
  tipo: string;
  unidade: string;
  descricao: string;
}

export default function MapaScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<Estacao | null>(null);

  const mapRef = useRef<MapView>(null);

  const fetchEstacoes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.0.67:8080/api/estacoes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstacoes(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar estações');
    } finally {
      setLoading(false);
    }
  };

  const buscarSensoresPorEstacao = async (estacaoId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`http://192.168.0.67:8080/api/sensor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtrados = res.data.filter((s: any) => s.estacao?.id === estacaoId);
      setSensores(filtrados);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar sensores');
    }
  };

  const abrirModal = (estacao: Estacao) => {
    setEstacaoSelecionada(estacao);
    buscarSensoresPorEstacao(estacao.id);
    setModalVisible(true);
  };

  const estacoesFiltradas = cidadeSelecionada
    ? estacoes.filter((e) => e.cidade === cidadeSelecionada)
    : estacoes;

  const cidadesUnicas = Array.from(new Set(estacoes.map((e) => e.cidade)));

  useEffect(() => {
    fetchEstacoes();
  }, []);

  useEffect(() => {
    if (cidadeSelecionada && mapRef.current) {
      const estacao = estacoes.find((e) => e.cidade === cidadeSelecionada);
      if (estacao) {
        const novaRegiao: Region = {
          latitude: estacao.latitude,
          longitude: estacao.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        };
        mapRef.current.animateToRegion(novaRegiao, 1000);
      }
    }
  }, [cidadeSelecionada, estacoes]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Picker
            selectedValue={cidadeSelecionada}
            onValueChange={setCidadeSelecionada}
            style={styles.picker}
          >
            <Picker.Item label="Todas as cidades" value="" />
            {cidadesUnicas.map((cidade) => (
              <Picker.Item key={cidade} label={cidade} value={cidade} />
            ))}
          </Picker>

          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude:
                estacoesFiltradas.length > 0 ? estacoesFiltradas[0].latitude : -23.5,
              longitude:
                estacoesFiltradas.length > 0 ? estacoesFiltradas[0].longitude : -46.6,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {estacoesFiltradas.map((est) => (
              <Marker
                key={est.id}
                coordinate={{
                  latitude: est.latitude,
                  longitude: est.longitude,
                }}
                title={est.nome}
                description={`Cidade: ${est.cidade}`}
                onPress={() => abrirModal(est)}
              />
            ))}
          </MapView>
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            Sensores da estação: {estacaoSelecionada?.nome}
          </Text>

          {sensores.length === 0 ? (
            <Text style={styles.empty}>Nenhum sensor encontrado.</Text>
          ) : (
            <FlatList
              data={sensores}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.sensorCard}>
                  <Text style={styles.sensorTitle}>{item.tipo}</Text>
                  <Text>Unidade: {item.unidade}</Text>
                  <Text>Descrição: {item.descricao}</Text>
                </View>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.botaoFechar}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textoFechar}>Fechar</Text>
          </TouchableOpacity>
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
  picker: {
    backgroundColor: '#fff',
  },
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  sensorCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  sensorTitle: {
    fontWeight: 'bold',
  },
  botaoFechar: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoFechar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: theme.colors.text,
  },
});
