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
import { listarTarefas, atualizarTarefa } from '../services/database';

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  data?: string;
  horario?: string;
  repetir?: boolean;
  lembrete?: boolean;
  concluida: boolean;
};



export default function Tarefas() {
  const router = useRouter();

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // CARREGAR AS TAREFAS SALVAS
  const carregarTarefas = async () => {
    try {
      const registros = await listarTarefas();
      setTarefas((registros || []).map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        data: item.data_vencimento,
        horario: item.horario,
        repetir: item.repetir,
        lembrete: item.lembrete,
        concluida: item.status === 'concluida',
      })));
    } catch (error) {
      console.log('Erro ao carregar tarefas do Supabase:', error);
    }
  };

  // ATUALIZA A TELA SEMPRE QUE VOLTAR PARA ELA
  useFocusEffect(
    useCallback(() => {
      carregarTarefas();
    }, [])
  );

  // CONCLUIR TAREFA
  async function concluirTarefa(id: string) {
    const tarefa = tarefas.find((item) => item.id === id);
    if (!tarefa) return;
    const concluida = !tarefa.concluida;
    try {
      await atualizarTarefa(id, {
        status: concluida ? 'concluida' : 'pendente',
        concluida_em: concluida ? new Date().toISOString() : null,
      });
      await carregarTarefas();
    } catch (error) {
      console.log('Erro ao atualizar tarefa:', error);
    }
  }

  const concluidas = tarefas.filter(
    (tarefa) => tarefa.concluida
  ).length;

  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarTexto}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPreferencias}
          onPress={() =>
            router.push('/preferencias-tarefas' as any)
          }
        >
          <Text style={styles.preferenciasTexto}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* TÍTULO */}
        <Text style={styles.titulo}>
          ✅ Minhas Tarefas
        </Text>

        <Text style={styles.subtitulo}>
          Organize suas atividades e acompanhe o que já foi concluído.
        </Text>

        {/* PROGRESSO */}
        <View style={styles.progressoCard}>
          <View>
            <Text style={styles.progressoTitulo}>
              Seu progresso
            </Text>

            <Text style={styles.progressoTexto}>
              {concluidas} de {tarefas.length} tarefas concluídas
            </Text>
          </View>

          <Text style={styles.progressoEmoji}>
            🌟
          </Text>
        </View>

        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() =>
            router.push('/criar-tarefa' as any)
          }
        >
          <Text style={styles.botaoAdicionarTexto}>
            + Criar nova tarefa
          </Text>
        </TouchableOpacity>

        {/* TÍTULO DA LISTA */}
        <Text style={styles.secaoTitulo}>
          Minhas atividades
        </Text>

        {/* LISTA VAZIA */}
        {tarefas.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>
              📝
            </Text>

            <Text style={styles.vazioTitulo}>
              Nenhuma tarefa ainda
            </Text>

            <Text style={styles.vazioTexto}>
              Adicione uma tarefa para começar a organizar seu dia.
            </Text>
          </View>
        ) : (
          /* LISTA DE TAREFAS */
          tarefas.map((tarefa) => (
            <TouchableOpacity
              key={tarefa.id}
              style={styles.tarefa}
              onPress={() =>
                concluirTarefa(tarefa.id)
              }
            >
              {/* CHECKBOX */}
              <View
                style={[
                  styles.checkbox,
                  tarefa.concluida &&
                    styles.checkboxConcluido,
                ]}
              >
                {tarefa.concluida && (
                  <Text style={styles.check}>
                    ✓
                  </Text>
                )}
              </View>

              {/* INFORMAÇÕES */}
              <View style={styles.tarefaTextos}>
                <Text
                  style={[
                    styles.tarefaTitulo,
                    tarefa.concluida &&
                      styles.tarefaConcluida,
                  ]}
                >
                  {tarefa.titulo}
                </Text>

                {/* DESCRIÇÃO */}
                {tarefa.descricao ? (
                  <Text style={styles.tarefaDescricao}>
                    {tarefa.descricao}
                  </Text>
                ) : null}

                {/* DATA E HORÁRIO */}
                {(tarefa.data || tarefa.horario) && (
                  <Text style={styles.tarefaData}>
                    📅 {tarefa.data || 'Sem data'}
                    {tarefa.horario
                      ? ` • ⏰ ${tarefa.horario}`
                      : ''}
                  </Text>
                )}

                {/* STATUS */}
                <Text style={styles.tarefaStatus}>
                  {tarefa.concluida
                    ? 'Concluída'
                    : 'Pendente'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  cabecalho: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  voltar: {
    paddingHorizontal: 0,
  },

  voltarTexto: {
    fontSize: 16,
    color: '#8E62B7',
  },

  botaoPreferencias: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  preferenciasTexto: {
    fontSize: 21,
  },

  conteudo: {
    padding: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
    marginBottom: 20,
  },

  progressoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  progressoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  progressoTexto: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  progressoEmoji: {
    fontSize: 30,
  },

  botaoAdicionar: {
    backgroundColor: '#8E62B7',
    borderRadius: 13,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  secaoTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 12,
  },

  vazio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  vazioEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  vazioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F407C',
    textAlign: 'center',
    marginBottom: 7,
  },

  vazioTexto: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
  },

  tarefa: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8E62B7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxConcluido: {
    backgroundColor: '#8E62B7',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  tarefaTextos: {
    flex: 1,
    marginLeft: 13,
  },

  tarefaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  tarefaDescricao: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  tarefaData: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },

  tarefaStatus: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },
});