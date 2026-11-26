import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';

import {
  View,
  NativeText,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

type Conteudo = {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  status: string;
};

export default function ConteudosAdmin() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const [conteudos, setConteudos] = useState<Conteudo[]>([
    {
      id: 1,
      titulo: 'Como organizar o quarto',
      categoria: 'Vida em Casa',
      descricao: 'Dicas simples para manter o ambiente organizado.',
      status: 'Ativo',
    },
    {
      id: 2,
      titulo: 'Como controlar seus gastos',
      categoria: 'Finanças',
      descricao: 'Aprenda a organizar seu dinheiro.',
      status: 'Ativo',
    },
    {
      id: 3,
      titulo: 'Como se preparar para uma entrevista',
      categoria: 'Trabalho e Carreira',
      descricao: 'Orientações para se preparar para uma entrevista.',
      status: 'Ativo',
    },
    {
      id: 4,
      titulo: 'Como utilizar o transporte público',
      categoria: 'Vida Independente',
      descricao: 'Dicas para utilizar o transporte com mais autonomia.',
      status: 'Ativo',
    },
    {
      id: 5,
      titulo: 'Receitas simples',
      categoria: 'Cozinha e Alimentação',
      descricao: 'Receitas fáceis para o dia a dia.',
      status: 'Inativo',
    },
  ]);

  const categorias = [
    'Todos',
    'Vida em Casa',
    'Finanças',
    'Trabalho e Carreira',
    'Vida Independente',
    'Cozinha e Alimentação',
  ];

  const filtrados = conteudos.filter((item) => {
    const correspondeBusca = item.titulo
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeCategoria =
      filtro === 'Todos' || item.categoria === filtro;

    return correspondeBusca && correspondeCategoria;
  });

  const alternarStatus = (id: number) => {
    setConteudos((lista) =>
      lista.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Ativo' ? 'Inativo' : 'Ativo',
            }
          : item
      )
    );
  };

  const adicionarConteudo = () => {
    Alert.alert(
      'Adicionar conteúdo',
      'A tela de cadastro de conteúdo será criada na próxima etapa.'
    );
  };

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>
          Conteúdos
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* TÍTULO */}
        <View style={styles.tituloArea}>
          <View>
            <Text style={styles.titulo}>
              Biblioteca de conteúdos
            </Text>

            <Text style={styles.subtitulo}>
              Gerencie as dicas disponíveis no aplicativo.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarConteudo}
          >
            <Text style={styles.botaoAdicionarTexto}>
              + Adicionar
            </Text>
          </TouchableOpacity>
        </View>

        {/* BUSCA */}
        <TextInput
          style={styles.busca}
          placeholder="🔎 Pesquisar conteúdo..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />

        {/* CATEGORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categorias}
        >
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.filtro,
                filtro === categoria && styles.filtroSelecionado,
              ]}
              onPress={() => setFiltro(categoria)}
            >
              <Text
                style={[
                  styles.filtroTexto,
                  filtro === categoria &&
                    styles.filtroTextoSelecionado,
                ]}
              >
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* QUANTIDADE */}
        <Text style={styles.quantidade}>
          {filtrados.length} conteúdo(s)
        </Text>

        {/* LISTA */}
        {filtrados.map((item) => (
          <View
            key={item.id}
            style={styles.card}
          >
            <View style={styles.icone}>
              <Text style={styles.iconeTexto}>
                📚
              </Text>
            </View>

            <View style={styles.informacoes}>
              <Text style={styles.nome}>
                {item.titulo}
              </Text>

              <Text style={styles.categoria}>
                {item.categoria}
              </Text>

              <Text style={styles.descricao}>
                {item.descricao}
              </Text>

              <View style={styles.rodapeCard}>
                <Text
                  style={[
                    styles.status,
                    item.status === 'Ativo'
                      ? styles.statusAtivo
                      : styles.statusInativo,
                  ]}
                >
                  {item.status}
                </Text>

                <View style={styles.acoes}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() =>
                      Alert.alert(
                        'Editar conteúdo',
                        'A edição será conectada ao banco de dados posteriormente.'
                      )
                    }
                  >
                    <Text style={styles.editarTexto}>
                      ✏️ Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoDesativar}
                    onPress={() => alternarStatus(item.id)}
                  >
                    <Text style={styles.desativarTexto}>
                      {item.status === 'Ativo'
                        ? 'Desativar'
                        : 'Ativar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* VAZIO */}
        {filtrados.length === 0 && (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>
              📚
            </Text>

            <Text style={styles.vazioTitulo}>
              Nenhum conteúdo encontrado
            </Text>

            <Text style={styles.vazioTexto}>
              Tente pesquisar outro conteúdo ou categoria.
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  tituloArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    maxWidth: 230,
  },

  botaoAdicionar: {
    backgroundColor: '#7651B8',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },

  busca: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E6DDF2',
  },

  categorias: {
    marginTop: 15,
    marginBottom: 5,
  },

  filtro: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
  },

  filtroSelecionado: {
    backgroundColor: '#7651B8',
  },

  filtroTexto: {
    color: '#666',
    fontSize: 12,
  },

  filtroTextoSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  quantidade: {
    fontSize: 14,
    color: '#777',
    marginTop: 12,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },

  icone: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEE4FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeTexto: {
    fontSize: 23,
  },

  informacoes: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  categoria: {
    fontSize: 12,
    color: '#7651B8',
    fontWeight: '600',
    marginTop: 3,
  },

  descricao: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    lineHeight: 17,
  },

  rodapeCard: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
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

  acoes: {
    flexDirection: 'row',
    gap: 7,
  },

  botaoEditar: {
    backgroundColor: '#F0E9FA',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  editarTexto: {
    color: '#6845A5',
    fontSize: 11,
    fontWeight: 'bold',
  },

  botaoDesativar: {
    backgroundColor: '#F7F0F2',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  desativarTexto: {
    color: '#C44D61',
    fontSize: 11,
    fontWeight: 'bold',
  },

  vazio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 35,
    alignItems: 'center',
    marginTop: 10,
  },

  vazioEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  vazioTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  vazioTexto: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
  },
});