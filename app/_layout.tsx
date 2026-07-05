import { DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Palette } from '@/constants/theme';
import { MatchesProvider } from '@/store/matches';

export const unstable_settings = {
  anchor: '(tabs)',
};

const PeachTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.peachDeep,
    background: Palette.background,
    card: Palette.card,
    text: Palette.text,
    border: Palette.border,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={PeachTheme}>
        <MatchesProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </MatchesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
