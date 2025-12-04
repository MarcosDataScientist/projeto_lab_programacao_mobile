import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ClienteItem({ cliente, onPress, onDelete }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemNome}>{cliente.nome}</Text>

        <View style={styles.buttonsContainer}>
          <Pressable onPress={onPress} style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.itemEmail}>{cliente.email}</Text>
      {cliente.idade && (
        <Text style={styles.itemIdade}>{cliente.idade} anos</Text>
      )}
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
    justifyContent: "space-between", // nome à esquerda, grupo de botões à direita
    alignItems: "center",
  },
  itemNome: {
    fontSize: 18,
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemEmail: {
    color: "#4B5563",
    marginTop: 4,
  },
  itemIdade: {
    color: "#6B7280",
    marginTop: 2,
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
