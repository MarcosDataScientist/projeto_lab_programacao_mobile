import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClienteListScreen from "./src/screens/ClienteListScreen";
import ClienteFormScreen from "./src/screens/ClienteFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ClienteList"
        screenOptions={{
          headerStyle: { backgroundColor: "#1A237E" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen
          name="ClienteList"
          component={ClienteListScreen}
          options={{ title: "Gerenciamento de Clientes" }}
        />
        <Stack.Screen
          name="ClienteForm"
          component={ClienteFormScreen}
          options={{ title: "Gerenciamento de Clientes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
