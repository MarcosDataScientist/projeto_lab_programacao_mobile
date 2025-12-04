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

  async function loadListings(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      const url = searchTerm 
        ? `/listings?search=${encodeURIComponent(searchTerm)}`
        : "/listings";
      const response = await api.get(url);
      setListings(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os anúncios.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadListings();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadListings(false);
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
            placeholder="Buscar por nome do produto..."
            placeholderTextColor={theme.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={loadListings}
            color={theme.text}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.marketplace_item_id}
            renderItem={renderItem}
            contentContainerStyle={
              listings.length === 0 && styles.emptyListContainer
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum anúncio cadastrado.</Text>
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
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: theme.textSecondary,
  },
});

