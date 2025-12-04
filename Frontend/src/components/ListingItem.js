import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ListingItem({ listing, onPress, onDelete }) {
  const margin = listing.contribution_margin;
  const marginColor = margin !== null && margin !== undefined 
    ? margin >= 30 ? "#059669" : margin >= 15 ? "#D97706" : "#DC2626"
    : "#6B7280";

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

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
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
  },
  itemMarketplace: {
    fontSize: 12,
    color: "#6B7280",
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
    color: "#6B7280",
    fontSize: 14,
  },
  priceValue: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 16,
  },
  marginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  marginLabel: {
    color: "#6B7280",
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
    color: "#2563EB",
    fontWeight: "500",
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "500",
  },
});

