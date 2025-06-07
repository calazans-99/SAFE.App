import React from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes'; 

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); 

  return (
    <ImageBackground
      source={require('../assets/splash-icon.png')}
      style={styles.background}
      imageStyle={{ opacity: 0.08 }}
    >
      <SafeAreaView style={styles.container}>
        <Text 
          style={styles.title} 
          accessibilityRole="header" 
          accessibilityLabel="Bem-vindo ao SAFE.Guard"
        >
          Bem-vindo ao SAFE.Guard
        </Text>

        <Text 
          style={styles.subtitle} 
          accessibilityRole="text"
          accessibilityLabel="Monitore riscos, receba alertas e visualize informações das estações em tempo real."
        >
          Monitore riscos, receba alertas e visualize informações das estações em tempo real.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Estacoes')}
          accessibilityLabel="Navegar para as estações"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Ver Estações</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: theme.spacing.large,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontSize: theme.fontSizes.extraLarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.fontSizes.medium,
    fontWeight: '600',
  },
});
