const path = require('path');
const fs = require('fs');

// Tentar ler o .env manualmente se dotenv não funcionar
// Valores padrão para desenvolvimento:
// - Android emulador: http://10.0.2.2:5000/api
// - iOS simulador: http://localhost:5000/api
// - Dispositivo físico: http://SEU_IP_LOCAL:5000/api (ex: http://192.168.1.100:5000/api)
let apiBaseUrl = "http://localhost:5000/api";

const envPath = path.resolve(__dirname, '.env');

// Tentar com dotenv primeiro
require('dotenv').config({ path: envPath });

// Se não funcionou, ler manualmente
if (!process.env.API_BASE_URL) {
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key.trim() === 'API_BASE_URL') {
            apiBaseUrl = valueParts.join('=').trim();
            break;
          }
        }
      }
    }
  } catch (error) {
    // Silenciosamente usa o valor padrão
  }
} else {
  apiBaseUrl = process.env.API_BASE_URL;
}

module.exports = {
  expo: {
    name: "Frontend",
    slug: "Frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      navigationBar: {
        backgroundColor: "#00000000",
        barStyle: "light-content"
      },
      statusBar: {
        backgroundColor: "#00000000",
        barStyle: "dark-content",
        translucent: true
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: apiBaseUrl
    }
  }
};

