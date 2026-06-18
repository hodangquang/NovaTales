import { Platform } from 'react-native';

export const LiteraryColors = {
  light: {
    text: '#1c1b1b',
    textSecondary: '#4a4453',
    background: '#fcf9f8',
    surface: '#fcf9f8',
    surfaceContainer: '#f0eded',
    surfaceContainerLow: '#f6f3f2',
    surfaceContainerHigh: '#eae7e7',
    surfaceContainerLowest: '#ffffff',
    backgroundElement: '#f0eded',
    backgroundSelected: '#eae7e7',
    primary: '#420093',
    primaryContainer: '#5b21b6',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#c7aaff',
    primaryFixed: '#ebddff',
    onPrimaryFixed: '#250059',
    secondary: '#635e4f',
    secondaryContainer: '#eae2ce',
    secondaryFixed: '#eae2ce',
    tertiary: '#690031',
    tertiaryFixed: '#ffd9e1',
    outline: '#7b7485',
    outlineVariant: '#ccc3d6',
    error: '#ba1a1a',
    sepiaBackground: '#f4ecd8',
    sepiaText: '#5b4636',
  },
  dark: {
    text: '#e5e2e1',
    textSecondary: '#cac4d4',
    background: '#131313',
    surface: '#131313',
    surfaceContainer: '#201f1f',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerLowest: '#0e0e0e',
    backgroundElement: '#201f1f',
    backgroundSelected: '#2a2a2a',
    primary: '#cebdff',
    primaryContainer: '#a78bfa',
    onPrimary: '#381385',
    onPrimaryContainer: '#3c1989',
    primaryFixed: '#e8ddff',
    onPrimaryFixed: '#21005e',
    secondary: '#c3c7cd',
    secondaryContainer: '#454a4f',
    secondaryFixed: '#dfe3e9',
    tertiary: '#dbc839',
    tertiaryFixed: '#f8e454',
    outline: '#948e9d',
    outlineVariant: '#494552',
    error: '#ffb4ab',
    sepiaBackground: '#3d3428',
    sepiaText: '#d4c4a8',
  },
} as const;

export const Colors = LiteraryColors;

export type ThemeColor = keyof typeof LiteraryColors.light & keyof typeof LiteraryColors.dark;
export type ColorScheme = keyof typeof LiteraryColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'Hanken Grotesk, system-ui, sans-serif',
    serif: 'EB Garamond, Georgia, serif',
    rounded: 'system-ui',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  marginMobile: 20,
  gutter: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 32,
  readingInset: 24,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
