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
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import ListingItem from "../components/ListingItem";

export default function ListingScreen({ navigation }) {
  const { theme, isDarkMode } = useTheme();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filterMargem, setFilterMargem] = useState("todos");
  const [allListings, setAllListings] = useState([]);
  const [config, setConfig] = useState({ margem_minima: 15, margem_ideal: 30 });
  const timeoutRef = useRef(null);
  const styles = createStyles(theme);

  useEffect(() => {
    loadConfig();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function loadConfig() {
    try {
      const response = await api.get('/configuracao');
      const data = response.data;
      setConfig({
        margem_minima: data.margem_minima || 15,
        margem_ideal: data.margem_ideal || 30
      });
    } catch (error) {
      // Usar valores padrão se não conseguir carregar
      console.error("Erro ao carregar configurações:", error);
    }
  }

  function showSuccess(message) {
    setSuccessMessage(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  }

  async function loadListings(showLoading = true, page = 1, append = false) {
    try {
      if (showLoading && !append) setLoading(true);
      if (append) setLoadingMore(true);
      
      const url = searchTerm 
        ? `/listings?search=${encodeURIComponent(searchTerm)}&page=${page}&per_page=20`
        : `/listings?page=${page}&per_page=20`;
      const response = await api.get(url);
      
      const { items, pagination } = response.data;
      
      if (append) {
        setAllListings(prev => [...prev, ...items]);
      } else {
        setAllListings(items);
      }
      
      setCurrentPage(pagination.current_page);
      setHasMore(pagination.has_next);
      setTotalPages(pagination.pages);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os anúncios.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }
  
  const loadMoreListings = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      loadListings(false, nextPage, true);
    }
  }
  
  useEffect(() => {
    // Resetar paginação quando o termo de busca mudar
    setCurrentPage(1);
    setHasMore(true);
    const timeoutId = setTimeout(() => {
      loadListings(true, 1, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Aplicar filtros aos anúncios
  useEffect(() => {
    let filtered = [...allListings];
    
    // Filtro de margem usando valores da configuração
    if (filterMargem === "abaixo_minima") {
      filtered = filtered.filter(l => {
        const margin = l.contribution_margin;
        return margin !== null && margin !== undefined && margin < config.margem_minima;
      });
    } else if (filterMargem === "entre_minima_ideal") {
      filtered = filtered.filter(l => {
        const margin = l.contribution_margin;
        return margin !== null && margin !== undefined && 
               margin >= config.margem_minima && margin < config.margem_ideal;
      });
    } else if (filterMargem === "acima_ideal") {
      filtered = filtered.filter(l => {
        const margin = l.contribution_margin;
        return margin !== null && margin !== undefined && margin >= config.margem_ideal;
      });
    } else if (filterMargem === "sem_margem") {
      filtered = filtered.filter(l => l.contribution_margin === null || l.contribution_margin === undefined);
    }
    
    setListings(filtered);
  }, [allListings, filterMargem, config]);

  useFocusEffect(
    useCallback(() => {
      setCurrentPage(1);
      setHasMore(true);
      setFilterMargem("todos");
      loadListings(true, 1, false);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    setFilterMargem("todos");
    loadListings(false, 1, false);
  };

  function handleAdd() {
    navigation.navigate("ListingForm", {
      mode: "create",
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  function handleEdit(listing) {
    navigation.navigate("ListingForm", {
      mode: "edit",
      listing,
      onSuccess: (msg) => showSuccess(msg),
    });
  }

  async function deleteListing(listing) {
    try {
      await api.delete(`/listings/${listing.marketplace_item_id}`);
      setListings((prev) =>
        prev.filter(
          (l) => l.marketplace_item_id !== listing.marketplace_item_id
        )
      );
      showSuccess("Anúncio excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o anúncio.");
    }
  }

  async function handleDelete(listing) {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o anúncio "${listing.marketplace_item_id}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteListing(listing);
          },
        },
      ]
    );
  }

  function renderItem({ item }) {
    return (
      <ListingItem
        listing={item}
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
            placeholder="Buscar por nome do produto..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={loadListings}
            color={theme.text}
          />
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Margem:</Text>
            <View style={styles.filterButtons}>
              <Pressable
                style={[styles.filterButton, filterMargem === "todos" && styles.filterButtonActive]}
                onPress={() => setFilterMargem("todos")}
              >
                <Text style={[styles.filterButtonText, filterMargem === "todos" && styles.filterButtonTextActive]}>
                  Todos
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterMargem === "abaixo_minima" && styles.filterButtonActive]}
                onPress={() => setFilterMargem("abaixo_minima")}
              >
                <Text style={[styles.filterButtonText, filterMargem === "abaixo_minima" && styles.filterButtonTextActive]}>
                  {`Abaixo mínima (<${config.margem_minima.toFixed(1)}%)`}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterMargem === "entre_minima_ideal" && styles.filterButtonActive]}
                onPress={() => setFilterMargem("entre_minima_ideal")}
              >
                <Text style={[styles.filterButtonText, filterMargem === "entre_minima_ideal" && styles.filterButtonTextActive]}>
                  {`Entre mínima e ideal (${config.margem_minima.toFixed(1)}-${config.margem_ideal.toFixed(1)}%)`}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterMargem === "acima_ideal" && styles.filterButtonActive]}
                onPress={() => setFilterMargem("acima_ideal")}
              >
                <Text style={[styles.filterButtonText, filterMargem === "acima_ideal" && styles.filterButtonTextActive]}>
                  {`Acima ideal (≥${config.margem_ideal.toFixed(1)}%)`}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterButton, filterMargem === "sem_margem" && styles.filterButtonActive]}
                onPress={() => setFilterMargem("sem_margem")}
              >
                <Text style={[styles.filterButtonText, filterMargem === "sem_margem" && styles.filterButtonTextActive]}>
                  Sem margem
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.marketplace_item_id}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={[
              listings.length === 0 && styles.emptyListContainer,
              styles.listContent
            ]}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum anúncio cadastrado.</Text>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <Text style={styles.loadingMoreText}>Carregando mais anúncios...</Text>
                </View>
              ) : null
            }
            onEndReached={loadMoreListings}
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
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    minHeight: 44,
    color: theme.text,
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

