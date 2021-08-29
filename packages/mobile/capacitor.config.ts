import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.todaylist.today',
  appName: 'Today',
  bundledWebRuntime: false,
  webDir: 'public',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  ios: {
    scheme: 'Today',
  },
  cordova: {},
  server: {
    ...(process.env.NODE_ENV !== 'production' && {
      url: 'http://192.168.0.15:5001/',
    }),
    cleartext: true,
  },
};

export default config;
