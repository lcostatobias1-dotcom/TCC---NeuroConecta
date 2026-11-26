import { AccessibleText as Text } from '../components/Accessibility';
import React from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { obterResumoProgresso } from '../services/database';

export default function Conquistas() {
  const router = useRouter();
  const [progresso, setProgresso] = useState({totalTarefas:0,tarefasConcluidas:0,totalMetas:0,metasConcluidas:0,totalGastos:0,totalFavoritos:0});
  useFocusEffect(useCallback(() => { obterResumoProgresso().then(setProgresso).catch(e=>Alert.alert('Erro', e instanceof Error?e.message:'Não foi possível atualizar as conquistas.')); }, []));

  const conquistas = [
    {
      emoji: '🌟',
      titulo: 'Primeiro passo',
      descricao: 'Você criou sua primeira meta.',
      desbloqueada: progresso.totalMetas >= 1,
      atual: Math.min(progresso.totalMetas,1), meta: 1,
    },
    {
      emoji: '✅',
      titulo: 'Primeira tarefa',
      descricao: 'Você criou sua primeira tarefa.',
      desbloqueada: progresso.totalTarefas >= 1,
      atual: Math.min(progresso.totalTarefas,1), meta: 1,
    },
    {
      emoji: '📚',
      titulo: 'Colecionador de conteúdos',
      descricao: 'Você salvou seu primeiro conteúdo.',
      desbloqueada: progresso.totalFavoritos >= 1,
      atual: Math.min(progresso.totalFavoritos,1), meta: 1,
    },
    {
      emoji: '💰',
      titulo: 'Organizando a vida',
      descricao: 'Você registrou sua primeira despesa.',
      desbloqueada: progresso.totalGastos >= 1,
      atual: Math.min(progresso.totalGastos,1), meta: 1,
    },
    {
      emoji: '🔥',
      titulo: 'Uma semana de foco',
      descricao: 'Use o aplicativo por 7 dias.',
      desbloqueada: false,
      atual: 0, meta: 7,
    },
    {
      emoji: '🏆',
      titulo: 'Conquista incrível',
      descricao: 'Conclua 10 tarefas.',
      desbloqueada: progresso.tarefasConcluidas >= 10,
      atual: Math.min(progresso.tarefasConcluidas,10), meta: 10,
    },
  ];

  const totalDesbloqueadas = conquistas.filter(
    (item) => item.desbloqueada
  ).length;

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
            Conquistas 🏆
          </Text>

          <Text style={styles.subtitulo}>
            Veja tudo o que você já conquistou
          </Text>
        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        {/* RESUMO */}
        <View style={styles.resumo}>

          <View style={styles.resumoIcone}>
            <Text style={styles.resumoEmoji}>🏆</Text>
          </View>

          <View style={styles.resumoTexto}>

            <Text style={styles.resumoTitulo}>
              Suas conquistas
            </Text>

            <Text style={styles.resumoNumero}>
              {totalDesbloqueadas} de {conquistas.length}
            </Text>

            <Text style={styles.resumoDescricao}>
              Continue realizando suas atividades!
            </Text>

          </View>

        </View>

        {/* BOTÃO DE ESTATÍSTICAS */}
        <TouchableOpacity
          style={styles.botaoEstatisticas}
          onPress={() => router.push('/estatisticas')}
        >

          <View style={styles.estatisticasIcone}>
            <Text style={styles.estatisticasEmoji}>
              📊
            </Text>
          </View>

          <View style={styles.estatisticasTextos}>

            <Text style={styles.estatisticasTitulo}>
              Ver minhas estatísticas
            </Text>

            <Text style={styles.estatisticasTexto}>
              Veja sua produtividade e seu progresso
            </Text>

          </View>

          <Text style={styles.seta}>
            ›
          </Text>

        </TouchableOpacity>

        {/* LISTA DE CONQUISTAS */}
        <Text style={styles.tituloSecao}>
          Todas as conquistas
        </Text>

        {conquistas.map((conquista, index) => (

          <View
            key={index}
            style={[
              styles.conquista,
              !conquista.desbloqueada &&
                styles.conquistaBloqueada,
            ]}
          >

            <View
              style={[
                styles.icone,
                !conquista.desbloqueada &&
                  styles.iconeBloqueado,
              ]}
            >

              <Text style={styles.emoji}>
                {conquista.desbloqueada
                  ? conquista.emoji
                  : '🔒'}
              </Text>

            </View>

            <View style={styles.textos}>

              <Text
                style={[
                  styles.conquistaTitulo,
                  !conquista.desbloqueada &&
                    styles.textoBloqueado,
                ]}
              >
                {conquista.titulo}
              </Text>

              <Text
                style={[
                  styles.conquistaDescricao,
                  !conquista.desbloqueada &&
                    styles.textoBloqueado,
                ]}
              >
                {conquista.descricao}
              </Text>

              <Text style={styles.status}>
                {conquista.desbloqueada
                  ? '✨ Conquistada'
                  : '🔒 Ainda não desbloqueada'}
              </Text>
              {'meta' in conquista && <Text style={styles.status}>{conquista.titulo === 'Uma semana de foco' ? 'Registro diário em breve' : `${(conquista as any).atual}/${(conquista as any).meta} etapas`}</Text>}

            </View>

          </View>

        ))}

        {/* MENSAGEM */}
        <View style={styles.mensagem}>

          <Text style={styles.mensagemEmoji}>
            🌟
          </Text>

          <View style={styles.mensagemTextoContainer}>

            <Text style={styles.mensagemTitulo}>
              Cada conquista importa!
            </Text>

            <Text style={styles.mensagemTexto}>
              Pequenos passos também são progresso.
              Continue no seu ritmo!
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

  resumo: {
    backgroundColor: '#FFF1C9',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  resumoIcone: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  resumoEmoji: {
    fontSize: 32,
  },

  resumoTexto: {
    flex: 1,
  },

  resumoTitulo: {
    fontSize: 15,
    color: '#765F20',
  },

  resumoNumero: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#5E4B16',
    marginTop: 2,
  },

  resumoDescricao: {
    fontSize: 11,
    color: '#766B4B',
    marginTop: 2,
  },

  /* BOTÃO ESTATÍSTICAS */
  botaoEstatisticas: {
    backgroundColor: '#F3E8FF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  estatisticasIcone: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  estatisticasEmoji: {
    fontSize: 26,
  },

  estatisticasTextos: {
    flex: 1,
  },

  estatisticasTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  estatisticasTexto: {
    fontSize: 11,
    color: '#6B5A80',
    marginTop: 4,
  },

  seta: {
    fontSize: 28,
    color: '#888888',
  },

  /* CONQUISTAS */
  tituloSecao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },

  conquista: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  conquistaBloqueada: {
    backgroundColor: '#F7F7F7',
  },

  icone: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: '#EDE2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  iconeBloqueado: {
    backgroundColor: '#E9E9E9',
  },

  emoji: {
    fontSize: 27,
  },

  textos: {
    flex: 1,
  },

  conquistaTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },

  conquistaDescricao: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },

  status: {
    fontSize: 10,
    color: '#8E62B7',
    marginTop: 6,
  },

  textoBloqueado: {
    color: '#999999',
  },

  /* MENSAGEM */
  mensagem: {
    backgroundColor: '#F3E8FF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginTop: 10,
  },

  mensagemEmoji: {
    fontSize: 25,
    marginRight: 12,
  },

  mensagemTextoContainer: {
    flex: 1,
  },

  mensagemTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 4,
  },

  mensagemTexto: {
    fontSize: 12,
    color: '#6B5A80',
    lineHeight: 18,
  },
});
