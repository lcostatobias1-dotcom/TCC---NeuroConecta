import { AccessibleText as Text } from '../components/Accessibility';

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  NativeText,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fazerLogin } from "../services/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      Alert.alert("E-mail inválido", "Digite um endereço no formato nome@exemplo.com.");
      return;
    }

    if (carregando) return;

    try {
      setCarregando(true);

      await fazerLogin(email.trim(), senha);

      router.replace("/home");
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível fazer login.";

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.titulo}>Bem-vindo(a)!</Text>

        <Text style={styles.subtitulo}>
          Faça login para continuar!
        </Text>

        <View style={styles.formulario}>
          {/* E-MAIL */}
          <View style={styles.inputContainer}>
            <Text style={styles.icone}>✉</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(v) => setEmail(v.trimStart().toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!carregando}
              returnKeyType="next"
            />
          </View>

          {/* SENHA */}
          <View style={styles.inputContainer}>
            <Text style={styles.icone}>🔒</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              editable={!carregando}
              returnKeyType="go"
              onSubmitEditing={entrar}
            />
          </View>

          {/* ESQUECEU A SENHA */}
          <TouchableOpacity
            style={styles.esqueceu}
            onPress={() => router.push("/recuperar-senha")}
            disabled={carregando}
          >
            <Text style={styles.esqueceuTexto}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          {/* BOTÃO ENTRAR */}
          <TouchableOpacity
            style={[
              styles.botao,
              carregando && styles.botaoDesabilitado,
            ]}
            onPress={entrar}
            disabled={carregando}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* DIVISOR */}
          <View style={styles.divisor}>
            <View style={styles.linha} />

            <Text style={styles.ou}>ou continue com</Text>

            <View style={styles.linha} />
          </View>

          {/* REDES SOCIAIS */}
          <View style={styles.redesSociais}>
            <TouchableOpacity
              style={styles.socialBotao}
              onPress={() =>
                Alert.alert(
                  "Em breve",
                  "O login com Google será disponibilizado futuramente."
                )
              }
            >
              <Text style={styles.google}>G</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBotao}
              onPress={() =>
                Alert.alert(
                  "Em breve",
                  "O login com Apple será disponibilizado futuramente."
                )
              }
            >
              <Text style={styles.apple}></Text>
            </TouchableOpacity>
          </View>

          {/* CADASTRO */}
          <View style={styles.cadastroContainer}>
            <Text style={styles.cadastroTexto}>
              Não tem uma conta?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/cadastro")}
            >
              <Text style={styles.criarConta}>
                Crie uma conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FB",
  },

  conteudo: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  logo: {
    width: 100,
    height: 86,
    marginBottom: 8,
  },

  titulo: {
    width: "100%",
    fontSize: 24,
    fontWeight: "800",
    color: "#5F407C",
    marginBottom: 5,
    textAlign: "center",
  },

  subtitulo: {
    width: "100%",
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
  },

  formulario: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5D9EE",
    padding: 22,
    shadowColor: "#5F407C",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  inputContainer: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#E5D9EE",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },

  icone: {
    fontSize: 18,
    marginRight: 10,
    color: "#777777",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#222222",
  },

  esqueceu: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 2,
    marginBottom: 16,
  },

  esqueceuTexto: {
    color: "#8E62B7",
    fontSize: 12,
    fontWeight: "600",
  },

  botao: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#8E62B7",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 2,
  },

  botaoDesabilitado: {
    opacity: 0.7,
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  divisor: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  linha: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDDDDD",
  },

  ou: {
    marginHorizontal: 10,
    color: "#777777",
    fontSize: 12,
  },

  redesSociais: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 22,
  },

  socialBotao: {
    width: 55,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5D9EE",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  google: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4285F4",
  },

  apple: {
    fontSize: 23,
    color: "#000000",
  },

  cadastroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  cadastroTexto: {
    color: "#666666",
    fontSize: 12,
    marginRight: 5,
  },

  criarConta: {
    color: "#8E62B7",
    fontSize: 12,
    fontWeight: "700",
  },
});
