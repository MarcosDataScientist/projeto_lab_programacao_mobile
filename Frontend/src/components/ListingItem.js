import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ListingItem({ listing, onPress, onDelete }) {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme);
  const margin = listing.contribution_margin;
  
  // Cores da margem que funcionam bem em ambos os temas
  const marginColor = margin !== null && margin !== undefined 
    ? margin >= 30 
      ? "#10B981" // Verde (sucesso) - funciona bem em ambos os temas
      : margin >= 15 
        ? "#F59E0B" // Laranja/Amarelo - mais visível no tema escuro
        : "#EF4444" // Vermelho (erro) - funciona bem em ambos os temas
    : theme.textSecondary;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>
            {listing.product?.name || "Produto não encontrado"}
          </Text>
          <Text style={styles.itemMarketplace}>
            {listing.marketplace} - {listing.marketplace_item_id}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable onPress={onPress} style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.itemFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Preço:</Text>
          <Text style={styles.priceValue}>
            R$ {listing.price ? parseFloat(listing.price).toFixed(2) : "0.00"}
          </Text>
        </View>
        {margin !== null && margin !== undefined && (
          <View style={styles.marginContainer}>
            <Text style={styles.marginLabel}>Margem:</Text>
            <Text style={[styles.marginValue, { color: marginColor }]}>
              {margin.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  itemContainer: {
    backgroundColor: theme.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.border,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: theme.text,
  },
  itemMarketplace: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceLabel: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  priceValue: {
    color: theme.success,
    fontWeight: "600",
    fontSize: 16,
  },
  marginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  marginLabel: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  marginValue: {
    fontWeight: "600",
    fontSize: 16,
  },
  editButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  deleteButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  editText: {
    color: theme.primary,
    fontWeight: "500",
  },
  deleteText: {
    color: theme.error,
    fontWeight: "500",
  },
});

