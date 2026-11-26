import { AccessibleText as Text } from '../components/Accessibility';
import React, { useCallback, useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { listarMetas, criarMeta as criarMetaBanco, atualizarMeta, excluirMeta } from '../services/database';

type Meta = {
  id: string;
  nome: string;
  concluida: boolean;
};

export default function Metas() {
  const router = useRouter();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [meta, setMeta] = useState('');

  const [metas, setMetas] = useState<Meta[]>([]);

  const carregarMetas = useCallback(async () => {
    try {
      const registros = await listarMetas();
      setMetas((registros || []).map((item: any) => ({
        id: item.id,
        nome: item.nome,
        concluida: item.status === 'concluida',
      })));
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível carregar suas metas.');
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarMetas(); }, [carregarMetas]));

  async function adicionarMeta() {
    if (!meta.trim()) {
      Alert.alert('Atenção', 'Digite o nome da meta.');
      return;
    }
    try {
      await criarMetaBanco(meta);
      setMeta('');
      setMostrarFormulario(false);
      await carregarMetas();
    } catch (error) {
      Alert.alert('Não foi possível criar a meta', error instanceof Error ? error.message : 'Tente novamente.');
    }
  }

  async function concluirMeta(index: number) {
    const item = metas[index];
    if (!item) return;
    const concluida = !item.concluida;
    try {
      await atualizarMeta(item.id, {
        status: concluida ? 'concluida' : 'ativa',
        progresso: concluida ? 100 : 0,
        concluida_em: concluida ? new Date().toISOString() : null,
      });
      await carregarMetas();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível atualizar a meta.');
    }
  }

  function apagarMeta(index: number) {
    Alert.alert(
      'Apagar meta',
      'Tem certeza que deseja apagar esta meta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirMeta(metas[index].id);
              await carregarMetas();
            } catch (error) {
              Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível apagar a meta.');
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.voltar}
        onPress={() => router.back()}
      >
        <Text style={styles.voltarTexto}>
          ‹ Voltar
        </Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.titulo}>
          🎯 Minhas Metas
        </Text>

        <Text style={styles.subtitulo}>
          Organize seus objetivos e acompanhe seu progresso.
        </Text>

        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
        >
          <Text style={styles.botaoAdicionarTexto}>
            + Adicionar nova meta
          </Text>
        </TouchableOpacity>

        {mostrarFormulario && (
          <View style={styles.formulario}>
            <Text style={styles.label}>
              Qual é a sua meta?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Aprender a cozinhar"
              value={meta}
              onChangeText={setMeta}
            />

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={adicionarMeta}
            >
              <Text style={styles.botaoSalvarTexto}>
                Salvar meta
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {metas.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>
              🌱
            </Text>

            <Text style={styles.vazioTitulo}>
              Você ainda não possui metas
            </Text>

            <Text style={styles.vazioTexto}>
              Adicione uma meta para começar a acompanhar
              seus objetivos.
            </Text>
          </View>
        ) : (
          metas.map((item, index) => (
            <View
              style={[
                styles.metaCard,
                item.concluida && styles.metaCardConcluida,
              ]}
              key={item.id}
            >
              <View style={styles.metaIcone}>
                <Text>
                  {item.concluida ? '✅' : '🎯'}
                </Text>
              </View>

              <View style={styles.metaTextos}>
                <Text
                  style={[
                    styles.metaTitulo,
                    item.concluida && styles.metaTituloConcluido,
                  ]}
                >
                  {item.nome}
                </Text>

                <Text
                  style={[
                    styles.metaStatus,
                    item.concluida && styles.metaStatusConcluido,
                  ]}
                >
                  {item.concluida
                    ? 'Concluída'
                    : 'Em andamento'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.botaoConcluir,
                  item.concluida &&
                    styles.botaoDesfazer,
                ]}
                onPress={() => concluirMeta(index)}
              >
                <Text style={styles.botaoConcluirTexto}>
                  {item.concluida ? '↩' : '✓'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoApagar}
                onPress={() => apagarMeta(index)}
              >
                <Text style={styles.botaoApagarTexto}>
                  🗑️
                </Text>
              </TouchableOpacity>
            </View>
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

  voltar: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  voltarTexto: {
    fontSize: 16,
    color: '#8E62B7',
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
    marginBottom: 22,
  },

  botaoAdicionar: {
    backgroundColor: '#8E62B7',
    borderRadius: 13,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#F8F5FC',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0D2EF',
    fontSize: 14,
  },

  botaoSalvar: {
    backgroundColor: '#8E62B7',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  vazio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
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

  metaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  metaCardConcluida: {
    backgroundColor: '#F0FAF3',
    borderColor: '#B8DEC1',
  },

  metaIcone: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F2EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaTextos: {
    marginLeft: 13,
    flex: 1,
  },

  metaTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 4,
  },

  metaTituloConcluido: {
    textDecorationLine: 'line-through',
    color: '#777',
  },

  metaStatus: {
    fontSize: 12,
    color: '#8E62B7',
  },

  metaStatusConcluido: {
    color: '#4C9A62',
  },

  botaoConcluir: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E8F7EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  botaoDesfazer: {
    backgroundColor: '#F0E5FA',
  },

  botaoConcluirTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C9A62',
  },

  botaoApagar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoApagarTexto: {
    fontSize: 18,
  },
});