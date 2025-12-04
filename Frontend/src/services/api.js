import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

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

