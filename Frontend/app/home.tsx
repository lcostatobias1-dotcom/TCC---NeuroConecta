
import { AccessibleText as Text } from "../components/Accessibility";
import React, { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buscarPerfil } from "../services/auth";

const avatares = [
  require("../../assets/avatars/avatar1.png"),
  require("../../assets/avatars/avatar2.png"),
  require("../../assets/avatars/avatar3.png"),
  require("../../assets/avatars/avatar4.png"),
];

export default function Home() {
  const router = useRouter();

  const [avatar, setAvatar] = useState(1);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  // Atualiza a foto sempre que a tela inicial recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarFoto() {
        const [perfilResultado, avatarResultado] = await Promise.allSettled([
          buscarPerfil(),
          AsyncStorage.getItem("neuroconecta_avatar"),
        ]);

        if (!ativo) return;

        if (perfilResultado.status === "fulfilled") {
          setFotoUrl(perfilResultado.value.foto_url || null);
        }

        if (avatarResultado.status === "fulfilled") {
          const salvo = avatarResultado.value;

          if (salvo) {
            const numero = Number(salvo);

            if (Number.isInteger(numero) && numero >= 1 && numero <= 4) {
              setAvatar(numero);
            }
          } else {
            setAvatar(1);
          }
        }
      }

      carregarFoto();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.header}>

        <View>
          <Text style={styles.ola}>Olá! 👋</Text>
          <Text style={styles.bemVindo}>
            Que bom ter você aqui!
          </Text>
        </View>

        <View style={styles.headerBotoes}>

          <TouchableOpacity
            onPress={() => router.push("/configuracoes")}
          >
            <Text style={styles.configuracao}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/perfil")}
          >
            <View style={styles.avatar}>
              {fotoUrl ? (
                <Image
                  source={{ uri: fotoUrl }}
                  style={styles.imagemAvatar}
                />
              ) : (
                <Image
                  source={avatares[avatar - 1]}
                  style={styles.imagemAvatar}
                />
              )}
            </View>
          </TouchableOpacity>

        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        {/* MENSAGEM */}
        <View style={styles.mensagem}>
          <Text style={styles.mensagemTitulo}>
            Vamos organizar seu dia? 🌟
          </Text>

          <Text style={styles.mensagemTexto}>
            Escolha uma opção para começar.
          </Text>
        </View>

        {/* CARDS */}
        <View style={styles.grid}>

          {/* METAS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/metas")}
          >
            <Text style={styles.emoji}>🎯</Text>

            <Text style={styles.cardTitulo}>
              Metas
            </Text>

            <Text style={styles.cardTexto}>
              Organize seus objetivos
            </Text>
          </TouchableOpacity>

          {/* FINANÇAS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/financas")}
          >
            <Text style={styles.emoji}>💰</Text>

            <Text style={styles.cardTitulo}>
              Finanças
            </Text>

            <Text style={styles.cardTexto}>
              Organize seu dinheiro
            </Text>
          </TouchableOpacity>

          {/* TAREFAS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/tarefas")}
          >
            <Text style={styles.emoji}>✅</Text>

            <Text style={styles.cardTitulo}>
              Tarefas
            </Text>

            <Text style={styles.cardTexto}>
              Veja suas atividades
            </Text>
          </TouchableOpacity>

          {/* CONQUISTAS */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/conquistas")}
          >
            <Text style={styles.emoji}>🏆</Text>

            <Text style={styles.cardTitulo}>
              Conquistas
            </Text>

            <Text style={styles.cardTexto}>
              Veja seu progresso
            </Text>
          </TouchableOpacity>

        </View>

        {/* AGENDA */}
        <TouchableOpacity
          style={styles.agenda}
          onPress={() => router.push("/agenda")}
        >
          <View>
            <Text style={styles.agendaTitulo}>
              📅 Agenda
            </Text>

            <Text style={styles.agendaTexto}>
              Confira seus próximos compromissos
            </Text>
          </View>

          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>

        {/* BIBLIOTECA */}
        <TouchableOpacity
          style={styles.biblioteca}
          onPress={() => router.push("/biblioteca")}
        >
          <View style={styles.bibliotecaIcone}>
            <Text style={styles.bibliotecaEmoji}>📚</Text>
          </View>

          <View style={styles.bibliotecaTextos}>
            <Text style={styles.bibliotecaTitulo}>
              Biblioteca de dicas
            </Text>

            <Text style={styles.bibliotecaTexto}>
              Aprenda coisas novas para sua vida
            </Text>
          </View>

          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3FB",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ola: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222222",
  },

  bemVindo: {
    fontSize: 13,
    color: "#777777",
    marginTop: 4,
  },

  headerBotoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  configuracao: {
    fontSize: 25,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#EAD9FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  imagemAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  mensagem: {
    backgroundColor: "#F3E8FF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  mensagemTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#5F407C",
    marginBottom: 6,
  },

  mensagemTexto: {
    fontSize: 13,
    color: "#666666",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    minHeight: 145,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5D9EE",
    shadowColor: "#5F407C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },

  emoji: {
    fontSize: 28,
    marginBottom: 10,
  },

  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },

  cardTexto: {
    fontSize: 11,
    color: "#666666",
    marginTop: 4,
  },

  agenda: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  agendaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },

  agendaTexto: {
    fontSize: 11,
    color: "#777777",
    marginTop: 5,
  },

  biblioteca: {
    minHeight: 85,
    backgroundColor: "#F4EAFE",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  bibliotecaIcone: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  bibliotecaEmoji: {
    fontSize: 25,
  },

  bibliotecaTextos: {
    flex: 1,
  },

  bibliotecaTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
  },

  bibliotecaTexto: {
    fontSize: 11,
    color: "#777777",
    marginTop: 4,
  },

  seta: {
    fontSize: 28,
    color: "#888888",
  },
});
