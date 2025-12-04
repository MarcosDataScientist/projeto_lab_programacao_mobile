import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProductListScreen from "./src/screens/ProductListScreen";
import ProductFormScreen from "./src/screens/ProductFormScreen";
import ListingScreen from "./src/screens/ListingScreen";
import ListingFormScreen from "./src/screens/ListingFormScreen";
import OrderCalculatorScreen from "./src/screens/OrderCalculatorScreen";
import BarcodeScannerScreen from "./src/screens/BarcodeScannerScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A237E" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: "Produtos" }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{ title: "Produto" }}
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A237E" },
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="ListingList"
        component={ListingScreen}
        options={{ title: "Anúncios" }}
      />
      <Stack.Screen
        name="ListingForm"
        component={ListingFormScreen}
        options={{ title: "Anúncio" }}
      />
    </Stack.Navigator>
  );
}

function OrderCalculatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1A237E" },
        headerTintColor: "#FFF",
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#1A237E",
          tabBarInactiveTintColor: "#6B7280",
          tabBarStyle: {
            backgroundColor: "#FFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          },
        }}
      >
        <Tab.Screen
          name="ProductsTab"
          component={ProductsStack}
          options={{
            title: "Produtos",
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="ListingsTab"
          component={ListingsStack}
          options={{
            title: "Anúncios",
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="CalculatorTab"
          component={OrderCalculatorStack}
          options={{
            title: "Calculadora",
            tabBarIcon: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
