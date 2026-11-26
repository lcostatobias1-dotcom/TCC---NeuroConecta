import { AccessibleText as Text } from '../components/Accessibility';
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  NativeText,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {solicitarAlteracaoEmail} from "../services/auth";

export default function AlterarEmail() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    const novoEmail = email.trim().toLowerCase();

    if (!novoEmail) {
      Alert.alert("Atenção", "Digite o novo e-mail.");
      return;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(novoEmail)) {
      Alert.alert(
        "E-mail inválido",
        "Digite um endereço de e-mail válido."
      );
      return;
    }

    if (carregando) return;

    try {
      setCarregando(true);

      await solicitarAlteracaoEmail(novoEmail);

      Alert.alert(
        "Solicitação enviada",
        "Siga as instruções enviadas ao seu e-mail para confirmar a alteração.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar a alteração.";

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        disabled={carregando}
      >
        <Text style={styles.voltar}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Alterar e-mail</Text>

      <Text style={styles.subtitulo}>
        Digite o novo e-mail que deseja utilizar.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Novo e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!carregando}
      />

      <TouchableOpacity
        style={[
          styles.botao,
          carregando && styles.botaoDesativado,
        ]}
        onPress={salvar}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotao}>Salvar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F3FB",
  },

  voltar: {
    fontSize: 32,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 8,
  },

  subtitulo: {
    color: "#666",
    marginBottom: 25,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  botao: {
    height: 45,
    backgroundColor: "#8E62B7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  botaoDesativado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
