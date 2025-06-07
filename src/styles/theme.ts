interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  alert: string; 
  success: string;
  danger: string;
  warning: string;
  text: string;
  white: string;
  info: string;
  card: string;
}

interface Theme {
  colors: {
    white: any;
    background: any;
    primary: any;
    alert: any;
    text: any;
    secondary: any;
    light: ThemeColors;
    dark: ThemeColors;
  };
  fontSizes: {
    tiny: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    extraLarge: number;
  };
  spacing: {
    none: number;
    tiny: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  radius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
}

const theme: Theme = {
  colors: {
    light: {
      primary: '#1d3557',
      secondary: '#457b9d',
      background: '#f1faee',
      alert: '#e63946',
      success: '#2a9d8f',
      danger: '#c62828',
      warning: '#f4a261',
      text: '#333',
      white: '#fff',
      info: '#00b4d8',
      card: '#ffffff',
    },
    dark: {
      primary: '#121212',
      secondary: '#3700b3',
      background: '#181818',
      alert: '#f44336',
      success: '#03dac5',
      danger: '#b00020',
      warning: '#ff9800',
      text: '#e0e0e0',
      white: '#ffffff',
      info: '#03a9f4',
      card: '#333333',
    },
    white: undefined,
    background: undefined,
    primary: undefined,
    alert: undefined,
    text: undefined,
    secondary: undefined
  },
  fontSizes: {
    tiny: 10,
    small: 12,
    medium: 16,
    large: 22,
    xlarge: 28,
    extraLarge: 36,
  },
  spacing: {
    none: 0,
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  radius: {
    small: 6,
    medium: 10,
    large: 16,
    pill: 999,
  },
};

export default theme;
