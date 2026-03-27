import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.houselens.app',
  appName: 'HouseLens',
  webDir: 'out',
  server: {
    // Allow loading from houselens.io API in the native app
    allowNavigation: ['houselens.io', '*.houselens.io'],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
    },
  },
};

export default config;
