import { AccessibleText as Text } from '../components/Accessibility';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, StyleSheet, NativeText, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { salvarNovaSenha } from "../services/auth";
import { supabase } from "../services/supabase";

function parametrosDoLink(url: string) {
  const fragmento = url.includes("#") ? url.split("#").slice(1).join("#") : "";
  const consulta = url.includes("?") ? url.split("?").slice(1).join("?").split("#")[0] : "";
  const texto = fragmento || consulta;
  const params: Record<string, string> = {};
  texto.split("&").forEach((parte) => {
    if (!parte) return;
    const [chave, ...valor] = parte.split("=");
    try { params[decodeURIComponent(chave)] = decodeURIComponent(valor.join("=").replace(/\+/g, " ")); } catch { /* ignora parâmetro inválido */ }
  });
  return params;
}

export default function NovaSenha() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [linkValidado, setLinkValidado] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function processarLink(url?: string | null) {
      try {
        if (url) {
          const params = parametrosDoLink(url);
          if (params.error_description || params.error) throw new Error(params.error_description || params.error);
          if (params.access_token && params.refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token: params.access_token, refresh_token: params.refresh_token });
            if (error) throw error;
          } else if (params.code) {
            const { error } = await supabase.auth.exchangeCodeForSession(params.code);
            if (error) throw error;
          }
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error("O link de recuperação expirou ou não é válido. Solicite outro e-mail de recuperação.");
        if (ativo) setLinkValidado(true);
      } catch (erro) {
        if (!ativo) return;
        Alert.alert("Link inválido", erro instanceof Error ? erro.message : "Não foi possível validar o link.", [
          { text: "OK", onPress: () => router.replace("/recuperar-senha") },
        ]);
      }
    }
    Linking.getInitialURL().then(processarLink);
    const assinatura = Linking.addEventListener("url", ({ url }) => processarLink(url));
    const authListener = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (evento === "PASSWORD_RECOVERY" && sessao && ativo) setLinkValidado(true);
    });
    return () => { ativo = false; assinatura.remove(); authListener.data.subscription.unsubscribe(); };
  }, [router]);

  async function salvar() {
    if (!senha || !confirmar) { Alert.alert("Atenção", "Preencha os dois campos."); return; }
    if (senha.length < 8) { Alert.alert("Atenção", "A senha deve ter pelo menos 8 caracteres."); return; }
    if (senha !== confirmar) { Alert.alert("Atenção", "As senhas não coincidem."); return; }
    if (!linkValidado) { Alert.alert("Atenção", "Abra primeiro o link válido enviado por e-mail."); return; }
    if (carregando) return;
    try {
      setCarregando(true);
      await salvarNovaSenha(senha);
      await supabase.auth.signOut();
      Alert.alert("Senha alterada", "Sua nova senha foi salva. Entre com ela na tela de login.", [
        { text: "Ir para login", onPress: () => router.replace("/login") },
      ]);
    } catch (erro) {
      Alert.alert("Erro", erro instanceof Error ? erro.message : "Não foi possível salvar a nova senha.");
    } finally { setCarregando(false); }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} disabled={carregando}><Text style={styles.voltar}>‹</Text></TouchableOpacity>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.titulo}>Nova senha</Text>
      <Text style={styles.subtitulo}>{linkValidado ? "Digite e confirme sua nova senha." : "Validando o link de recuperação..."}</Text>
      <TextInput style={styles.input} placeholder="Nova senha" secureTextEntry value={senha} onChangeText={setSenha} editable={linkValidado && !carregando} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Confirmar nova senha" secureTextEntry value={confirmar} onChangeText={setConfirmar} editable={linkValidado && !carregando} autoCapitalize="none" />
      <TouchableOpacity style={[styles.botao, (!linkValidado || carregando) && styles.desabilitado]} onPress={salvar} disabled={!linkValidado || carregando}>
        {carregando ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textoBotao}>Salvar nova senha</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F3FB" },
  voltar: { fontSize: 32 },
  logo: { width: 120, height: 60, alignSelf: "center", marginTop: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginTop: 30, marginBottom: 8 },
  subtitulo: { color: "#666", marginBottom: 25 },
  input: { height: 45, borderWidth: 1, borderColor: "#DDD", borderRadius: 8, paddingHorizontal: 12, marginBottom: 15 },
  botao: { minHeight: 45, backgroundColor: "#8E62B7", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  desabilitado: { opacity: 0.55 },
  textoBotao: { color: "#FFF", fontWeight: "bold" },
});
