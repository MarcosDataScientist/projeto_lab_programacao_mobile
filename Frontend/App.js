import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

import ProductListScreen from "./src/screens/ProductListScreen";
import ProductFormScreen from "./src/screens/ProductFormScreen";
import ListingScreen from "./src/screens/ListingScreen";
import ListingFormScreen from "./src/screens/ListingFormScreen";
import OrderCalculatorScreen from "./src/screens/OrderCalculatorScreen";
import BarcodeScannerScreen from "./src/screens/BarcodeScannerScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: "600" },
        animation: 'slide_from_right',
        animationDuration: 300,
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        freezeOnBlur: false,
        fullScreenGestureEnabled: true,
        presentation: 'card',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ 
          title: "Produtos",
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={({ route }) => ({ 
          title: "Produto",
          animation: 'slide_from_right',
          animationDuration: 300,
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.headerText,
        })}
      />
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScannerScreen}
        options={{ title: "Escanear Código de Barras" }}
      />
    </Stack.Navigator>
  );
}

function ListingsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: "600" },
        animation: 'slide_from_right',
        animationDuration: 300,
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        freezeOnBlur: false,
        fullScreenGestureEnabled: true,
        presentation: 'card',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="ListingList"
        component={ListingScreen}
        options={{ 
          title: "Anúncios",
        }}
      />
      <Stack.Screen
        name="ListingForm"
        component={ListingFormScreen}
        options={({ route }) => ({ 
          title: "Anúncio",
          animation: 'slide_from_right',
          animationDuration: 300,
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.headerText,
        })}
      />
    </Stack.Navigator>
  );
}

function OrderCalculatorStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="OrderCalculator"
        component={OrderCalculatorScreen}
        options={{ title: "Calculadora de Pedido" }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Configurações" }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { theme } = useTheme();
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.background,
          text: theme.text,
          border: theme.border,
          notification: theme.error,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopWidth: 1,
            borderTopColor: theme.tabBarBorder,
          },
        }}
      >
        <Tab.Screen
          name="ProductsTab"
          component={ProductsStack}
          options={{
            title: "Produtos",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="inventory" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ListingsTab"
          component={ListingsStack}
          options={{
            title: "Anúncios",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="store" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="CalculatorTab"
          component={OrderCalculatorStack}
          options={{
            title: "Calculadora",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="calculate" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{
            title: "Configurações",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size || 24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function AppWithTheme() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      // Esconder a barra de status
      RNStatusBar.setHidden(true, "fade");
      // Configurar barra de navegação para ficar transparente e escondida
      NavigationBar.setBackgroundColorAsync("#00000000");
      NavigationBar.setButtonStyleAsync(isDarkMode ? "light" : "dark");
      // Esconder a barra de navegação (modo imersivo)
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, [isDarkMode]);

  return (
    <>
      <StatusBar hidden={true} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}
