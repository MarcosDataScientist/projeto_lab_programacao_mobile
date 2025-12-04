import { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function ListingFormScreen({ route, navigation }) {
  const { mode, listing, onSuccess } = route.params || {};

  const [marketplaceItemId, setMarketplaceItemId] = useState(
    listing?.marketplace_item_id || ""
  );
  const [price, setPrice] = useState(
    listing?.price != null ? String(listing.price) : ""
  );
  const [marketplace, setMarketplace] = useState(
    listing?.marketplace || "Mercado Livre"
  );
  const [productId, setProductId] = useState(
    listing?.product_id ? String(listing.product_id) : ""
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleSave() {
    const priceNumber = price.trim() === "" ? null : parseFloat(price);
    const productIdNumber = productId.trim() === "" ? null : parseInt(productId);

    const payload = {
      marketplace_item_id: marketplaceItemId.trim(),
      price: priceNumber,
      marketplace: marketplace.trim(),
      product_id: productIdNumber,
    };

    try {
      setSaving(true);
      setErrors({});

      if (mode === "edit" && listing?.marketplace_item_id) {
        await api.put(`/listings/${listing.marketplace_item_id}`, payload);
        onSuccess?.("Anúncio atualizado com sucesso!");
      } else {
        await api.post("/listings", payload);
        onSuccess?.("Anúncio cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.error || "Não foi possível salvar o anúncio.",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <ScrollView style={styles.container}>
        <StatusBar style={styles.statusBar} />
        <Text style={styles.title}>
          {mode === "edit" ? "Editar Anúncio" : "Novo Anúncio"}
        </Text>
        {errors.general && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}

        <Text style={styles.label}>ID do Marketplace *</Text>
        <TextInput
          style={styles.input}
          value={marketplaceItemId}
          onChangeText={(text) => {
            setMarketplaceItemId(text);
            setErrors((prev) => ({ ...prev, marketplace_item_id: null }));
          }}
          placeholder="Ex: MLB123456789"
          maxLength={100}
          editable={mode !== "edit"}
        />
        {errors.marketplace_item_id && (
          <Text style={styles.errorText}>{errors.marketplace_item_id}</Text>
        )}

        <Text style={styles.label}>Marketplace *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={marketplace}
            onValueChange={(itemValue) => setMarketplace(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Mercado Livre" value="Mercado Livre" />
            <Picker.Item label="Amazon" value="Amazon" />
            <Picker.Item label="Magazine Luiza" value="Magazine Luiza" />
            <Picker.Item label="Americanas" value="Americanas" />
            <Picker.Item label="Casas Bahia" value="Casas Bahia" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>
        {errors.marketplace && (
          <Text style={styles.errorText}>{errors.marketplace}</Text>
        )}

        <Text style={styles.label}>Produto *</Text>
        {loadingProducts ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={productId}
              onValueChange={(itemValue) => setProductId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um produto" value="" />
              {products.map((product) => (
                <Picker.Item
                  key={product.product_id}
                  label={`${product.name} (SKU: ${product.sku})`}
                  value={String(product.product_id)}
                />
              ))}
            </Picker>
          </View>
        )}
        {errors.product_id && (
          <Text style={styles.errorText}>{errors.product_id}</Text>
        )}

        <Text style={styles.label}>Preço (R$) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={(text) => {
            setPrice(text);
            setErrors((prev) => ({ ...prev, price: null }));
          }}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
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
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 4,
  },
  picker: {
    height: 50,
  },
  loading: {
    marginVertical: 16,
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

