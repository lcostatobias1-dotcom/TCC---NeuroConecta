import { AccessibleText as Text } from '../components/Accessibility';
import React, { useCallback, useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import { obterResumoProgresso } from '../services/database';


export default function Estatisticas() {
  const router = useRouter();

  const [resumo, setResumo] = useState({totalTarefas:0,tarefasConcluidas:0,tarefasPendentes:0,totalMetas:0,metasConcluidas:0,totalGastos:0,totalFavoritos:0});
  useFocusEffect(useCallback(() => { obterResumoProgresso().then(setResumo).catch(e=>Alert.alert('Erro', e instanceof Error?e.message:'Não foi possível carregar as estatísticas.')); }, []));
  const total = resumo.tarefasConcluidas + resumo.tarefasPendentes;
  const produtividade = total ? Math.round(resumo.tarefasConcluidas / total * 100) : 0;
  const atual = { produtividade, concluidas: resumo.tarefasConcluidas, pendentes: resumo.tarefasPendentes, metas: resumo.metasConcluidas, totalMetas: resumo.totalMetas, tempo: String(resumo.totalGastos), mensagem: total ? 'Continue avançando no seu ritmo! 💜' : 'Suas estatísticas aparecerão conforme você usar o aplicativo.', grafico: [{nome:'Tarefas',valor: produtividade}] };


  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.titulo}>
            Estatísticas 📊
          </Text>

          <Text style={styles.subtitulo}>
            Veja como está sua produtividade
          </Text>
        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        <Text style={styles.tituloSecao}>Visão geral desde a criação da conta</Text>

        {/* PRODUTIVIDADE */}
        <View style={styles.produtividadeCard}>

          <Text style={styles.produtividadeTitulo}>
            Sua produtividade
          </Text>

          <Text style={styles.produtividadeNumero}>
            {atual.produtividade}%
          </Text>

          <View style={styles.barraFundo}>
            <View
              style={[
                styles.barraProgresso,
                { width: `${atual.produtividade}%` },
              ]}
            />
          </View>

          <Text style={styles.produtividadeTexto}>
            {atual.mensagem}
          </Text>

        </View>

        {/* RESUMO */}
        <Text style={styles.tituloSecao}>
          Seu resumo
        </Text>

        <View style={styles.grid}>

          {/* CONCLUÍDAS */}
          <View style={styles.card}>
            <View style={[styles.icone, styles.iconeVerde]}>
              <Text>✅</Text>
            </View>

            <Text style={styles.cardNumero}>
              {atual.concluidas}
            </Text>

            <Text style={styles.cardTexto}>
              Tarefas concluídas
            </Text>
          </View>

          {/* PENDENTES */}
          <View style={styles.card}>
            <View style={[styles.icone, styles.iconeAmarelo]}>
              <Text>⏰</Text>
            </View>

            <Text style={styles.cardNumero}>
              {atual.pendentes}
            </Text>

            <Text style={styles.cardTexto}>
              Tarefas pendentes
            </Text>
          </View>

          {/* METAS */}
          <View style={styles.card}>
            <View style={[styles.icone, styles.iconeRoxo]}>
              <Text>🎯</Text>
            </View>

            <Text style={styles.cardNumero}>
              {atual.metas}/{atual.totalMetas}
            </Text>

            <Text style={styles.cardTexto}>
              Metas alcançadas
            </Text>
          </View>

          {/* TEMPO */}
          <View style={styles.card}>
            <View style={[styles.icone, styles.iconeAzul]}>
              <Text>⏱️</Text>
            </View>

            <Text style={styles.cardNumero}>
              {atual.tempo}
            </Text>

            <Text style={styles.cardTexto}>
              Despesas registradas
            </Text>
          </View>

        </View>

        {/* GRÁFICO */}
        <View style={styles.graficoCard}>

          <Text style={styles.graficoTitulo}>
            Seu progresso
          </Text>

          <Text style={styles.graficoSubtitulo}>
            Resumo calculado a partir dos seus registros reais
          </Text>

          <View style={styles.grafico}>

            {atual.grafico.map((item, index) => (

              <View
                key={index}
                style={styles.coluna}
              >

                <View style={styles.barraContainer}>

                  <View
                    style={[
                      styles.barraGrafico,
                      { height: `${item.valor}%` },
                    ]}
                  />

                </View>

                <Text style={styles.valorGrafico}>
                  {item.valor}%
                </Text>

                <Text style={styles.nomeGrafico}>
                  {item.nome}
                </Text>

              </View>

            ))}

          </View>

        </View>

        {/* MENSAGEM */}
        <View style={styles.mensagem}>

          <Text style={styles.mensagemEmoji}>
            🌟
          </Text>

          <View style={styles.mensagemConteudo}>

            <Text style={styles.mensagemTitulo}>
              Continue assim!
            </Text>

            <Text style={styles.mensagemTexto}>
              Cada tarefa concluída é um passo a mais para alcançar seus objetivos.
            </Text>

          </View>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  setaVoltar: {
    fontSize: 32,
    color: '#555555',
    marginTop: -3,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222222',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777777',
    marginTop: 3,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  periodos: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },

  periodoBotao: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 11,
  },

  periodoSelecionado: {
    backgroundColor: '#FFFFFF',
  },

  periodoTexto: {
    fontSize: 14,
    color: '#777777',
  },

  periodoTextoSelecionado: {
    color: '#5D568F',
    fontWeight: 'bold',
  },

  produtividadeCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
  },

  produtividadeTitulo: {
    fontSize: 15,
    color: '#6B5A80',
  },

  produtividadeNumero: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#5F407C',
    marginTop: 5,
  },

  barraFundo: {
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },

  barraProgresso: {
    height: '100%',
    backgroundColor: '#8E62B7',
    borderRadius: 10,
  },

  produtividadeTexto: {
    fontSize: 13,
    color: '#6B5A80',
    marginTop: 12,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
  },

  icone: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  iconeVerde: {
    backgroundColor: '#E2F5E8',
  },

  iconeAmarelo: {
    backgroundColor: '#FFF3CF',
  },

  iconeRoxo: {
    backgroundColor: '#EDE2FF',
  },

  iconeAzul: {
    backgroundColor: '#E1EDFF',
  },

  cardNumero: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },

  cardTexto: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },

  graficoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  graficoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },

  graficoSubtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  grafico: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 20,
  },

  coluna: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  barraContainer: {
    height: 145,
    width: 25,
    justifyContent: 'flex-end',
  },

  barraGrafico: {
    width: 25,
    backgroundColor: '#8E62B7',
    borderRadius: 8,
  },

  valorGrafico: {
    fontSize: 9,
    color: '#666666',
    marginTop: 5,
  },

  nomeGrafico: {
    fontSize: 10,
    color: '#777777',
    marginTop: 4,
  },

  mensagem: {
    backgroundColor: '#FFF7DD',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
  },

  mensagemEmoji: {
    fontSize: 25,
    marginRight: 12,
  },

  mensagemConteudo: {
    flex: 1,
  },

  mensagemTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#765F20',
    marginBottom: 4,
  },

  mensagemTexto: {
    fontSize: 12,
    color: '#766B4B',
    lineHeight: 18,
  },
});