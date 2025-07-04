const activePalette = 'light';

const theme = {
  colors: {
    primary: activePalette === 'light' ? '#1d3557' : '#121212',
    secondary: activePalette === 'light' ? '#457b9d' : '#3700b3',
    background: activePalette === 'light' ? '#f1faee' : '#181818',
    alert: activePalette === 'light' ? '#e63946' : '#f44336',
    success: activePalette === 'light' ? '#2a9d8f' : '#03dac5',
    danger: activePalette === 'light' ? '#c62828' : '#b00020',
    warning: activePalette === 'light' ? '#f4a261' : '#ff9800',
    text: activePalette === 'light' ? '#333' : '#e0e0e0',
    white: activePalette === 'light' ? '#fff' : '#ffffff',
    info: activePalette === 'light' ? '#00b4d8' : '#03a9f4',
    card: activePalette === 'light' ? '#ffffff' : '#333333',
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
  },
  fontSizes: {
    tiny: 10,
    small: 12,
    medium: 16,
    large: 22,
    xlarge: 28,
    extraLarge: 36,
    xl: 28,
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
