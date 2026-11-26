
import { AccessibleText as Text } from "../components/Accessibility";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { buscarPerfil, sairDaConta } from "../services/auth";
import { listarAssinaturaAtual } from "../services/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Usuario = {
  nome_completo: string;
  email: string | null;
  foto_url?: string | null;
};

type StatusPlano = "carregando" | "ativo" | "inativo" | "erro";

const avatares = [
  require("../../assets/avatars/avatar1.png"),
  require("../../assets/avatars/avatar2.png"),
  require("../../assets/avatars/avatar3.png"),
  require("../../assets/avatars/avatar4.png"),
];

export default function Perfil() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [avatar, setAvatar] = useState(1);
  const [statusPlano, setStatusPlano] = useState<StatusPlano>("carregando");

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      const dados = await buscarPerfil();
      setUsuario(dados);

      const salvo = await AsyncStorage.getItem("neuroconecta_avatar");
      if (salvo) {
        const numero = Number(salvo);
        if (Number.isInteger(numero) && numero >= 1 && numero <= 4) {
          setAvatar(numero);
        }
      }

      try {
        const assinatura = await listarAssinaturaAtual();
        setStatusPlano(assinatura ? "ativo" : "inativo");
      } catch {
        setStatusPlano("erro");
      }
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o perfil.";

      Alert.alert("Atenção", mensagem);
      setStatusPlano("erro");
    } finally {
      setCarregando(false);
    }
  }

  async function sair() {
    if (saindo) return;

    setSaindo(true);
    try {
      await sairDaConta();
      router.replace("../login");
    } catch {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    } finally {
      setSaindo(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topo}>
        <Text style={styles.tituloTopo}>Perfil</Text>
      </View>

      {/* Fundo decorativo */}
      <View style={styles.bolha1} />
      <View style={styles.bolha2} />
      <View style={styles.bolha3} />
      <View style={styles.bolha4} />

      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => router.back()}
      >
        <Text style={styles.voltar}>‹</Text>
      </TouchableOpacity>

      {/* Foto de perfil */}
      <View style={styles.foto}>
        {usuario?.foto_url ? (
          <Image
            source={{ uri: usuario.foto_url }}
            style={styles.imagemPerfil}
          />
        ) : (
          <Image
            source={avatares[avatar - 1]}
            style={styles.imagemPerfil}
          />
        )}
      </View>

      {/* Nome e e-mail */}
      {carregando ? (
        <ActivityIndicator
          size="small"
          color="#9B7ACB"
          style={styles.carregando}
        />
      ) : (
        <>
          <Text style={styles.nome}>
            {usuario?.nome_completo || "Usuário"}
          </Text>
          <Text style={styles.email}>
            {usuario?.email || "E-mail não disponível"}
          </Text>
        </>
      )}

      {/* Situação do plano */}
      <View
        style={[
          styles.planoCard,
          statusPlano === "ativo" && styles.planoAtivo,
          statusPlano === "inativo" && styles.planoInativo,
          statusPlano === "erro" && styles.planoErro,
        ]}
      >
        {statusPlano === "carregando" ? (
          <View style={styles.planoLinha}>
            <ActivityIndicator size="small" color="#8055A5" />
            <Text style={styles.planoTitulo}>Verificando assinatura...</Text>
          </View>
        ) : statusPlano === "ativo" ? (
          <>
            <Text style={[styles.planoTitulo, styles.textoAtivo]}>
              👑 Plano Premium Ativo
            </Text>
            <Text style={[styles.planoDescricao, styles.textoAtivo]}>
              Sua assinatura está ativa.
            </Text>
          </>
        ) : statusPlano === "inativo" ? (
          <>
            <Text style={[styles.planoTitulo, styles.textoInativo]}>
              🔒 Plano Premium Inativo
            </Text>
            <Text style={[styles.planoDescricao, styles.textoInativo]}>
              Você está utilizando o plano gratuito.
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.planoTitulo, styles.textoErro]}>
              Não foi possível verificar o plano
            </Text>
            <Text style={[styles.planoDescricao, styles.textoErro]}>
              Tente novamente mais tarde.
            </Text>
          </>
        )}
      </View>

      {/* Dados da conta */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push("../dados-conta")}
      >
        <Text style={styles.icone}>👤</Text>
        <Text style={styles.texto}>Dados da conta</Text>
      </TouchableOpacity>

      {/* Alterar e-mail */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push("../alterar-email")}
      >
        <Text style={styles.icone}>✉</Text>
        <Text style={styles.texto}>Alterar E-mail</Text>
      </TouchableOpacity>

      {/* Alterar senha */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push("../alterar-senha")}
      >
        <Text style={styles.icone}>🔒</Text>
        <Text style={styles.texto}>Alterar senha</Text>
      </TouchableOpacity>

      {/* Sair da conta */}
      <TouchableOpacity
        style={styles.sair}
        onPress={sair}
        disabled={saindo}
      >
        <Text style={styles.x}>×</Text>
        <Text style={styles.textoSair}>
          {saindo ? "Saindo..." : "Sair da conta"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FB",
  },

  topo: {
    height: 36,
    backgroundColor: "#9B9799",
    justifyContent: "center",
    alignItems: "center",
  },

  tituloTopo: {
    color: "#FFF",
    fontSize: 14,
  },

  botaoVoltar: {
    position: "absolute",
    top: 48,
    left: 10,
    zIndex: 10,
  },

  voltar: {
    fontSize: 42,
    color: "#000",
    lineHeight: 42,
  },

  foto: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#E5D991",
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  nome: {
    fontSize: 22,
    color: "#111",
    textAlign: "center",
    marginTop: 5,
  },

  email: {
    fontSize: 13,
    color: "#222",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 1,
    marginBottom: 16,
  },

  carregando: {
    marginTop: 18,
    marginBottom: 40,
  },

  planoCard: {
    marginHorizontal: 12,
    marginBottom: 16,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#EEE8F5",
  },

  planoAtivo: {
    backgroundColor: "#E5F5E9",
  },

  planoInativo: {
    backgroundColor: "#F0EAF5",
  },

  planoErro: {
    backgroundColor: "#FFF0E5",
  },

  planoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  planoTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5F407C",
  },

  planoDescricao: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },

  textoAtivo: {
    color: "#247A3D",
  },

  textoInativo: {
    color: "#684B7D",
  },

  textoErro: {
    color: "#A45A22",
  },

  opcao: {
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 11,
    marginHorizontal: 8,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  icone: {
    fontSize: 25,
    width: 38,
    color: "#111",
  },

  texto: {
    fontSize: 16,
    color: "#222",
  },

  sair: {
    position: "absolute",
    bottom: 25,
    left: 6,
    right: 6,
    height: 57,
    backgroundColor: "#FFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  x: {
    fontSize: 40,
    fontWeight: "200",
    color: "#FF3B30",
    marginRight: 10,
    marginTop: -4,
  },

  textoSair: {
    fontSize: 16,
    color: "#222",
  },

  bolha1: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#DED0FF",
    bottom: -25,
    left: -25,
  },

  bolha2: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#DED0FF",
    bottom: -25,
    left: 20,
  },

  bolha3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 45,
    backgroundColor: "#DED0FF",
    bottom: -30,
    right: -25,
  },

  bolha4: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#DED0FF",
    bottom: -25,
    right: 25,
  },

  imagemPerfil: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
});
