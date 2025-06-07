import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AlertasScreen from '../screens/AlertasScreen';
import MapaScreen from '../screens/MapaScreen';
import LeiturasScreen from '../screens/LeiturasScreen';
import RiscosScreen from '../screens/RiscosScreen';
import EstacoesScreen from '../screens/EstacoesScreen';
import ConfigScreen from '../screens/ConfigScreen';
import InstrucoesScreen from '../screens/InstrucoesScreen';
import SensoresScreen from '../screens/SensoresScreen';
import theme from '../styles/theme';
import { useColorScheme } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Home: undefined;
  Alertas: undefined;
  Mapa: undefined;
  Leituras: undefined;
  Riscos: undefined;
  Estacoes: undefined;
  Sensores: undefined;
  Instrucoes: undefined;
  Configuracoes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabIcon = (routeName: keyof RootTabParamList, color: string, size: number) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (routeName) {
    case 'Home':
      iconName = 'home-outline';
      break;
    case 'Alertas':
      iconName = 'warning-outline';
      break;
    case 'Mapa':
      iconName = 'map-outline';
      break;
    case 'Leituras':
      iconName = 'analytics-outline';
      break;
    case 'Riscos':
      iconName = 'pulse-outline';
      break;
    case 'Estacoes':
      iconName = 'location-outline';
      break;
    case 'Sensores':
      iconName = 'hardware-chip-outline';
      break;
    case 'Instrucoes':
      iconName = 'book-outline';
      break;
    case 'Configuracoes':
      iconName = 'settings-outline';
      break;
    default:
      iconName = 'ellipse-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

export default function Tabs() {
  const scheme = useColorScheme();
  const currentTheme = theme.colors[scheme ?? 'light'];  

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<RootTabParamList, keyof RootTabParamList> }) => ({
        headerShown: false,
        tabBarActiveTintColor: currentTheme.alert,
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
        tabBarAccessibilityLabel: `${route.name} Tab`,  // Correção para string direta
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Estacoes" component={EstacoesScreen} />
      <Tab.Screen name="Leituras" component={LeiturasScreen} />
      <Tab.Screen name="Riscos" component={RiscosScreen} />
      <Tab.Screen name="Alertas" component={AlertasScreen} />
      <Tab.Screen name="Sensores" component={SensoresScreen} />
      <Tab.Screen name="Instrucoes" component={InstrucoesScreen} />
      <Tab.Screen name="Configuracoes" component={ConfigScreen} />
    </Tab.Navigator>
  );
}
