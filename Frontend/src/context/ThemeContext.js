import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const lightTheme = {
  background: "#F3F4F6",
  surface: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#D1D5DB",
  primary: "#1A237E",
  success: "#10B981",
  error: "#EF4444",
  headerBackground: "#1A237E",
  headerText: "#FFFFFF",
  inputBackground: "#FFFFFF",
  inputBorder: "#D1D5DB",
  tabBarBackground: "#FFFFFF",
  tabBarBorder: "#E5E7EB",
};

export const darkTheme = {
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  border: "#374151",
  primary: "#3B82F6",
  success: "#10B981",
  error: "#EF4444",
  headerBackground: "#1F2937",
  headerText: "#FFFFFF",
  inputBackground: "#374151",
  inputBorder: "#4B5563",
  tabBarBackground: "#1F2937",
  tabBarBorder: "#374151",
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // Buscar o tema do banco de dados na inicialização
  useEffect(() => {
    loadThemeFromDatabase();
  }, []);

  async function loadThemeFromDatabase() {
    try {
      const response = await api.get('/configuracao');
      const data = response.data;
      // Se o tema no banco for 'dark', ativar o dark mode
      const shouldBeDark = data.theme === 'dark';
      setIsDarkMode(shouldBeDark);
    } catch (error) {
      // Em caso de erro, manter o tema padrão (light)
      console.error("Erro ao carregar tema do banco:", error);
      setIsDarkMode(false);
    } finally {
      setIsLoadingTheme(false);
    }
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setTheme = (dark) => {
    setIsDarkMode(dark);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme, isLoadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};



