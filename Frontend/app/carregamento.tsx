import { AccessibleText as Text } from '../components/Accessibility';
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, NativeText, View } from "react-native";
import { useRouter } from "expo-router";
import { buscarPerfil, sairDaConta } from "../services/auth";
import { supabase } from "../services/supabase";

export default function Inicio() {
  const router = useRouter();
  useEffect(() => {
    let ativo = true;
    async function iniciar() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) { if (ativo) router.replace("/login"); return; }
        const perfil = await buscarPerfil();
        if (!perfil.ativo) {
          await sairDaConta();
          throw new Error("Sua conta está desativada. Entre em contato com o suporte.");
        }
        if (ativo) router.replace("/home");
      } catch (erro) {
        if (!ativo) return;
        const mensagem = erro instanceof Error ? erro.message : "Não foi possível restaurar a sessão.";
        if (mensagem.includes("desativada")) {
          router.replace("/login");
          Alert.alert("Conta desativada", mensagem);
          return;
        }
        // Em falhas temporárias de rede, não apagamos a sessão persistida.
        router.replace("/login");
      }
    }
    iniciar();
    return () => { ativo = false; };
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.carregando}>Carregando...</Text>
      <View style={styles.conteudo}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitulo}>conectando mentes, construindo</Text>
        <Text style={styles.subtitulo}>possibilidades!</Text>
        <ActivityIndicator style={styles.indicador} size="large" color="#8E62B7" />
        <Text style={styles.mensagem}>Aguarde um momento...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F3FB" },
  carregando: { position: "absolute", top: 10, left: 10, fontSize: 10, color: "#A67AD5" },
  conteudo: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  logo: { width: 230, height: 130 },
  subtitulo: { fontSize: 8, color: "#555555", textAlign: "center" },
  indicador: { marginTop: 25 },
  mensagem: { marginTop: 10, fontSize: 11, color: "#8E62B7" },
});
