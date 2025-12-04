import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ProductItem({ product, onPress, onDelete }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{product.name}</Text>
          <Text style={styles.itemSku}>SKU: {product.sku}</Text>
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

      {product.description && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {product.description}
        </Text>
      )}

      <View style={styles.itemFooter}>
        {product.cost && (
          <Text style={styles.itemCost}>Custo: R$ {parseFloat(product.cost).toFixed(2)}</Text>
        )}
        {product.inventory !== undefined && (
          <Text style={styles.itemInventory}>Estoque: {product.inventory}</Text>
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
  itemSku: {
    fontSize: 12,
    color: "#6B7280",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemDescription: {
    color: "#4B5563",
    marginBottom: 8,
    fontSize: 14,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  itemCost: {
    color: "#059669",
    fontWeight: "500",
    fontSize: 14,
  },
  itemInventory: {
    color: "#6B7280",
    fontSize: 14,
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

