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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";

export default function ListingFormScreen({ route, navigation }) {
  const { mode, listing, onSuccess } = route.params || {};
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    if (Platform.OS === "android") {
      StatusBar.setHidden(true, "fade");
    }
  }, []);

  // Definir produto selecionado quando carregar produtos ou quando listing mudar
  useEffect(() => {
    if (listing?.product_id && products.length > 0) {
      const product = products.find(p => p.product_id === listing.product_id);
      if (product) {
        setSelectedProduct(product);
        setProductSearchTerm(`${product.name} (SKU: ${product.sku})`);
      }
    }
  }, [products, listing?.product_id]);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products?page=1&per_page=1000");
      // A API agora retorna { items, pagination }
      const productsData = response.data.items || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoadingProducts(false);
    }
  }

  // Filtrar produtos baseado no termo de busca
  const filteredProducts = products.filter((product) => {
    if (!productSearchTerm) return true;
    const searchLower = productSearchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower)
    );
  });

  function handleProductSelect(product) {
    setSelectedProduct(product);
    setProductId(String(product.product_id));
    setProductSearchTerm(`${product.name} (SKU: ${product.sku})`);
    setShowProductList(false);
    setErrors((prev) => ({ ...prev, product_id: null }));
  }

  function handleProductSearchChange(text) {
    setProductSearchTerm(text);
    setShowProductList(true);
    if (!text) {
      setSelectedProduct(null);
      setProductId("");
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

      // Pequeno delay para garantir que a mensagem de sucesso seja exibida
      setTimeout(() => {
        navigation.goBack();
      }, 100);
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
          onScrollBeginDrag={() => setShowProductList(false)}
        >
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
          placeholderTextColor={theme.textSecondary}
          maxLength={100}
          editable={mode !== "edit"}
          color={theme.text}
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
          <View style={styles.productSearchContainer}>
            <TextInput
              style={styles.input}
              value={productSearchTerm}
              onChangeText={handleProductSearchChange}
              onFocus={() => setShowProductList(true)}
              placeholder="Buscar produto por nome ou SKU..."
              placeholderTextColor={theme.textSecondary}
              color={theme.text}
            />
            {showProductList && productSearchTerm && filteredProducts.length > 0 && (
              <View style={styles.productListContainer}>
                {filteredProducts.slice(0, 5).map((product) => (
                  <Pressable
                    key={product.product_id}
                    style={styles.productItem}
                    onPress={() => handleProductSelect(product)}
                  >
                    <Text style={styles.productItemName}>{product.name}</Text>
                    <Text style={styles.productItemSku}>SKU: {product.sku}</Text>
                  </Pressable>
                ))}
                {filteredProducts.length > 5 && (
                  <Text style={styles.productListMore}>
                    +{filteredProducts.length - 5} mais produtos
                  </Text>
                )}
              </View>
            )}
            {showProductList && productSearchTerm && filteredProducts.length === 0 && (
              <View style={styles.productListContainer}>
                <Text style={styles.productListEmpty}>
                  Nenhum produto encontrado
                </Text>
              </View>
            )}
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
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
          color={theme.text}
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
  pickerContainer: {
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    color: theme.text,
  },
  productSearchContainer: {
    position: 'relative',
    zIndex: 1,
  },
  productListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: theme.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  productItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  productItemSku: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  productListMore: {
    padding: 12,
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  productListEmpty: {
    padding: 12,
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  loading: {
    marginVertical: 16,
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

