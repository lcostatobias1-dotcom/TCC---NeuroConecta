
import { AccessibleText as Text } from '../../components/Accessibility';
import React from 'react';
import {
  View,
  NativeText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  const menus = [
    {
      titulo: 'Usuários',
      descricao: 'Gerenciar usuários cadastrados',
      emoji: '👥',
      rota: '/admin/usuarios',
    },
    {
      titulo: 'Conteúdos',
      descricao: 'Gerenciar a biblioteca de dicas',
      emoji: '📚',
      rota: '/admin/conteudos',
    },
    {
      titulo: 'Planos',
      descricao: 'Acompanhar assinaturas Premium',
      emoji: '💳',
      rota: '/admin/planos',
    },
    {
      titulo: 'Notificações',
      descricao: 'Enviar avisos aos usuários',
      emoji: '🔔',
      rota: '/admin/notificacoes',
    },
    {
      titulo: 'Relatórios',
      descricao: 'Ver problemas e sugestões',
      emoji: '⚠️',
      rota: '/admin/relatorios',
    },
    {
      titulo: 'Configurações',
      descricao: 'Configurações do sistema',
      emoji: '⚙️',
      rota: '/admin/configuracoes',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.logo}>Autonomia+</Text>
          <Text style={styles.painel}>Painel administrativo</Text>
        </View>

        <TouchableOpacity style={styles.perfil}>
          <Text style={styles.perfilEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.titulo}>
          Olá, Administrador! 👋
        </Text>

        <Text style={styles.subtitulo}>
          Aqui está um resumo do seu sistema.
        </Text>

        <View style={styles.resumo}>
          <View style={styles.cardResumo}>
            <Text style={styles.numero}>528</Text>
            <Text style={styles.label}>Usuários</Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>105</Text>
            <Text style={styles.label}>Premium</Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>42</Text>
            <Text style={styles.label}>Conteúdos</Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>7</Text>
            <Text style={styles.label}>Pendências</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>
          Gerenciamento
        </Text>

        <View style={styles.grid}>
          {menus.map((menu) => (
            <TouchableOpacity
              key={menu.titulo}
              style={styles.menuCard}
              onPress={() => router.push(menu.rota as any)}
            >
              <Text style={styles.menuEmoji}>
                {menu.emoji}
              </Text>

              <Text style={styles.menuTitulo}>
                {menu.titulo}
              </Text>

              <Text style={styles.menuDescricao}>
                {menu.descricao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.atividade}>
          <Text style={styles.atividadeTitulo}>
            Atividade recente
          </Text>

          <Text style={styles.atividadeItem}>
            🟢 Novo usuário cadastrado
          </Text>

          <Text style={styles.atividadeItem}>
            ⭐ Nova assinatura Premium
          </Text>

          <Text style={styles.atividadeItem}>
            ⚠️ Novo problema reportado
          </Text>

          <Text style={styles.atividadeItem}>
            📚 Novo conteúdo adicionado
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sair}
          onPress={() => router.replace('/home')}
        >
          <Text style={styles.sairTexto}>
            🚪 Sair do painel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FC',
  },

  topo: {
    backgroundColor: '#FFFFFF',
    paddingTop: 45,
    paddingHorizontal: 25,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E2F5',
  },

  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6845A5',
  },

  painel: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },

  perfil: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E9DDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  perfilEmoji: {
    fontSize: 23,
  },

  conteudo: {
    padding: 25,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  subtitulo: {
    fontSize: 15,
    color: '#777',
    marginTop: 5,
    marginBottom: 22,
  },

  resumo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardResumo: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE7F7',
  },

  numero: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#6D4AAF',
  },

  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D3675',
    marginTop: 18,
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  menuCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEE7F7',
  },

  menuEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },

  menuTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#553B82',
  },

  menuDescricao: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    lineHeight: 17,
  },

  atividade: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
  },

  atividadeTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#553B82',
    marginBottom: 15,
  },

  atividadeItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },

  sair: {
    backgroundColor: '#FCE8EC',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  sairTexto: {
    color: '#C44D61',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
