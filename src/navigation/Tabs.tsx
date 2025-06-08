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

export type RootTabParamList = {
  Alertas: undefined;
  Mapa: undefined;
  Sensores: undefined;
  Leituras: undefined;
  Riscos: undefined;
  Estacoes: undefined;
  Config: undefined;
  Instrucoes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1d3557',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            Alertas: 'notifications',
            Mapa: 'map',
            Sensores: 'hardware-chip',
            Leituras: 'stats-chart',
            Riscos: 'warning',
            Estacoes: 'cloudy-night',
            Config: 'settings',
            Instrucoes: 'book',
          };

          const iconName = icons[route.name as keyof RootTabParamList] || 'apps';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Estacoes" component={EstacoesScreen} />
      <Tab.Screen name="Sensores" component={SensoresScreen} />
      <Tab.Screen name="Leituras" component={LeiturasScreen} />
      <Tab.Screen name="Riscos" component={RiscosScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Instrucoes" component={InstrucoesScreen} />
      <Tab.Screen name="Config" component={ConfigScreen} />
    </Tab.Navigator>
  );
}
