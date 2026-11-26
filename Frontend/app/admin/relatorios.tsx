import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  NativeText,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

type Periodo = '7 dias' | '30 dias' | '90 dias';

export default function RelatoriosAdmin() {
  const router = useRouter();

  const [periodo, setPeriodo] = useState<Periodo>('30 dias');

  const dados = {
    usuarios: 528,
    novosUsuarios: 64,
    premium: 105,
    tarefas: 1248,
    metas: 436,
    conteudos: 42,
  };

  const atividades = [
    {
      mes: 'Abr',
      valor: 62,
    },
    {
      mes: 'Mai',
      valor: 75,
    },
    {
      mes: 'Jun',
      valor: 68,
    },
    {
      mes: 'Jul',
      valor: 82,
    },
    {
      mes: 'Ago',
      valor: 91,
    },
    {
      mes: 'Set',
      valor: 100,
    },
  ];

  const categorias = [
    {
      nome: 'Vida em Casa',
      quantidade: 12,
      porcentagem: 29,
      emoji: '🏠',
    },
    {
      nome: 'Finanças',
      quantidade: 9,
      porcentagem: 21,
      emoji: '💰',
    },
    {
      nome: 'Trabalho e Carreira',
      quantidade: 8,
      porcentagem: 19,
      emoji: '💼',
    },
    {
      nome: 'Vida Independente',
      quantidade: 7,
      porcentagem: 17,
      emoji: '🚌',
    },
    {
      nome: 'Cozinha e Alimentação',
      quantidade: 6,
      porcentagem: 14,
      emoji: '🧑‍🍳',
    },
  ];

  const maiorValor = Math.max(
    ...atividades.map((item) => item.valor)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarTexto}>‹</Text>
        </TouchableOpacity>

        <View style={styles.tituloArea}>
          <Text style={styles.titulo}>
            Relatórios
          </Text>

          <Text style={styles.subtitulo}>
            Acompanhe os principais dados do aplicativo
          </Text>
        </View>
      </View>

      {/* FILTRO DE PERÍODO */}
      <View style={styles.filtroCard}>
        <Text style={styles.filtroTitulo}>
          Período
        </Text>

        <View style={styles.periodos}>
          {(['7 dias', '30 dias', '90 dias'] as Periodo[]).map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.periodoBotao,
                  periodo === item && styles.periodoSelecionado,
                ]}
                onPress={() => setPeriodo(item)}
              >
                <Text
                  style={[
                    styles.periodoTexto,
                    periodo === item &&
                      styles.periodoTextoSelecionado,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* RESUMO */}
      <Text style={styles.secaoTitulo}>
        Resumo geral
      </Text>

      <View style={styles.grid}>
        <View style={styles.resumoCard}>
          <Text style={styles.cardEmoji}>👥</Text>

          <Text style={styles.numero}>
            {dados.usuarios}
          </Text>

          <Text style={styles.cardTitulo}>
            Usuários
          </Text>

          <Text style={styles.crescimento}>
            +{dados.novosUsuarios} novos
          </Text>
        </View>

        <View style={styles.resumoCard}>
          <Text style={styles.cardEmoji}>⭐</Text>

          <Text style={styles.numero}>
            {dados.premium}
          </Text>

          <Text style={styles.cardTitulo}>
            Premium
          </Text>

          <Text style={styles.crescimento}>
            19,9% da base
          </Text>
        </View>

        <View style={styles.resumoCard}>
          <Text style={styles.cardEmoji}>✅</Text>

          <Text style={styles.numero}>
            {dados.tarefas}
          </Text>

          <Text style={styles.cardTitulo}>
            Tarefas
          </Text>

          <Text style={styles.crescimento}>
            Concluídas
          </Text>
        </View>

        <View style={styles.resumoCard}>
          <Text style={styles.cardEmoji}>🎯</Text>

          <Text style={styles.numero}>
            {dados.metas}
          </Text>

          <Text style={styles.cardTitulo}>
            Metas
          </Text>

          <Text style={styles.crescimento}>
            Criadas
          </Text>
        </View>
      </View>

      {/* ATIVIDADE */}
      <View style={styles.card}>
        <View style={styles.cardCabecalho}>
          <View>
            <Text style={styles.cardGrandeTitulo}>
              Atividade dos usuários
            </Text>

            <Text style={styles.cardSubtitulo}>
              Nível de utilização do aplicativo
            </Text>
          </View>

          <Text style={styles.periodoAtual}>
            {periodo}
          </Text>
        </View>

        <View style={styles.grafico}>
          {atividades.map((item) => {
            const altura =
              (item.valor / maiorValor) * 130;

            return (
              <View
                key={item.mes}
                style={styles.coluna}
              >
                <Text style={styles.valorGrafico}>
                  {item.valor}%
                </Text>

                <View style={styles.barraArea}>
                  <View
                    style={[
                      styles.barra,
                      {
                        height: altura,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.mes}>
                  {item.mes}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* CONTEÚDOS */}
      <View style={styles.card}>
        <View style={styles.cardCabecalho}>
          <View>
            <Text style={styles.cardGrandeTitulo}>
              Conteúdos
            </Text>

            <Text style={styles.cardSubtitulo}>
              Distribuição da biblioteca
            </Text>
          </View>

          <Text style={styles.totalConteudos}>
            {dados.conteudos} conteúdos
          </Text>
        </View>

        {categorias.map((categoria) => (
          <View
            key={categoria.nome}
            style={styles.categoria}
          >
            <View style={styles.categoriaTopo}>
              <View style={styles.categoriaNomeArea}>
                <Text style={styles.categoriaEmoji}>
                  {categoria.emoji}
                </Text>

                <Text style={styles.categoriaNome}>
                  {categoria.nome}
                </Text>
              </View>

              <Text style={styles.categoriaQuantidade}>
                {categoria.quantidade}
              </Text>
            </View>

            <View style={styles.progressoFundo}>
              <View
                style={[
                  styles.progresso,
                  {
                    width: `${categoria.porcentagem}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.porcentagem}>
              {categoria.porcentagem}%
            </Text>
          </View>
        ))}
      </View>

      {/* INDICADORES */}
      <Text style={styles.secaoTitulo}>
        Indicadores
      </Text>

      <View style={styles.indicador}>
        <View style={styles.indicadorIcone}>
          <Text>📚</Text>
        </View>

        <View style={styles.indicadorInfo}>
          <Text style={styles.indicadorTitulo}>
            Conteúdos publicados
          </Text>

          <Text style={styles.indicadorDescricao}>
            {dados.conteudos} conteúdos disponíveis na biblioteca
          </Text>
        </View>

        <Text style={styles.indicadorValor}>
          {dados.conteudos}
        </Text>
      </View>

      <View style={styles.indicador}>
        <View style={styles.indicadorIcone}>
          <Text>🎯</Text>
        </View>

        <View style={styles.indicadorInfo}>
          <Text style={styles.indicadorTitulo}>
            Metas criadas
          </Text>

          <Text style={styles.indicadorDescricao}>
            Metas registradas pelos usuários
          </Text>
        </View>

        <Text style={styles.indicadorValor}>
          {dados.metas}
        </Text>
      </View>

      <View style={styles.indicador}>
        <View style={styles.indicadorIcone}>
          <Text>✅</Text>
        </View>

        <View style={styles.indicadorInfo}>
          <Text style={styles.indicadorTitulo}>
            Tarefas concluídas
          </Text>

          <Text style={styles.indicadorDescricao}>
            Atividades finalizadas pelos usuários
          </Text>
        </View>

        <Text style={styles.indicadorValor}>
          {dados.tarefas}
        </Text>
      </View>

      {/* OBSERVAÇÃO */}
      <View style={styles.observacao}>
        <Text style={styles.observacaoIcone}>
          💡
        </Text>

        <View style={styles.observacaoTextoArea}>
          <Text style={styles.observacaoTitulo}>
            Relatório demonstrativo
          </Text>

          <Text style={styles.observacaoTexto}>
            Os números exibidos atualmente são dados de demonstração.
            Depois da integração com o banco de dados, eles serão
            atualizados automaticamente.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 45,
  },

  cabecalho: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  voltarTexto: {
    fontSize: 32,
    color: '#5E4B8B',
    marginTop: -4,
  },

  tituloArea: {
    flex: 1,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3D315B',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },

  filtroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },

  filtroTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B4058',
    marginBottom: 12,
  },

  periodos: {
    flexDirection: 'row',
    gap: 8,
  },

  periodoBotao: {
    flex: 1,
    borderRadius: 11,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F2F9',
  },

  periodoSelecionado: {
    backgroundColor: '#7255B8',
  },

  periodoTexto: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },

  periodoTextoSelecionado: {
    color: '#FFFFFF',
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D315B',
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  resumoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
  },

  cardEmoji: {
    fontSize: 22,
    marginBottom: 9,
  },

  numero: {
    fontSize: 25,
    fontWeight: '700',
    color: '#3D315B',
  },

  cardTitulo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  crescimento: {
    fontSize: 11,
    color: '#7255B8',
    marginTop: 8,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  cardCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  cardGrandeTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D315B',
  },

  cardSubtitulo: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },

  periodoAtual: {
    fontSize: 11,
    color: '#7255B8',
    fontWeight: '600',
    backgroundColor: '#F0EBFA',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  grafico: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },

  coluna: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 185,
    flex: 1,
  },

  valorGrafico: {
    fontSize: 9,
    color: '#888',
    marginBottom: 5,
  },

  barraArea: {
    height: 130,
    width: 25,
    justifyContent: 'flex-end',
    backgroundColor: '#F2EEF8',
    borderRadius: 8,
    overflow: 'hidden',
  },

  barra: {
    width: '100%',
    backgroundColor: '#8D73C5',
    borderRadius: 8,
  },

  mes: {
    fontSize: 10,
    color: '#888',
    marginTop: 7,
  },

  totalConteudos: {
    fontSize: 11,
    color: '#7255B8',
    fontWeight: '600',
  },

  categoria: {
    marginBottom: 17,
  },

  categoriaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },

  categoriaNomeArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoriaEmoji: {
    fontSize: 18,
    marginRight: 8,
  },

  categoriaNome: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },

  categoriaQuantidade: {
    fontSize: 12,
    color: '#7255B8',
    fontWeight: '700',
  },

  progressoFundo: {
    height: 7,
    backgroundColor: '#EEEAF4',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progresso: {
    height: '100%',
    backgroundColor: '#9B84CC',
    borderRadius: 5,
  },

  porcentagem: {
    fontSize: 9,
    color: '#999',
    marginTop: 4,
  },

  indicador: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  indicadorIcone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  indicadorInfo: {
    flex: 1,
  },

  indicadorTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A4055',
  },

  indicadorDescricao: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
  },

  indicadorValor: {
    fontSize: 19,
    fontWeight: '700',
    color: '#7255B8',
  },

  observacao: {
    backgroundColor: '#F0EBFA',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },

  observacaoIcone: {
    fontSize: 20,
    marginRight: 10,
  },

  observacaoTextoArea: {
    flex: 1,
  },

  observacaoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5E4B8B',
    marginBottom: 4,
  },

  observacaoTexto: {
    fontSize: 11,
    lineHeight: 17,
    color: '#6D6380',
  },
});