import { AccessibleText as Text } from '../components/Accessibility';
import React, { useEffect, useState } from 'react';

import {
  View,
  NativeText,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITOS_KEY = '@autonomia_favoritos';

export default function Dica() {
  const router = useRouter();

  const {
    titulo,
    emoji,
    conteudo,
  } = useLocalSearchParams();

  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    verificarFavorito();
  }, []);

  const verificarFavorito = async () => {
    try {
      const favoritosSalvos =
        await AsyncStorage.getItem(FAVORITOS_KEY);

      if (!favoritosSalvos) {
        return;
      }

      const favoritos = JSON.parse(favoritosSalvos);

      const existe = favoritos.some(
        (item: any) => item.titulo === titulo
      );

      setFavoritado(existe);
    } catch (error) {
      console.log(
        'Erro ao verificar favorito:',
        error
      );
    }
  };

  const alternarFavorito = async () => {
    try {
      const favoritosSalvos =
        await AsyncStorage.getItem(FAVORITOS_KEY);

      let favoritos = favoritosSalvos
        ? JSON.parse(favoritosSalvos)
        : [];

      if (favoritado) {
        favoritos = favoritos.filter(
          (item: any) => item.titulo !== titulo
        );

        await AsyncStorage.setItem(
          FAVORITOS_KEY,
          JSON.stringify(favoritos)
        );

        setFavoritado(false);

        Alert.alert(
          'Removido dos favoritos',
          'Esta dica foi removida dos seus favoritos.'
        );
      } else {
        const novaDica = {
          titulo,
          emoji,
          conteudo,
        };

        favoritos.push(novaDica);

        await AsyncStorage.setItem(
          FAVORITOS_KEY,
          JSON.stringify(favoritos)
        );

        setFavoritado(true);

        Alert.alert(
          'Adicionado aos favoritos ⭐',
          'Esta dica foi salva nos seus favoritos.'
        );
      }
    } catch (error) {
      console.log(
        'Erro ao salvar favorito:',
        error
      );

      Alert.alert(
        'Ops!',
        'Não foi possível salvar esta dica.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.voltar}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>
            {emoji || '💡'}
          </Text>
        </View>

        <Text style={styles.titulo}>
          {titulo || 'Dica'}
        </Text>
      </View>

      {/* BOTÃO FAVORITO */}
      <TouchableOpacity
        style={[
          styles.botaoFavorito,
          favoritado && styles.botaoFavoritado,
        ]}
        onPress={alternarFavorito}
        activeOpacity={0.8}
      >
        <Text style={styles.estrela}>
          {favoritado ? '⭐' : '☆'}
        </Text>

        <Text
          style={[
            styles.textoFavorito,
            favoritado && styles.textoFavoritado,
          ]}
        >
          {favoritado
            ? 'Remover dos favoritos'
            : 'Adicionar aos favoritos'}
        </Text>
      </TouchableOpacity>

      {/* CONTEÚDO */}
      <View style={styles.card}>
        <Text style={styles.conteudo}>
          {conteudo || 'Conteúdo da dica.'}
        </Text>
      </View>

      {/* VÍDEO */}
      <View style={styles.videoArea}>
        <Text style={styles.videoTitulo}>
          🎥 Vídeo explicativo
        </Text>

        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoEmoji}>
            ▶️
          </Text>

          <Text style={styles.videoTexto}>
            Vídeo sobre esta dica
          </Text>

          <Text style={styles.videoSubtexto}>
            O vídeo poderá ser adicionado futuramente.
          </Text>
        </View>
      </View>

      {/* MENSAGEM */}
      <View style={styles.mensagem}>
        <Text style={styles.mensagemEmoji}>
          💜
        </Text>

        <Text style={styles.mensagemTexto}>
          Aprender aos poucos também é uma forma de
          conquistar sua independência.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 55,
    alignItems: 'center',
  },

  voltar: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#8E62B7',
    marginBottom: 25,
  },

  emojiContainer: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#EDE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emoji: {
    fontSize: 50,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },

  botaoFavorito: {
    marginHorizontal: 20,
    marginBottom: 18,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D3FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoFavoritado: {
    backgroundColor: '#EDE9FF',
    borderColor: '#8E62B7',
  },

  estrela: {
    fontSize: 23,
    marginRight: 8,
  },

  textoFavorito: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E62B7',
  },

  textoFavoritado: {
    color: '#5148C7',
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    elevation: 2,
  },

  conteudo: {
    fontSize: 16,
    color: '#555',
    lineHeight: 25,
  },

  videoArea: {
    marginHorizontal: 20,
    marginBottom: 20,
  },

  videoTitulo: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  videoPlaceholder: {
    height: 190,
    backgroundColor: '#EDE9FF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  videoEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },

  videoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E62B7',
    marginBottom: 5,
  },

  videoSubtexto: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },

  mensagem: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#EDE9FF',
    borderRadius: 18,
    alignItems: 'center',
  },

  mensagemEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  mensagemTexto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    textAlign: 'center',
  },
});