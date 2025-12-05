import Constants from 'expo-constants';

// Tenta pegar a URL da configuração do Expo (app.config.js)
// Se não estiver disponível, usa um valor padrão baseado na plataforma
const getApiBaseUrl = () => {
  // Primeiro tenta pegar do Expo Constants (app.config.js)
  // Isso permite configurar via .env ou app.config.js
  if (Constants.expoConfig?.extra?.apiBaseUrl) {
    return Constants.expoConfig.extra.apiBaseUrl;
  }
  
  // Fallback baseado na plataforma
  // Para Android emulador: use 10.0.2.2 para acessar localhost da máquina host
  // Para iOS simulador: use localhost
  // Para dispositivo físico: configure via .env com o IP da sua máquina na rede local
  const platform = Constants.platform;
  
  if (platform?.android) {
    // Android emulador usa 10.0.2.2 para acessar localhost da máquina host
    return "http://10.0.2.2:5000/api";
  } else if (platform?.ios) {
    // iOS simulador usa localhost
    return "http://localhost:5000/api";
  }
  
  // Fallback final (web ou outras plataformas)
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

// Log para debug (apenas em desenvolvimento)
if (__DEV__) {
  console.log('API Base URL configurada:', API_BASE_URL);
}

export default API_BASE_URL;

