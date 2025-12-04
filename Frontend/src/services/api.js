import axios from "axios";
import Constants from "expo-constants";

// Lê a URL da API do arquivo .env através do app.config.js
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      return Promise.reject(error);
    } else if (error.request) {
      // Erro de rede
      return Promise.reject(new Error("Erro de conexão com o servidor"));
    } else {
      // Outro erro
      return Promise.reject(error);
    }
  }
);

