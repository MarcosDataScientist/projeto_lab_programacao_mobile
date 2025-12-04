import { View, Text, StyleSheet, Pressable, Switch, Platform, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} />
      <View style={[styles.container, { paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0 }]}>
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
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkMode ? theme.surface : theme.surface}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            O tema será aplicado em todas as telas do aplicativo.
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
});

