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
import { alterarSenha } from "../services/auth";

export default function AlterarSenha() {
  const router = useRouter();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Atenção", "As novas senhas não coincidem.");
      return;
    }

    if (senhaAtual === novaSenha) {
      Alert.alert("Atenção", "Escolha uma senha diferente da atual.");
      return;
    }

    if (carregando) return;

    try {
      setCarregando(true);

      await alterarSenha(senhaAtual, novaSenha);

      Alert.alert("Sucesso", "Sua senha foi alterada.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a senha.";

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} disabled={carregando}>
        <Text style={styles.voltar}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Alterar senha</Text>

      <Text style={styles.subtitulo}>
        Digite sua senha atual e escolha uma nova senha.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        editable={!carregando}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
        editable={!carregando}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        editable={!carregando}
      />

      <TouchableOpacity
        style={[styles.botao, carregando && styles.botaoDesativado]}
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
