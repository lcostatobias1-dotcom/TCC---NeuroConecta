import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

const usuarios = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria@email.com',
    plano: 'Premium',
    status: 'Ativo',
  },
  {
    id: '2',
    nome: 'João Santos',
    email: 'joao@email.com',
    plano: 'Gratuito',
    status: 'Ativo',
  },
  {
    id: '3',
    nome: 'Ana Oliveira',
    email: 'ana@email.com',
    plano: 'Premium',
    status: 'Inativo',
  },
  {
    id: '4',
    nome: 'Lucas Souza',
    email: 'lucas@email.com',
    plano: 'Gratuito',
    status: 'Ativo',
  },
  {
    id: '5',
    nome: 'Julia Costa',
    email: 'julia@email.com',
    plano: 'Premium',
    status: 'Ativo',
  },
];

export default function UsuariosAdmin() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const correspondeBusca =
      usuario.nome
        .toLowerCase()
        .includes(busca.toLowerCase()) ||
      usuario.email
        .toLowerCase()
        .includes(busca.toLowerCase());

    const correspondeFiltro =
      filtro === 'Todos' ||
      usuario.plano === filtro ||
      usuario.status === filtro;

    return correspondeBusca && correspondeFiltro;
  });

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
          Usuários
        </Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          Usuários cadastrados
        </Text>

        <Text style={styles.subtitulo}>
          Consulte e gerencie os usuários do aplicativo.
        </Text>

        {/* PESQUISA */}
        <TextInput
          style={styles.busca}
          placeholder="🔎 Pesquisar usuário..."
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor="#999"
        />

        {/* FILTROS */}
        <View style={styles.filtros}>
          {[
            'Todos',
            'Ativo',
            'Inativo',
            'Premium',
            'Gratuito',
          ].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filtro,
                filtro === item &&
                  styles.filtroSelecionado,
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
        </View>

        <Text style={styles.quantidade}>
          {usuariosFiltrados.length} usuário(s)
        </Text>

        {/* LISTA DE USUÁRIOS */}
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: '../admin/usuarios',
                  params: {
                    nome: item.nome,
                    email: item.email,
                    plano: item.plano,
                    status: item.status,
                  },
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>
                  {item.nome.charAt(0)}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.nome}>
                  {item.nome}
                </Text>

                <Text style={styles.email}>
                  {item.email}
                </Text>

                <View style={styles.tags}>
                  <Text
                    style={[
                      styles.tag,
                      item.plano === 'Premium'
                        ? styles.premium
                        : styles.gratuito,
                    ]}
                  >
                    {item.plano}
                  </Text>

                  <Text
                    style={[
                      styles.tag,
                      item.status === 'Ativo'
                        ? styles.ativo
                        : styles.inativo,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.seta}>
                ›
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
    flex: 1,
    padding: 20,
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
    marginBottom: 18,
  },

  busca: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E6DDF2',
  },

  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 8,
  },

  filtro: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
  },

  filtroSelecionado: {
    backgroundColor: '#7651B8',
  },

  filtroTexto: {
    color: '#666',
    fontSize: 13,
  },

  filtroTextoSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  quantidade: {
    fontSize: 14,
    color: '#777',
    marginTop: 18,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5D8F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6845A5',
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D3675',
  },

  email: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  tags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 7,
  },

  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 10,
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

  seta: {
    fontSize: 28,
    color: '#B0A5C0',
  },
});