import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import theme from '../styles/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes'; 

interface Estacao {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
}

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    Alert.alert('Erro', error.message || 'Ocorreu um erro desconhecido.');
  } else {
    Alert.alert('Erro', 'Ocorreu um erro desconhecido.');
  }
};

export default function MapaScreen() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  const fetchEstacoes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/estacoes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEstacoes(response.data);
    } catch (error) {
      handleError(error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstacoes();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.light.primary} />
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
          {estacoes.map((est) => (
            <Marker
              key={est.id}
              coordinate={{
                latitude: est.latitude,
                longitude: est.longitude,
              }}
              title={est.nome}
              description={`Estação ID ${est.id}`}
              accessible={true}
              accessibilityLabel={`Estação ${est.nome}`}
              accessibilityRole="button"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  map: {
    flex: 1,
  },
});
