import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StatusBar,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import ProductItem from "../components/ProductItem";

export default function ProductListScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef(null);
  const styles = createStyles(theme);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function showSuccess(message) {
    setSuccessMessage(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  }

  async function loadProducts(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      const url = searchTerm 
        ? `/products?search=${encodeURIComponent(searchTerm)}`
        : "/products";
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      let errorMessage = "Não foi possível carregar os produtos.";
      
      if (error.message) {
        errorMessage += `\n\nErro: ${error.message}`;
      }
      
      if (error.response) {
        errorMessage += `\nStatus: ${error.response.status}`;
        errorMessage += `\nMensagem: ${error.response.data?.error || error.response.data?.message || "Erro desconhecido"}`;
      } else if (error.request) {
        errorMessage += "\n\nVerifique se o backend está rodando e se a URL da API está correta no arquivo .env";
      }
      
      Alert.alert("Erro ao Carregar Produtos", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts(false);
  };

  function handleAdd() {
    navigation.navigate("ProductForm", {
      mode: "create",
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  function handleEdit(product) {
    navigation.navigate("ProductForm", {
      mode: "edit",
      product,
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  function handleScanBarcode() {
    navigation.navigate("BarcodeScanner", {
      onScan: (barcode) => {
        setSearchTerm(barcode);
      },
    });
  }

  async function deleteProduct(product) {
    try {
      await api.delete(`/products/${product.product_id}`);
      setProducts((prev) => prev.filter((p) => p.product_id !== product.product_id));
      showSuccess("Produto excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    }
  }

  async function handleDelete(product) {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o produto "${product.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteProduct(product);
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <ProductItem
        product={item}
        onPress={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={[styles.container, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} translucent={true} />

        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por SKU, nome ou código de barras..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={loadProducts}
            color={theme.text}
          />
          <Pressable style={styles.scanButton} onPress={handleScanBarcode}>
            <MaterialCommunityIcons name="barcode-scan" size={24} color="#FFF" />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.product_id)}
            renderItem={renderItem}
            contentContainerStyle={
              products.length === 0 && styles.emptyListContainer
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        
        <Pressable style={styles.fabButton} onPress={handleAdd}>
          <MaterialIcons name="add" size={28} color="#FFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  successBanner: {
    backgroundColor: theme.success + "20",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.success,
  },
  successBannerText: {
    color: theme.success,
    fontSize: 14,
    fontWeight: "500",
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.success,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    minHeight: 44,
    color: theme.text,
  },
  scanButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    marginTop: 32,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: theme.textSecondary,
  },
});

