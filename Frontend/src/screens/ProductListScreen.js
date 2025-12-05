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
  const [loadingMore, setLoadingMore] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filterEstoque, setFilterEstoque] = useState("todos");
  const [allProducts, setAllProducts] = useState([]);
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

  async function loadProducts(showLoading = true, page = 1, append = false) {
    try {
      if (showLoading && !append) setLoading(true);
      if (append) setLoadingMore(true);
      
      const url = searchTerm 
        ? `/products?search=${encodeURIComponent(searchTerm)}&page=${page}&per_page=20`
        : `/products?page=${page}&per_page=20`;
      const response = await api.get(url);
      
      const { items, pagination } = response.data;
      
      if (append) {
        setAllProducts(prev => [...prev, ...items]);
      } else {
        setAllProducts(items);
      }
      
      setCurrentPage(pagination.current_page);
      setHasMore(pagination.has_next);
      setTotalPages(pagination.pages);
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
      setLoadingMore(false);
    }
  }
  
  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      loadProducts(false, nextPage, true);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setCurrentPage(1);
      setHasMore(true);
      loadProducts(true, 1, false);
    }, [])
  );
  
  useEffect(() => {
    // Resetar paginação quando o termo de busca mudar
    setCurrentPage(1);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      loadProducts(true, 1, false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Aplicar filtros aos produtos
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Filtro de estoque
    if (filterEstoque === "com_estoque") {
      filtered = filtered.filter(p => p.inventory > 0);
    } else if (filterEstoque === "sem_estoque") {
      filtered = filtered.filter(p => !p.inventory || p.inventory === 0);
    } else if (filterEstoque === "estoque_baixo") {
      filtered = filtered.filter(p => p.inventory > 0 && p.inventory < 10);
    }
    
    setProducts(filtered);
  }, [allProducts, filterEstoque]);

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    loadProducts(false, 1, false);
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

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setHidden(true, "fade");
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>

        {successMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por SKU, nome ou EAN..."
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

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Estoque:</Text>
            <View style={styles.filterButtons}>
              <Pressable
                style={[styles.filterButton, filterEstoque === "todos" && styles.filterButtonActive]}
                onPress={() => setFilterEstoque("todos")}
              >
                <Text style={[styles.filterButtonText, filterEstoque === "todos" && styles.filterButtonTextActive]}>
                  Todos
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterEstoque === "com_estoque" && styles.filterButtonActive]}
                onPress={() => setFilterEstoque("com_estoque")}
              >
                <Text style={[styles.filterButtonText, filterEstoque === "com_estoque" && styles.filterButtonTextActive]}>
                  Com estoque
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterEstoque === "sem_estoque" && styles.filterButtonActive]}
                onPress={() => setFilterEstoque("sem_estoque")}
              >
                <Text style={[styles.filterButtonText, filterEstoque === "sem_estoque" && styles.filterButtonTextActive]}>
                  Sem estoque
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterEstoque === "estoque_baixo" && styles.filterButtonActive]}
                onPress={() => setFilterEstoque("estoque_baixo")}
              >
                <Text style={[styles.filterButtonText, filterEstoque === "estoque_baixo" && styles.filterButtonTextActive]}>
                  Estoque baixo
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.product_id)}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={[
              products.length === 0 && styles.emptyListContainer,
              styles.listContent
            ]}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <Text style={styles.loadingMoreText}>Carregando mais produtos...</Text>
                </View>
              ) : null
            }
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
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
  list: {
    backgroundColor: theme.background,
  },
  listContent: {
    backgroundColor: theme.background,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: theme.textSecondary,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  loadingMoreText: {
    color: theme.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  filtersContainer: {
    marginBottom: 12,
    gap: 12,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 4,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.inputBorder,
  },
  filterButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
});

