import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'minisuper',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    LocalNotifications: {
      // Aquí puedes añadir configuraciones específicas del plugin si es necesario
    },
  }
};

export default config;


