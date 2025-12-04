import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function BarcodeScannerScreen({ route, navigation }) {
  const { onScan } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  function handleBarCodeScanned({ type, data }) {
    if (scanned) return;
    
    setScanned(true);
    if (onScan) {
      onScan(data);
      navigation.goBack();
    } else {
      Alert.alert("Código de Barras Escaneado", `Tipo: ${type}\nDados: ${data}`, [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
          },
        },
      ]);
    }
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>
            Acesso à câmera negado. Por favor, permita o acesso nas configurações do
            aplicativo.
          </Text>
          <Pressable
            style={styles.button}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Solicitar Permissão</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "codabar",
              "itf14",
              "datamatrix",
              "qr",
            ],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.instruction}>
            Posicione o código de barras dentro da área de leitura
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {scanned && (
          <Pressable
            style={styles.button}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Escanear Novamente</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanArea: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  instruction: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#000",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

