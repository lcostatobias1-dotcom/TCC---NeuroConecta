import { AccessibleText as Text } from '../../components/Accessibility';
import React from 'react';
import {
  View,
  NativeText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function UsuarioAdmin() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nome = params.nome || 'Usuário';
  const email = params.email || 'Não informado';
  const plano = params.plano || 'Gratuito';
  const status = params.status || 'Ativo';

  const desativarConta = () => {
    Alert.alert(
      'Desativar conta',
      `Deseja realmente desativar a conta de ${nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Conta desativada',
              'Essa ação será conectada ao banco de dados posteriormente.'
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.voltar}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>
          Perfil do usuário
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.conteudo}>
        {/* PERFIL */}
        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>
              {String(nome).charAt(0)}
            </Text>
          </View>

          <Text style={styles.nome}>
            {nome}
          </Text>

          <Text style={styles.email}>
            {email}
          </Text>

          <View style={styles.tags}>
            <Text
              style={[
                styles.tag,
                plano === 'Premium'
                  ? styles.premium
                  : styles.gratuito,
              ]}
            >
              {plano}
            </Text>

            <Text
              style={[
                styles.tag,
                status === 'Ativo'
                  ? styles.ativo
                  : styles.inativo,
              ]}
            >
              {status}
            </Text>
          </View>
        </View>

        {/* INFORMAÇÕES DA CONTA */}
        <Text style={styles.secao}>
          Informações da conta
        </Text>

        <View style={styles.card}>
          <View style={styles.linha}>
            <Text style={styles.label}>
              Nome
            </Text>

            <Text style={styles.valor}>
              {nome}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.label}>
              E-mail
            </Text>

            <Text style={styles.valor}>
              {email}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.label}>
              Plano
            </Text>

            <Text style={styles.valor}>
              {plano}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.label}>
              Status
            </Text>

            <Text style={styles.valor}>
              {status}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.label}>
              Cadastro
            </Text>

            <Text style={styles.valor}>
              24/09/2026
            </Text>
          </View>
        </View>

        {/* RESUMO DE UTILIZAÇÃO */}
        <Text style={styles.secao}>
          Resumo de utilização
        </Text>

        <View style={styles.resumo}>
          <View style={styles.resumoCard}>
            <Text style={styles.numero}>
              5
            </Text>

            <Text style={styles.resumoTexto}>
              Metas
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.numero}>
              12
            </Text>

            <Text style={styles.resumoTexto}>
              Tarefas
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.numero}>
              8
            </Text>

            <Text style={styles.resumoTexto}>
              Conquistas
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.numero}>
              14
            </Text>

            <Text style={styles.resumoTexto}>
              Favoritos
            </Text>
          </View>
        </View>

        {/* AÇÕES ADMINISTRATIVAS */}
        <Text style={styles.secao}>
          Ações administrativas
        </Text>

        <TouchableOpacity
          style={styles.botaoDesativar}
          onPress={desativarConta}
        >
          <Text style={styles.botaoDesativarTexto}>
            🚫 Desativar conta
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FC',
  },

  topo: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E2F5',
  },

  voltar: {
    color: '#6D4AAF',
    fontSize: 17,
    fontWeight: '600',
    width: 60,
  },

  tituloTopo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  perfilCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#E5D8F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarTexto: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6845A5',
  },

  nome: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  tag: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
    overflow: 'hidden',
  },

  premium: {
    backgroundColor: '#EEE3FF',
    color: '#7045A8',
  },

  gratuito: {
    backgroundColor: '#F0F0F0',
    color: '#666',
  },

  ativo: {
    backgroundColor: '#E3F7EA',
    color: '#31834A',
  },

  inativo: {
    backgroundColor: '#FCE8EC',
    color: '#C44D61',
  },

  secao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4D3675',
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },

  linha: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECF5',
  },

  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },

  valor: {
    fontSize: 15,
    color: '#4D3675',
    fontWeight: '600',
  },

  resumo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  resumoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    alignItems: 'center',
  },

  numero: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#7651B8',
  },

  resumoTexto: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  botaoDesativar: {
    backgroundColor: '#FCE8EC',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  botaoDesativarTexto: {
    color: '#C44D61',
    fontWeight: 'bold',
    fontSize: 15,
  },
});