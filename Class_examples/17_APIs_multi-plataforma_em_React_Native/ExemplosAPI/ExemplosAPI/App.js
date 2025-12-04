import { StyleSheet, Text, View } from "react-native";
import AlertExample from "./src/AlertExample";
import AppStateExample from "./src/AppStateExample";
import DimensionsExample from "./src/DimensionsExample";
import KeyboardExample from "./src/KeyboardExample";
import PanResponderExample from "./src/PanResponderExample";
import LocationExample from "./src/LocationExample";

export default function App() {
  return (
    <View style={styles.container}>
      <AlertExample />
      {/* <AppStateExample /> */}
      {/* <DimensionsExample /> */}
      {/* <KeyboardExample /> */}
      {/* <PanResponderExample /> */}
      {/* <LocationExample /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
