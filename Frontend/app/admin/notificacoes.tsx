import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  NativeText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  destinatarios: string;
  data: string;
  status: 'Enviada' | 'Agendada';
};

export default function NotificacoesAdmin() {
  const router = useRouter();

  const [enviarEmail, setEnviarEmail] = useState(true);
  const [enviarPush, setEnviarPush] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: 1,
      titulo: 'Nova dica disponível!',
      mensagem: 'Confira os novos conteúdos da Biblioteca.',
      tipo: 'Conteúdo',
      destinatarios: 'Todos os usuários',
      data: '24/09/2026',
      status: 'Enviada',
    },
    {
      id: 2,
      titulo: 'Bem-vindo ao Premium',
      mensagem: 'Seu plano Premium está ativo.',
      tipo: 'Assinatura',
      destinatarios: 'Usuários Premium',
      data: '23/09/2026',
      status: 'Enviada',
    },
    {
      id: 3,
      titulo: 'Lembrete de tarefas',
      mensagem: 'Não se esqueça das suas tarefas de hoje.',
      tipo: 'Lembrete',
      destinatarios: 'Todos os usuários',
      data: '25/09/2026',
      status: 'Agendada',
    },
  ]);

  function enviarNotificacao() {
    if (!titulo.trim() || !mensagem.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha o título e a mensagem da notificação.'
      );

      return;
    }

    if (!enviarEmail && !enviarPush) {
      Alert.alert(
        'Escolha uma forma de envio',
        'Ative pelo menos Email ou Notificação Push.'
      );

      return;
    }

    const novaNotificacao: Notificacao = {
      id: Date.now(),
      titulo,
      mensagem,
      tipo: 'Informativo',
      destinatarios: 'Todos os usuários',
      data: '24/09/2026',
      status: 'Enviada',
    };

    setNotificacoes((lista) => [
      novaNotificacao,
      ...lista,
    ]);

    setTitulo('');
    setMensagem('');

    Alert.alert(
      'Notificação criada!',
      'A notificação foi adicionada à lista.'
    );
  }

  function excluirNotificacao(id: number) {
    Alert.alert(
      'Excluir notificação',
      'Deseja realmente excluir esta notificação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setNotificacoes((lista) =>
              lista.filter((item) => item.id !== id)
            );
          },
        },
      ]
    );
  }

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
          <Text style={styles.voltarTexto}>
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.tituloArea}>
          <Text style={styles.titulo}>
            Notificações
          </Text>

          <Text style={styles.subtitulo}>
            Gerencie as mensagens enviadas aos usuários
          </Text>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {notificacoes.length}
          </Text>

          <Text style={styles.resumoTexto}>
            Notificações
          </Text>
        </View>

        <View style={styles.linhaResumo} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {
              notificacoes.filter(
                (n) => n.status === 'Enviada'
              ).length
            }
          </Text>

          <Text style={styles.resumoTexto}>
            Enviadas
          </Text>
        </View>

        <View style={styles.linhaResumo} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {
              notificacoes.filter(
                (n) => n.status === 'Agendada'
              ).length
            }
          </Text>

          <Text style={styles.resumoTexto}>
            Agendadas
          </Text>
        </View>
      </View>

      {/* CRIAR NOTIFICAÇÃO */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          ➕ Nova notificação
        </Text>

        <Text style={styles.label}>
          Título
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Nova dica disponível!"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>
          Mensagem
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder="Digite a mensagem que os usuários receberão..."
          placeholderTextColor="#999"
          value={mensagem}
          onChangeText={setMensagem}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* FORMAS DE ENVIO */}
        <Text style={styles.label}>
          Formas de envio
        </Text>

        {/* EMAIL */}
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <Text style={styles.opcaoIcone}>
              📧
            </Text>

            <View>
              <Text style={styles.opcaoTitulo}>
                Email
              </Text>

              <Text style={styles.opcaoDescricao}>
                Enviar também por email
              </Text>
            </View>
          </View>

          <Switch
            value={enviarEmail}
            onValueChange={setEnviarEmail}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              enviarEmail ? '#7255B8' : '#FFF'
            }
          />
        </View>

        {/* NOTIFICAÇÃO PUSH */}
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <Text style={styles.opcaoIcone}>
              🔔
            </Text>

            <View>
              <Text style={styles.opcaoTitulo}>
                Notificação Push
              </Text>

              <Text style={styles.opcaoDescricao}>
                Mostrar no aplicativo
              </Text>
            </View>
          </View>

          <Switch
            value={enviarPush}
            onValueChange={setEnviarPush}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              enviarPush ? '#7255B8' : '#FFF'
            }
          />
        </View>

        <TouchableOpacity
          style={styles.botaoEnviar}
          onPress={enviarNotificacao}
        >
          <Text style={styles.botaoEnviarTexto}>
            📢 Enviar notificação
          </Text>
        </TouchableOpacity>
      </View>

      {/* HISTÓRICO */}
      <View style={styles.secao}>
        <View style={styles.secaoCabecalho}>
          <Text style={styles.secaoTitulo}>
            Histórico
          </Text>

          <Text style={styles.contador}>
            {notificacoes.length} registros
          </Text>
        </View>

        {notificacoes.map((item) => (
          <View
            key={item.id}
            style={styles.notificacaoCard}
          >
            <View style={styles.notificacaoTopo}>
              <View style={styles.iconeNotificacao}>
                <Text style={styles.iconeNotificacaoTexto}>
                  {item.tipo === 'Assinatura'
                    ? '⭐'
                    : item.tipo === 'Lembrete'
                    ? '⏰'
                    : '📢'}
                </Text>
              </View>

              <View style={styles.notificacaoTituloArea}>
                <Text style={styles.notificacaoTitulo}>
                  {item.titulo}
                </Text>

                <Text style={styles.data}>
                  {item.data}
                </Text>
              </View>

              <View
                style={[
                  styles.status,
                  item.status === 'Agendada'
                    ? styles.statusAgendada
                    : styles.statusEnviada,
                ]}
              >
                <Text
                  style={[
                    styles.statusTexto,
                    item.status === 'Agendada'
                      ? styles.statusTextoAgendada
                      : styles.statusTextoEnviada,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.mensagem}>
              {item.mensagem}
            </Text>

            <View style={styles.notificacaoRodape}>
              <Text style={styles.destinatarios}>
                👥 {item.destinatarios}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  excluirNotificacao(item.id)
                }
              >
                <Text style={styles.excluir}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingBottom: 40,
  },

  cabecalho: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
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

  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  resumoItem: {
    alignItems: 'center',
    flex: 1,
  },

  resumoNumero: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7255B8',
  },

  resumoTexto: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  linhaResumo: {
    width: 1,
    height: 35,
    backgroundColor: '#E5E1EC',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D315B',
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5068',
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    backgroundColor: '#F7F5FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E7E2EF',
  },

  textArea: {
    minHeight: 100,
    paddingTop: 13,
  },

  opcao: {
    backgroundColor: '#F8F6FC',
    borderRadius: 14,
    padding: 13,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  opcaoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  opcaoIcone: {
    fontSize: 22,
    marginRight: 11,
  },

  opcaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#433A50',
  },

  opcaoDescricao: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },

  botaoEnviar: {
    backgroundColor: '#7255B8',
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  botaoEnviarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  secao: {
    marginBottom: 20,
  },

  secaoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  secaoTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D315B',
  },

  contador: {
    fontSize: 12,
    color: '#888',
  },

  notificacaoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  notificacaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeNotificacao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  iconeNotificacaoTexto: {
    fontSize: 20,
  },

  notificacaoTituloArea: {
    flex: 1,
  },

  notificacaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#433A50',
  },

  data: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
  },

  status: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  statusEnviada: {
    backgroundColor: '#E8F7EE',
  },

  statusAgendada: {
    backgroundColor: '#FFF4D9',
  },

  statusTexto: {
    fontSize: 10,
    fontWeight: '600',
  },

  statusTextoEnviada: {
    color: '#31834B',
  },

  statusTextoAgendada: {
    color: '#9A7200',
  },

  mensagem: {
    fontSize: 13,
    lineHeight: 19,
    color: '#666',
    marginTop: 14,
    marginBottom: 14,
  },

  notificacaoRodape: {
    borderTopWidth: 1,
    borderTopColor: '#EEEAF2',
    paddingTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  destinatarios: {
    fontSize: 11,
    color: '#888',
  },

  excluir: {
    fontSize: 12,
    color: '#D15B65',
    fontWeight: '600',
  },
});