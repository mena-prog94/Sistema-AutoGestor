import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sistema-auto-gestor',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['192.168.1.6']
    }
};

export default config;
