import { useState, useEffect } from "react";
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
  FlatList,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

export default function OrderCalculatorScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoadingProducts(false);
    }
  }

  function addItem() {
    if (!selectedProductId || !quantity || !price) {
      Alert.alert("Atenção", "Preencha todos os campos para adicionar um item.");
      return;
    }

    const product = products.find((p) => p.product_id === parseInt(selectedProductId));
    if (!product) {
      Alert.alert("Erro", "Produto não encontrado.");
      return;
    }

    const newItem = {
      product_id: parseInt(selectedProductId),
      product_name: product.name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProductId("");
    setQuantity("1");
    setPrice("");
    setResult(null);
  }

  function removeItem(index) {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
    setResult(null);
  }

  async function calculateOrder() {
    if (orderItems.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos um item ao pedido.");
      return;
    }

    try {
      setCalculating(true);
      const payload = {
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await api.post("/order-calculator/calculate", payload);
      setResult(response.data);
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível calcular a margem do pedido."
      );
    } finally {
      setCalculating(false);
    }
  }

  function clearAll() {
    setOrderItems([]);
    setResult(null);
    setSelectedProductId("");
    setQuantity("1");
    setPrice("");
  }

  function renderOrderItem({ item, index }) {
    return (
      <View style={styles.orderItem}>
        <View style={styles.orderItemInfo}>
          <Text style={styles.orderItemName}>{item.product_name}</Text>
          <Text style={styles.orderItemDetails}>
            Qtd: {item.quantity} × R$ {item.price.toFixed(2)} = R${" "}
            {(item.quantity * item.price).toFixed(2)}
          </Text>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={() => removeItem(index)}
        >
          <Text style={styles.removeButtonText}>Remover</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <ScrollView style={styles.container}>
        <StatusBar style={styles.statusBar} />
        <Text style={styles.title}>Calculadora de Margem de Pedido</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adicionar Item</Text>

          <Text style={styles.label}>Produto *</Text>
          {loadingProducts ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProductId}
                onValueChange={(itemValue) => setSelectedProductId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um produto" value="" />
                {products.map((product) => (
                  <Picker.Item
                    key={product.product_id}
                    label={`${product.name} (SKU: ${product.sku})`}
                    value={String(product.product_id)}
                  />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>Quantidade *</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Preço Unitário (R$) *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <Pressable style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Adicionar Item</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Itens do Pedido</Text>
            {orderItems.length > 0 && (
              <Pressable style={styles.clearButton} onPress={clearAll}>
                <Text style={styles.clearButtonText}>Limpar</Text>
              </Pressable>
            )}
          </View>

          {orderItems.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum item adicionado.</Text>
          ) : (
            <FlatList
              data={orderItems}
              keyExtractor={(item, index) => String(index)}
              renderItem={renderOrderItem}
              scrollEnabled={false}
            />
          )}
        </View>

        {orderItems.length > 0 && (
          <Pressable
            style={[styles.calculateButton, calculating && styles.buttonDisabled]}
            onPress={calculateOrder}
            disabled={calculating}
          >
            <Text style={styles.calculateButtonText}>
              {calculating ? "Calculando..." : "Calcular Margem do Pedido"}
            </Text>
          </Pressable>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Resultado do Cálculo</Text>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Custo Total:</Text>
                <Text style={styles.summaryValue}>
                  R$ {result.summary.total_cost.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Receita Total:</Text>
                <Text style={styles.summaryValue}>
                  R$ {result.summary.total_revenue.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Lucro Total:</Text>
                <Text style={styles.summaryValue}>
                  R$ {result.summary.total_profit.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.marginRow]}>
                <Text style={styles.summaryLabel}>Margem de Contribuição:</Text>
                <Text
                  style={[
                    styles.marginValue,
                    {
                      color:
                        result.summary.contribution_margin >= 30
                          ? "#059669"
                          : result.summary.contribution_margin >= 15
                          ? "#D97706"
                          : "#DC2626",
                    },
                  ]}
                >
                  {result.summary.contribution_margin.toFixed(2)}%
                </Text>
              </View>
            </View>

            <Text style={styles.detailsTitle}>Detalhes por Item:</Text>
            {result.order_items.map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailItemName}>{item.product_name}</Text>
                <Text style={styles.detailItemText}>
                  Qtd: {item.quantity} | Preço: R$ {item.unit_price.toFixed(2)} | Custo: R${" "}
                  {item.unit_cost.toFixed(2)}
                </Text>
                <Text style={styles.detailItemText}>
                  Receita: R$ {item.total_revenue.toFixed(2)} | Custo Total: R${" "}
                  {item.total_cost.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.detailMargin,
                    {
                      color:
                        item.contribution_margin >= 30
                          ? "#059669"
                          : item.contribution_margin >= 15
                          ? "#D97706"
                          : "#DC2626",
                    },
                  ]}
                >
                  Margem: {item.contribution_margin.toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
  },
  statusBar: {
    barStyle: "light-content",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  pickerContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 4,
  },
  picker: {
    height: 50,
  },
  loading: {
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 14,
    color: "#6B7280",
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeButtonText: {
    color: "#DC2626",
    fontWeight: "500",
  },
  calculateButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  calculateButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  marginRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  marginValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  detailItem: {
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  detailItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailItemText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailMargin: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
});

