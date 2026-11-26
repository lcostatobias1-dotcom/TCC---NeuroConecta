import { AccessibleText as Text } from '../components/Accessibility';
import React, { useEffect, useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { buscarPerfil, sairDaConta } from '../services/auth';
import { Alert } from 'react-native';

export default function Configuracoes() {
  const router = useRouter();
  const [ehAdministrador, setEhAdministrador] = useState(false);

  useEffect(() => {
    let ativo = true;
    buscarPerfil()
      .then((perfil) => { if (ativo) setEhAdministrador(perfil.role === 'administrador' && perfil.ativo); })
      .catch(() => { if (ativo) setEhAdministrador(false); });
    return () => { ativo = false; };
  }, []);

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Configurações</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
      >
      {/* Planos */}
      <TouchableOpacity
        style={styles.opcaoPlano}
        onPress={() => router.push('/planos')}
        accessibilityRole="button"
        accessibilityLabel="Ver planos disponíveis"
      >
        <View style={styles.iconePlano}>
          <Text style={styles.iconePlanoTexto}>✦</Text>
        </View>
        <View style={styles.textosPlano}>
          <Text style={styles.tituloPlano}>Conheça nossos planos</Text>
          <Text style={styles.descricaoPlano}>Veja os benefícios do Premium</Text>
        </View>
        <Text style={styles.setaPlano}>›</Text>
      </TouchableOpacity>

      {ehAdministrador && (
        <TouchableOpacity
          style={styles.opcao}
          onPress={() => router.push('/admin')}
          accessibilityRole="button"
          accessibilityLabel="Abrir painel administrativo"
        >
          <Text style={styles.icone}>🛡️</Text>
          <Text style={styles.texto}>Painel administrativo</Text>
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
      )}

      {/* Perfil */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/perfil')}
      >
        <Text style={styles.icone}>👤</Text>
        <Text style={styles.texto}>Perfil</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Alterar e-mail */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/alterar-email')}
      >
        <Text style={styles.icone}>✉️</Text>
        <Text style={styles.texto}>Alterar e-mail</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Alterar senha */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/alterar-senha')}
      >
        <Text style={styles.icone}>🔒</Text>
        <Text style={styles.texto}>Alterar senha</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Notificações */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/notificacoes')}
      >
        <Text style={styles.icone}>🔔</Text>
        <Text style={styles.texto}>Notificações</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Acessibilidade */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/acessibilidade')}
      >
        <Text style={styles.icone}>♿</Text>
        <Text style={styles.texto}>Acessibilidade</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Reportar problema */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/reportar-problema')}
      >
        <Text style={styles.icone}>⚠️</Text>
        <Text style={styles.texto}>Reportar problema</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Como usar */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/como-usar')}
      >
        <Text style={styles.icone}>📖</Text>
        <Text style={styles.texto}>Como usar</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Perguntas frequentes */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/perguntas-frequentes')}
      >
        <Text style={styles.icone}>❓</Text>
        <Text style={styles.texto}>Perguntas frequentes</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

      {/* Política de privacidade */}
      <TouchableOpacity
        style={styles.opcao}
        onPress={() => router.push('/politica-privacidade')}
      >
        <Text style={styles.icone}>🔐</Text>
        <Text style={styles.texto}>Política de privacidade</Text>
        <Text style={styles.seta}>›</Text>
      </TouchableOpacity>

        <TouchableOpacity
          style={[styles.opcao, styles.opcaoSair]}
          onPress={() => Alert.alert('Sair da conta', 'Deseja realmente sair do NeuroConecta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: async () => {
              try { await sairDaConta(); router.replace('/login'); }
              catch (e) { Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível sair.'); }
            } },
          ])}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={styles.icone}>🚪</Text>
          <Text style={[styles.texto, styles.textoSair]}>Sair da conta</Text>
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F3FB',
  },

  voltar: {
    fontSize: 32,
    color: '#111',
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 16,
  },

  lista: {
    paddingBottom: 24,
  },

  opcaoPlano: {
    minHeight: 82,
    backgroundColor: '#F3EAFE',
    borderWidth: 1,
    borderColor: '#DDC9EF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  iconePlano: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#8E62B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconePlanoTexto: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  textosPlano: {
    flex: 1,
  },

  tituloPlano: {
    color: '#5F407C',
    fontSize: 15,
    fontWeight: '700',
  },

  descricaoPlano: {
    color: '#756781',
    fontSize: 12,
    marginTop: 4,
  },

  setaPlano: {
    color: '#8E62B7',
    fontSize: 28,
    marginLeft: 8,
  },

  opcaoSair: { borderColor: '#E8B8B8', backgroundColor: '#FFF5F5', marginTop: 12 },
  textoSair: { color: '#B42318', fontWeight: '700' },
  opcao: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#E9E2EE',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
  },

  icone: {
    fontSize: 20,
    marginRight: 15,
  },

  texto: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  seta: {
    fontSize: 25,
    color: '#888',
  },
});
