
import { AccessibleText as Text } from "../components/Accessibility";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { cadastrarUsuario } from "../services/auth";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [concordou, setConcordou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (
      !nome.trim() ||
      !nascimento.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (senha.length < 8) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não são iguais.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      Alert.alert("Atenção", "Digite um e-mail válido, como nome@exemplo.com.");
      return;
    }

    if (
      !/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento) ||
      !(() => {
        const [d, m, a] = nascimento.split("/").map(Number);
        const dt = new Date(a, m - 1, d);
        return (
          dt.getFullYear() === a &&
          dt.getMonth() === m - 1 &&
          dt.getDate() === d
        );
      })()
    ) {
      Alert.alert("Atenção", "Informe uma data válida no formato DD/MM/AAAA.");
      return;
    }

    if (!concordou) {
      Alert.alert(
        "Atenção",
        "Para criar sua conta, você precisa ler e concordar com os Termos de Uso e a Política de Privacidade."
      );
      return;
    }

    try {
      setCarregando(true);

      const data = await cadastrarUsuario(
        nome,
        nascimento,
        email,
        senha
      );

      if (data.usuario) {
        Alert.alert(
          "Sucesso!",
          "Sua conta foi criada. Você já pode entrar no NeuroConecta.",
          [
            {
              text: "OK",
              onPress: () => router.replace("../login"),
            },
          ]
        );
      } else {
        Alert.alert("Erro", "Não foi possível confirmar o cadastro.");
      }
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o cadastro.";

      Alert.alert("Erro no cadastro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Criar sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento"
        value={nascimento}
        onChangeText={(v) => {
          const n = v.replace(/\D/g, "").slice(0, 8);
          setNascimento(
            n.length > 4
              ? `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`
              : n.length > 2
              ? `${n.slice(0, 2)}/${n.slice(2)}`
              : n
          );
        }}
        keyboardType="numeric"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={(v) => setEmail(v.trimStart().toLowerCase())}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {confirmarSenha.length > 0 && (
        <Text style={styles.validacaoSenha}>
          {senha === confirmarSenha
            ? "✓ As senhas coincidem"
            : "As senhas ainda não coincidem"}
        </Text>
      )}

      {/* ACEITAÇÃO DOS TERMOS */}
      <View style={styles.areaTermos}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setConcordou(!concordou)}
          activeOpacity={0.7}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: concordou }}
          accessibilityLabel="Concordar com os Termos de Uso e a Política de Privacidade"
        >
          <Text style={styles.checkboxSimbolo}>
            {concordou ? "✓" : ""}
          </Text>
        </TouchableOpacity>

        <View style={styles.textoTermosContainer}>
          <Text style={styles.textoTermos}>
            Li e concordo com os{" "}
            <Text
              style={styles.linkTermos}
              onPress={() => router.push("/termos-uso")}
            >
              Termos de Uso
            </Text>
            {" "}e a{" "}
            <Text
              style={styles.linkTermos}
              onPress={() => router.push("/politica-privacidade")}
            >
              Política de Privacidade
            </Text>
            .
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.botao,
          (!concordou || carregando) && styles.botaoDesabilitado,
        ]}
        onPress={cadastrar}
        disabled={!concordou || carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>Voltar para o login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  logo: {
    width: 180,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#F7F3FB",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  validacaoSenha: {
    color: "#248044",
    marginTop: -8,
    marginBottom: 12,
  },

  areaTermos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 18,
    paddingHorizontal: 2,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#8E62B7",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkboxSimbolo: {
    color: "#8E62B7",
    fontSize: 18,
    fontWeight: "bold",
  },

  textoTermosContainer: {
    flex: 1,
  },

  textoTermos: {
    fontSize: 12,
    color: "#444",
    lineHeight: 19,
  },

  linkTermos: {
    color: "#8E62B7",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  botao: {
    backgroundColor: "#8E62B7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  voltar: {
    textAlign: "center",
    marginTop: 20,
    color: "#8E62B7",
  },
});