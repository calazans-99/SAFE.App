// src/navigation/Tabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AlertasScreen from '../screens/AlertasScreen';
import SensoresScreen from '../screens/SensoresScreen';
import MapaScreen from '../screens/MapaScreen';
import LeiturasScreen from '../screens/LeiturasScreen';
import RiscosScreen from '../screens/RiscosScreen';
import EstacoesScreen from '../screens/EstacoesScreen';
import ConfigScreen from '../screens/ConfigScreen';
import InstrucoesScreen from '../screens/InstrucoesScreen';


type RootTabParamList = {
  Alertas: undefined;
  Mapa: undefined;
  Leituras: undefined;
  Riscos: undefined;
  Estacoes: undefined;
  Config: undefined;
  Instrucoes: undefined;
  Sensores: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Alertas':
              iconName = 'alert-circle';
              break;
            case 'Mapa':
              iconName = 'map';
              break;
            case 'Leituras':
              iconName = 'stats-chart';
              break;
            case 'Riscos':
              iconName = 'warning';
              break;
            case 'Estacoes':
              iconName = 'cloudy-night';
              break;
            case 'Config':
              iconName = 'settings';
              break;
            case 'Instrucoes':
              iconName = 'book';
              break;
            case 'Sensores':
              iconName = 'hardware-chip';
              break;
            default:
              iconName = 'apps';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1d3557',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Sensores" component={SensoresScreen} />
      <Tab.Screen name="Leituras" component={LeiturasScreen} />
      <Tab.Screen name="Riscos" component={RiscosScreen} />
      <Tab.Screen name="Estacoes" component={EstacoesScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} />
      <Tab.Screen name="Instrucoes" component={InstrucoesScreen} />
    </Tab.Navigator>
  );
}
