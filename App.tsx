import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from 'styled-components';
import { StatusBar, SafeAreaView, Text } from 'react-native';
import { useColorScheme } from 'react-native';

const lightTheme = {
  colors: {
    background: '#fff',
    text: '#000',
    primary: '#1d3557',
    secondary: '#457b9d',
    alert: '#e63946',
    success: '#2a9d8f',
  },
};

const darkTheme = {
  colors: {
    background: '#121212',
    text: '#fff',
    primary: '#457b9d',
    secondary: '#3700b3',
    alert: '#f44336',
    success: '#03dac5',
  },
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView>
          <Text>Ocorreu um erro inesperado. Tente novamente mais tarde.</Text>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    if (scheme === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  }, [scheme]);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={theme.colors.background === '#fff' ? 'dark-content' : 'light-content'} />
      <ErrorBoundary>
        <AppNavigator />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
