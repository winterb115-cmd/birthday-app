import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { rescheduleAllNotifications } from '@/src/services/NotificationScheduler';
import {
    initializeDefaultSettings,
    loadSettings,
    saveSettings,
} from '@/src/services/NotificationSettingsManager';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // App initialization: request permissions, load/initialize settings, schedule notifications
  useEffect(() => {
    if (!loaded) return;

    async function initialize() {
      // Request notification permissions (app works even if denied)
      try {
        await Notifications.requestPermissionsAsync();
      } catch {
        // Permission request failed — continue without notifications
      }

      // Load settings and initialize if needed
      try {
        const settings = await loadSettings();

        if (!settings.isInitialized) {
          const defaultSettings = initializeDefaultSettings();
          await saveSettings(defaultSettings);
          await rescheduleAllNotifications(defaultSettings);
        } else {
          await rescheduleAllNotifications(settings);
        }
      } catch {
        // Initialization failed — app still works, notifications may not fire
        console.error('App initialization failed');
      }
    }

    initialize();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
