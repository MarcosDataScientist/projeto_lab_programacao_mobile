import { useState } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductFormScreen({ route, navigation }) {
  const { mode, product, onSuccess } = route.params || {};

  const [sku, setSku] = useState(product?.sku || "");
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState(product?.image || "");
  const [cost, setCost] = useState(
    product?.cost != null ? String(product.cost) : ""
  );
  const [inventory, setInventory] = useState(
    product?.inventory != null ? String(product.inventory) : "0"
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [calculatedMargin, setCalculatedMargin] = useState(null);
  const [testPrice, setTestPrice] = useState("");

  async function handleSave() {
    const costNumber = cost.trim() === "" ? null : parseFloat(cost);
    const inventoryNumber = inventory.trim() === "" ? 0 : parseInt(inventory);

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      cost: costNumber,
      inventory: inventoryNumber,
    };

    try {
      setSaving(true);
      setErrors({});

      if (mode === "edit" && product?.product_id) {
        await api.put(`/products/${product.product_id}`, payload);
        onSuccess?.("Produto atualizado com sucesso!");
      } else {
        await api.post("/products", payload);
        onSuccess?.("Produto cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Não foi possível salvar o produto." });
      }
    } finally {
      setSaving(false);
    }
  }

  async function calculateMargin() {
    if (!testPrice || !cost) {
      Alert.alert("Atenção", "Preencha o custo e o preço de teste.");
      return;
    }

    try {
      const price = parseFloat(testPrice);
      const costValue = parseFloat(cost);

      if (price <= 0 || costValue <= 0) {
        Alert.alert("Atenção", "Preço e custo devem ser maiores que zero.");
        return;
      }

      const margin = ((price - costValue) / price) * 100;
      setCalculatedMargin(round(margin, 2));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível calcular a margem.");
    }
  }

  function round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StatusBar style={styles.statusBar} />
        <Text style={styles.title}>
          {mode === "edit" ? "Editar Produto" : "Novo Produto"}
        </Text>
        {errors.general && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}

        <Text style={styles.label}>SKU *</Text>
        <TextInput
          style={styles.input}
          value={sku}
          onChangeText={(text) => {
            setSku(text);
            setErrors((prev) => ({ ...prev, sku: null }));
          }}
          placeholder="Código SKU"
          maxLength={50}
        />
        {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: null }));
          }}
          placeholder="Nome do produto"
          maxLength={255}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição do produto"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="https://exemplo.com/imagem.jpg"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Custo (R$)</Text>
        <TextInput
          style={styles.input}
          value={cost}
          onChangeText={(text) => {
            setCost(text);
            setCalculatedMargin(null);
          }}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Estoque</Text>
        <TextInput
          style={styles.input}
          value={inventory}
          onChangeText={setInventory}
          placeholder="0"
          keyboardType="numeric"
        />

        {/* Calculadora de Margem */}
        <View style={styles.marginCalculator}>
          <Text style={styles.sectionTitle}>Calculadora de Margem</Text>
          <Text style={styles.label}>Preço de Teste (R$)</Text>
          <TextInput
            style={styles.input}
            value={testPrice}
            onChangeText={setTestPrice}
            placeholder="Digite um preço para calcular a margem"
            keyboardType="decimal-pad"
          />
          <Pressable style={styles.calculateButton} onPress={calculateMargin}>
            <Text style={styles.calculateButtonText}>Calcular Margem</Text>
          </Pressable>
          {calculatedMargin !== null && (
            <View style={styles.marginResult}>
              <Text style={styles.marginLabel}>Margem de Contribuição:</Text>
              <Text style={styles.marginValue}>{calculatedMargin}%</Text>
            </View>
          )}
        </View>

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statusBar: {
    barStyle: "light-content",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorBannerText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  marginCalculator: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  calculateButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  calculateButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  marginResult: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
    alignItems: "center",
  },
  marginLabel: {
    fontSize: 14,
    color: "#065F46",
    marginBottom: 4,
  },
  marginValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#065F46",
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

