import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';

import {
  View,
  NativeText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

export default function PlanosAdmin() {
  const router = useRouter();

  const [planoPremiumAtivo, setPlanoPremiumAtivo] =
    useState(true);

  const alternarPlano = () => {
    setPlanoPremiumAtivo(!planoPremiumAtivo);

    Alert.alert(
      'Plano atualizado',
      planoPremiumAtivo
        ? 'O plano Premium foi desativado.'
        : 'O plano Premium foi ativado.'
    );
  };

  return (
    <View style={styles.container}>
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
          Planos e assinaturas
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* VISÃO GERAL */}
        <Text style={styles.titulo}>
          Visão geral
        </Text>

        <Text style={styles.subtitulo}>
          Acompanhe os planos e assinaturas dos usuários.
        </Text>

        {/* RESUMO */}
        <View style={styles.resumo}>
          <View style={styles.cardResumo}>
            <Text style={styles.numero}>
              528
            </Text>

            <Text style={styles.label}>
              Usuários
            </Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>
              105
            </Text>

            <Text style={styles.label}>
              Premium
            </Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>
              423
            </Text>

            <Text style={styles.label}>
              Gratuitos
            </Text>
          </View>

          <View style={styles.cardResumo}>
            <Text style={styles.numero}>
              15
            </Text>

            <Text style={styles.label}>
              Cancelamentos
            </Text>
          </View>
        </View>

        {/* RECEITA */}
        <View style={styles.receita}>
          <Text style={styles.receitaTitulo}>
            Receita mensal
          </Text>

          <Text style={styles.receitaValor}>
            R$ 1.039,50
          </Text>

          <Text style={styles.receitaInfo}>
            Baseado nas assinaturas Premium ativas
          </Text>
        </View>

        {/* PLANOS */}
        <Text style={styles.secao}>
          Planos disponíveis
        </Text>

        {/* GRATUITO */}
        <View style={styles.planoCard}>
          <View style={styles.planoCabecalho}>
            <View>
              <Text style={styles.planoNome}>
                Gratuito
              </Text>

              <Text style={styles.planoPreco}>
                R$ 0,00
              </Text>
            </View>

            <Text style={styles.statusAtivo}>
              Ativo
            </Text>
          </View>

          <Text style={styles.item}>
            ✓ Acesso básico ao aplicativo
          </Text>

          <Text style={styles.item}>
            ✓ Biblioteca de dicas
          </Text>

          <Text style={styles.item}>
            ✓ Metas e tarefas
          </Text>
        </View>

        {/* PREMIUM */}
        <View style={styles.planoCard}>
          <View style={styles.planoCabecalho}>
            <View>
              <Text style={styles.planoNome}>
                ⭐ Premium
              </Text>

              <Text style={styles.planoPreco}>
                R$ 9,90/mês
              </Text>
            </View>

            <Text
              style={[
                styles.status,
                planoPremiumAtivo
                  ? styles.statusAtivo
                  : styles.statusInativo,
              ]}
            >
              {planoPremiumAtivo
                ? 'Ativo'
                : 'Inativo'}
            </Text>
          </View>

          <Text style={styles.item}>
            ✓ Recursos exclusivos
          </Text>

          <Text style={styles.item}>
            ✓ Conteúdos exclusivos
          </Text>

          <Text style={styles.item}>
            ✓ Mais funcionalidades
          </Text>

          <Text style={styles.item}>
            ✓ Experiência sem anúncios
          </Text>

          <TouchableOpacity
            style={
              planoPremiumAtivo
                ? styles.botaoDesativar
                : styles.botaoAtivar
            }
            onPress={alternarPlano}
          >
            <Text
              style={
                planoPremiumAtivo
                  ? styles.textoDesativar
                  : styles.textoAtivar
              }
            >
              {planoPremiumAtivo
                ? 'Desativar plano'
                : 'Ativar plano'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ASSINATURAS */}
        <Text style={styles.secao}>
          Assinaturas recentes
        </Text>

        <View style={styles.assinatura}>
          <View style={styles.assinaturaInfo}>
            <Text style={styles.assinaturaNome}>
              Maria Silva
            </Text>

            <Text style={styles.assinaturaData}>
              Assinatura Premium
            </Text>
          </View>

          <Text style={styles.assinaturaStatus}>
            Ativa
          </Text>
        </View>

        <View style={styles.assinatura}>
          <View style={styles.assinaturaInfo}>
            <Text style={styles.assinaturaNome}>
              João Santos
            </Text>

            <Text style={styles.assinaturaData}>
              Assinatura cancelada
            </Text>
          </View>

          <Text style={styles.cancelada}>
            Cancelada
          </Text>
        </View>

        <View style={styles.assinatura}>
          <View style={styles.assinaturaInfo}>
            <Text style={styles.assinaturaNome}>
              Ana Oliveira
            </Text>

            <Text style={styles.assinaturaData}>
              Assinatura Premium
            </Text>
          </View>

          <Text style={styles.assinaturaStatus}>
            Ativa
          </Text>
        </View>
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
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  subtitulo: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    marginBottom: 20,
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
  },

  numero: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7651B8',
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  receita: {
    backgroundColor: '#E9DDF8',
    borderRadius: 18,
    padding: 20,
    marginTop: 8,
  },

  receitaTitulo: {
    fontSize: 14,
    color: '#6845A5',
  },

  receitaValor: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4D3675',
    marginTop: 5,
  },

  receitaInfo: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  secao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D3675',
    marginTop: 25,
    marginBottom: 12,
  },

  planoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
  },

  planoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  planoNome: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  planoPreco: {
    fontSize: 16,
    color: '#7651B8',
    fontWeight: '600',
    marginTop: 4,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 11,
    overflow: 'hidden',
  },

  statusAtivo: {
    backgroundColor: '#E3F7EA',
    color: '#31834A',
  },

  statusInativo: {
    backgroundColor: '#FCE8EC',
    color: '#C44D61',
  },

  item: {
    fontSize: 14,
    color: '#666',
    marginBottom: 9,
  },

  botaoDesativar: {
    marginTop: 10,
    backgroundColor: '#FCE8EC',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  textoDesativar: {
    color: '#C44D61',
    fontWeight: 'bold',
  },

  botaoAtivar: {
    marginTop: 10,
    backgroundColor: '#E3F7EA',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  textoAtivar: {
    color: '#31834A',
    fontWeight: 'bold',
  },

  assinatura: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  assinaturaInfo: {
    flex: 1,
  },

  assinaturaNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  assinaturaData: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  assinaturaStatus: {
    backgroundColor: '#E3F7EA',
    color: '#31834A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 11,
    overflow: 'hidden',
  },

  cancelada: {
    backgroundColor: '#FCE8EC',
    color: '#C44D61',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 11,
    overflow: 'hidden',
  },
});