import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  NativeText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

type Log = {
  id: number;
  acao: string;
  descricao: string;
  administrador: string;
  data: string;
  horario: string;
  tipo: 'Usuário' | 'Conteúdo' | 'Sistema' | 'Plano';
};

export default function LogsAdmin() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const logs: Log[] = [
    {
      id: 1,
      acao: 'Usuário desativado',
      descricao: 'A conta de João Santos foi desativada.',
      administrador: 'Laíse Ribeiro',
      data: '24/09/2026',
      horario: '08:42',
      tipo: 'Usuário',
    },
    {
      id: 2,
      acao: 'Conteúdo publicado',
      descricao:
        'Novo conteúdo adicionado à categoria Vida em Casa.',
      administrador: 'Maria Oliveira',
      data: '24/09/2026',
      horario: '08:15',
      tipo: 'Conteúdo',
    },
    {
      id: 3,
      acao: 'Plano atualizado',
      descricao:
        'Plano Premium foi atualizado pelo administrador.',
      administrador: 'Laíse Ribeiro',
      data: '23/09/2026',
      horario: '16:30',
      tipo: 'Plano',
    },
    {
      id: 4,
      acao: 'Configuração alterada',
      descricao:
        'Notificações administrativas foram modificadas.',
      administrador: 'Laíse Ribeiro',
      data: '23/09/2026',
      horario: '14:22',
      tipo: 'Sistema',
    },
    {
      id: 5,
      acao: 'Usuário cadastrado',
      descricao:
        'Novo usuário registrado no aplicativo.',
      administrador: 'Sistema',
      data: '23/09/2026',
      horario: '11:07',
      tipo: 'Usuário',
    },
    {
      id: 6,
      acao: 'Conteúdo editado',
      descricao:
        'Uma dica da Biblioteca foi atualizada.',
      administrador: 'Maria Oliveira',
      data: '22/09/2026',
      horario: '15:48',
      tipo: 'Conteúdo',
    },
  ];

  const filtros = [
    'Todos',
    'Usuário',
    'Conteúdo',
    'Plano',
    'Sistema',
  ];

  const logsFiltrados = logs.filter((log) => {
    const correspondeFiltro =
      filtro === 'Todos' || log.tipo === filtro;

    const textoBusca =
      `${log.acao} ${log.descricao} ${log.administrador}`.toLowerCase();

    const correspondeBusca = textoBusca.includes(
      busca.toLowerCase()
    );

    return correspondeFiltro && correspondeBusca;
  });

  function iconeTipo(tipo: Log['tipo']) {
    switch (tipo) {
      case 'Usuário':
        return '👤';

      case 'Conteúdo':
        return '📚';

      case 'Plano':
        return '⭐';

      case 'Sistema':
        return '⚙️';

      default:
        return '📋';
    }
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
            Logs do Sistema
          </Text>

          <Text style={styles.subtitulo}>
            Histórico das atividades administrativas
          </Text>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {logs.length}
          </Text>

          <Text style={styles.resumoTexto}>
            Atividades
          </Text>
        </View>

        <View style={styles.linhaResumo} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            3
          </Text>

          <Text style={styles.resumoTexto}>
            Administradores
          </Text>
        </View>

        <View style={styles.linhaResumo} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            Hoje
          </Text>

          <Text style={styles.resumoTexto}>
            Última atividade
          </Text>
        </View>
      </View>

      {/* BUSCA */}
      <View style={styles.busca}>
        <Text style={styles.iconeBusca}>
          🔎
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar atividade..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtros}
      >
        {filtros.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filtro,
              filtro === item && styles.filtroSelecionado,
            ]}
            onPress={() => setFiltro(item)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === item &&
                  styles.filtroTextoSelecionado,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* HISTÓRICO */}
      <View style={styles.listaCabecalho}>
        <Text style={styles.listaTitulo}>
          Atividades recentes
        </Text>

        <Text style={styles.contador}>
          {logsFiltrados.length} registros
        </Text>
      </View>

      {logsFiltrados.map((log) => (
        <View
          key={log.id}
          style={styles.logCard}
        >
          <View style={styles.logTopo}>
            <View style={styles.iconeLog}>
              <Text style={styles.iconeLogTexto}>
                {iconeTipo(log.tipo)}
              </Text>
            </View>

            <View style={styles.logInfo}>
              <Text style={styles.logAcao}>
                {log.acao}
              </Text>

              <Text style={styles.logData}>
                {log.data} • {log.horario}
              </Text>
            </View>

            <View style={styles.tipo}>
              <Text style={styles.tipoTexto}>
                {log.tipo}
              </Text>
            </View>
          </View>

          <Text style={styles.logDescricao}>
            {log.descricao}
          </Text>

          <View style={styles.logRodape}>
            <Text style={styles.administrador}>
              🛡️ {log.administrador}
            </Text>
          </View>
        </View>
      ))}

      {/* NENHUM RESULTADO */}
      {logsFiltrados.length === 0 && (
        <View style={styles.vazio}>
          <Text style={styles.vazioEmoji}>
            📋
          </Text>

          <Text style={styles.vazioTitulo}>
            Nenhum registro encontrado
          </Text>

          <Text style={styles.vazioTexto}>
            Tente alterar a busca ou o filtro selecionado.
          </Text>
        </View>
      )}

      {/* INFORMAÇÃO */}
      <View style={styles.info}>
        <Text style={styles.infoIcone}>
          🔐
        </Text>

        <View style={styles.infoArea}>
          <Text style={styles.infoTitulo}>
            Sobre os logs
          </Text>

          <Text style={styles.infoTexto}>
            Os logs permitem acompanhar as ações realizadas
            pelos administradores. Na versão final, esses
            registros serão armazenados no banco de dados.
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
    fontSize: 25,
    fontWeight: '700',
    color: '#3D315B',
  },

  subtitulo: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },

  resumoItem: {
    flex: 1,
    alignItems: 'center',
  },

  resumoNumero: {
    fontSize: 19,
    fontWeight: '700',
    color: '#7255B8',
  },

  resumoTexto: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
    textAlign: 'center',
  },

  linhaResumo: {
    width: 1,
    height: 34,
    backgroundColor: '#E8E3ED',
  },

  busca: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 12,
  },

  iconeBusca: {
    fontSize: 17,
    marginRight: 9,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },

  filtrosScroll: {
    marginBottom: 20,
  },

  filtros: {
    gap: 8,
  },

  filtro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  filtroSelecionado: {
    backgroundColor: '#7255B8',
  },

  filtroTexto: {
    fontSize: 11,
    color: '#777',
    fontWeight: '600',
  },

  filtroTextoSelecionado: {
    color: '#FFFFFF',
  },

  listaCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },

  listaTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D315B',
  },

  contador: {
    fontSize: 10,
    color: '#888',
  },

  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  logTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeLog: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  iconeLogTexto: {
    fontSize: 19,
  },

  logInfo: {
    flex: 1,
  },

  logAcao: {
    fontSize: 13,
    fontWeight: '700',
    color: '#453B50',
  },

  logData: {
    fontSize: 10,
    color: '#999',
    marginTop: 3,
  },

  tipo: {
    backgroundColor: '#F1ECF8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  tipoTexto: {
    fontSize: 9,
    color: '#7255B8',
    fontWeight: '700',
  },

  logDescricao: {
    fontSize: 11,
    color: '#666',
    lineHeight: 17,
    marginTop: 13,
    marginBottom: 12,
  },

  logRodape: {
    borderTopWidth: 1,
    borderTopColor: '#EEEAF2',
    paddingTop: 10,
  },

  administrador: {
    fontSize: 10,
    color: '#888',
  },

  vazio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  vazioEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },

  vazioTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4055',
  },

  vazioTexto: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },

  info: {
    backgroundColor: '#F0EBFA',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },

  infoIcone: {
    fontSize: 19,
    marginRight: 9,
  },

  infoArea: {
    flex: 1,
  },

  infoTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5E4B8B',
    marginBottom: 4,
  },

  infoTexto: {
    fontSize: 10,
    lineHeight: 15,
    color: '#6D6380',
  },
});