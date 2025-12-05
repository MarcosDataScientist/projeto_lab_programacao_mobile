import { useState, useEffect, useMemo } from "react";
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
import { useTheme } from "../context/ThemeContext";

export default function ProductFormScreen({ route, navigation }) {
  const { mode, product, onSuccess } = route.params || {};
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setHidden(true, "fade");
    }
  }, []);

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
  const [ean, setEan] = useState(product?.ean || "");
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
      ean: ean.trim() || null,
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

      // Pequeno delay para garantir que a mensagem de sucesso seja exibida
      setTimeout(() => {
        navigation.goBack();
      }, 100);
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
          removeClippedSubviews={false}
          bounces={false}
        >
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
          placeholderTextColor={theme.textSecondary}
          maxLength={50}
          color={theme.text}
        />
        {errors.sku && <Text style={styles.errorText}>{errors.sku}</Text>}

        <Text style={styles.label}>EAN (Código de Barras)</Text>
        <TextInput
          style={styles.input}
          value={ean}
          onChangeText={(text) => {
            setEan(text);
            setErrors((prev) => ({ ...prev, ean: null }));
          }}
          placeholder="Código EAN"
          placeholderTextColor={theme.textSecondary}
          maxLength={20}
          keyboardType="numeric"
          color={theme.text}
        />
        {errors.ean && <Text style={styles.errorText}>{errors.ean}</Text>}

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: null }));
          }}
          placeholder="Nome do produto"
          placeholderTextColor={theme.textSecondary}
          maxLength={255}
          color={theme.text}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição do produto"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          color={theme.text}
        />

        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="https://exemplo.com/imagem.jpg"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          color={theme.text}
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
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
          color={theme.text}
        />

        <Text style={styles.label}>Estoque</Text>
        <TextInput
          style={styles.input}
          value={inventory}
          onChangeText={setInventory}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          color={theme.text}
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
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            color={theme.text}
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

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    color: theme.text,
  },
  errorBanner: {
    backgroundColor: theme.error + "20",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.error,
  },
  errorBannerText: {
    color: theme.error,
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: theme.error,
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: theme.text,
  },
  input: {
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    color: theme.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  marginCalculator: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: theme.text,
  },
  calculateButton: {
    backgroundColor: theme.success,
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
    backgroundColor: theme.success + "20",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.success,
  },
  marginLabel: {
    fontSize: 14,
    color: theme.success,
    marginBottom: 4,
    fontWeight: "500",
  },
  marginValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.success,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: theme.primary,
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

