import { AccessibleText as Text } from '../../components/Accessibility';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, NativeText, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { buscarPerfil } from "../../services/auth";

export default function LayoutAdministrativo() {
  const router = useRouter();
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function validarAcesso() {
      try {
        const perfil = await buscarPerfil();
        if (!perfil.ativo) {
          Alert.alert("Acesso restrito", "Esta conta está desativada.");
          router.replace("/login");
          return;
        }
        if (perfil.role !== "administrador") {
          Alert.alert("Acesso restrito", "Esta área é exclusiva dos administradores.");
          router.replace("/home");
          return;
        }
        if (ativo) setLiberado(true);
      } catch (erro) {
        if (!ativo) return;
        Alert.alert("Não foi possível verificar o acesso", erro instanceof Error ? erro.message : "Entre novamente.");
        router.replace("/login");
      }
    }
    validarAcesso();
    return () => { ativo = false; };
  }, [router]);

  if (!liberado) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8E62B7" />
        <Text style={styles.texto}>Verificando acesso administrativo...</Text>
      </View>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F3FB", padding: 24 },
  texto: { marginTop: 12, color: "#6B557D", textAlign: "center" },
});
