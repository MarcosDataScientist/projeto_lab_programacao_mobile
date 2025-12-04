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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../services/api";
import ProductItem from "../components/ProductItem";

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const timeoutRef = useRef(null);

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
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
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
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <View style={styles.container}>
        <StatusBar style={styles.statusBar} />
        <View style={styles.header}>
          <Text style={styles.title}>Produtos</Text>
          <Pressable style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Novo</Text>
          </Pressable>
        </View>

        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por SKU, nome ou código de barras..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={loadProducts}
          />
          <Pressable style={styles.scanButton} onPress={handleScanBarcode}>
            <Text style={styles.scanButtonText}>📷</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
  },
  statusBar: {
    barStyle: "light-content",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  successBannerText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  scanButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 20,
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
    color: "#6B7280",
  },
});

