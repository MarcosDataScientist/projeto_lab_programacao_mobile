import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch, Platform, StatusBar as RNStatusBar, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme, setTheme } = useTheme();
  const [config, setConfig] = useState({
    margem_minima: '15',
    margem_ideal: '30'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const styles = createStyles(theme);

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setHidden(true, "fade");
    }
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      setLoading(true);
      const response = await api.get('/configuracao');
      const data = response.data;
      setConfig({
        margem_minima: data.margem_minima?.toString() || '15',
        margem_ideal: data.margem_ideal?.toString() || '30'
      });
      // Sincronizar o tema do banco com o switch
      const shouldBeDark = data.theme === 'dark';
      if (shouldBeDark !== isDarkMode) {
        setTheme(shouldBeDark);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as configurações.");
    } finally {
      setLoading(false);
    }
  }

  async function saveTheme(themeValue) {
    try {
      const currentConfig = await api.get('/configuracao').then(res => res.data);
      await api.put('/configuracao', {
        theme: themeValue,
        margem_minima: currentConfig.margem_minima || 15,
        margem_ideal: currentConfig.margem_ideal || 30
      });
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  }

  async function handleToggleTheme() {
    const newTheme = isDarkMode ? 'light' : 'dark';
    toggleTheme();
    await saveTheme(newTheme);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSuccessMessage("");
      
      const payload = {
        theme: isDarkMode ? 'dark' : 'light',
        margem_minima: parseFloat(config.margem_minima),
        margem_ideal: parseFloat(config.margem_ideal)
      };

      // Validações
      if (isNaN(payload.margem_minima) || payload.margem_minima < 0) {
        Alert.alert("Erro", "Margem mínima deve ser um número válido maior ou igual a zero.");
        return;
      }
      if (isNaN(payload.margem_ideal) || payload.margem_ideal < 0) {
        Alert.alert("Erro", "Margem ideal deve ser um número válido maior ou igual a zero.");
        return;
      }
      if (payload.margem_ideal < payload.margem_minima) {
        Alert.alert("Erro", "Margem ideal deve ser maior ou igual à margem mínima.");
        return;
      }

      await api.put('/configuracao', payload);
      setSuccessMessage("Configurações salvas com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Alert.alert("Erro", Object.values(errors).join("\n"));
      } else {
        Alert.alert("Erro", "Não foi possível salvar as configurações.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons 
                name={isDarkMode ? "dark-mode" : "light-mode"} 
                size={24} 
                color={theme.primary} 
                style={styles.settingIcon}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Modo Escuro</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode 
                    ? "Tema escuro ativado" 
                    : "Tema claro ativado"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkMode ? theme.surface : theme.surface}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações de Margem</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Margem Mínima (%)</Text>
            <TextInput
              style={styles.input}
              value={config.margem_minima}
              onChangeText={(text) => setConfig({ ...config, margem_minima: text })}
              placeholder="Ex: 15"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              color={theme.text}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Margem Ideal (%)</Text>
            <TextInput
              style={styles.input}
              value={config.margem_ideal}
              onChangeText={(text) => setConfig({ ...config, margem_ideal: text })}
              placeholder="Ex: 30"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              color={theme.text}
            />
          </View>

          <Pressable 
            style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Configurações</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            As configurações de margem serão usadas para filtrar anúncios no painel de anúncios.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  infoSection: {
    marginTop: "auto",
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successBanner: {
    backgroundColor: theme.success + "20",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.success,
  },
  successBannerText: {
    color: theme.success,
    fontSize: 14,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.inputBackground || theme.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.inputBorder || theme.border,
    minHeight: 44,
    color: theme.text,
  },
  saveButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

