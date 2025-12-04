import { useState } from "react";
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { api } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClienteFormScreen({ route, navigation }) {
  const { mode, cliente, onSuccess } = route.params || {};

  const [nome, setNome] = useState(cliente?.nome || "");
  const [email, setEmail] = useState(cliente?.email || "");
  const [idade, setIdade] = useState(
    cliente?.idade != null ? String(cliente.idade) : ""
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSave() {
    const idadeNumber = idade.trim() === "" ? null : Number(idade);

    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      idade: idadeNumber,
    };

    try {
      setSaving(true);

      if (mode === "edit" && cliente?.id) {
        await api.put(`/clientes/${cliente.id}`, payload);
        onSuccess?.("Cliente atualizado com sucesso!");
      } else {
        await api.post("/clientes", payload);
        onSuccess?.("Cliente cadastrado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Não foi possível salvar o cliente." });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
      <View style={styles.container}>
        <StatusBar style={styles.statusBar} />
        <Text style={styles.title}>
          {mode === "edit" ? "Editar Cliente" : "Novo Cliente"}
        </Text>
        {errors.general && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errors.general}</Text>
          </View>
        )}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setErrors((prev) => ({ ...prev, nome: null }));
          }}
          placeholder="Nome do cliente"
          maxLength={100}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={150}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={(text) => {
            setIdade(text);
            setErrors((prev) => ({ ...prev, idade: null }));
          }}
          placeholder="Idade do cliente"
          keyboardType="numeric"
        />
        {errors.idade && <Text style={styles.errorText}>{errors.idade}</Text>}

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </Pressable>
      </View>
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
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  errorBannerText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
