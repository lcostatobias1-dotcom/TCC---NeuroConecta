import { AccessibleText as Text } from '../components/Accessibility';
import React, {
    useCallback,
    useState,
  } from 'react';
  
  import {
    View,
    NativeText,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
  } from 'react-native';
  
  import {
    useFocusEffect,
    useRouter,
  } from 'expo-router';
  
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const FAVORITOS_KEY = '@autonomia_favoritos';
  
  export default function Favoritos() {
    const router = useRouter();
  
    const [favoritos, setFavoritos] = useState<any[]>([]);
  
    useFocusEffect(
      useCallback(() => {
        carregarFavoritos();
      }, [])
    );
  
    const carregarFavoritos = async () => {
      try {
        const favoritosSalvos =
          await AsyncStorage.getItem(FAVORITOS_KEY);
  
        if (favoritosSalvos) {
          setFavoritos(JSON.parse(favoritosSalvos));
        } else {
          setFavoritos([]);
        }
      } catch (error) {
        console.log(
          'Erro ao carregar favoritos:',
          error
        );
      }
    };
  
    const abrirDica = (dica: any) => {
      router.push({
        pathname: '/dica' as any,
        params: {
          titulo: dica.titulo,
          emoji: dica.emoji,
          conteudo: dica.conteudo,
        },
      });
    };
  
    const removerFavorito = (titulo: string) => {
      Alert.alert(
        'Remover favorito',
        'Deseja remover esta dica dos favoritos?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                const novosFavoritos =
                  favoritos.filter(
                    (item) => item.titulo !== titulo
                  );
  
                await AsyncStorage.setItem(
                  FAVORITOS_KEY,
                  JSON.stringify(novosFavoritos)
                );
  
                setFavoritos(novosFavoritos);
              } catch (error) {
                console.log(
                  'Erro ao remover favorito:',
                  error
                );
              }
            },
          },
        ]
      );
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
  
          <Text style={styles.titulo}>
            ⭐ Favoritos
          </Text>
  
          <Text style={styles.subtitulo}>
            Aqui estão as dicas que você salvou para
            consultar quando quiser.
          </Text>
        </View>
  
        {/* CONTADOR */}
        <View style={styles.contador}>
          <Text style={styles.contadorNumero}>
            {favoritos.length}
          </Text>
  
          <Text style={styles.contadorTexto}>
            {favoritos.length === 1
              ? 'dica salva'
              : 'dicas salvas'}
          </Text>
        </View>
  
        {/* LISTA */}
        <View style={styles.lista}>
          {favoritos.map((dica, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <TouchableOpacity
                style={styles.areaDica}
                onPress={() => abrirDica(dica)}
                activeOpacity={0.8}
              >
                <View style={styles.emojiContainer}>
                  <Text style={styles.emoji}>
                    {dica.emoji || '💡'}
                  </Text>
                </View>
  
                <View style={styles.conteudoCard}>
                  <Text style={styles.cardTitulo}>
                    {dica.titulo}
                  </Text>
  
                  <Text
                    style={styles.cardDescricao}
                    numberOfLines={2}
                  >
                    {dica.conteudo}
                  </Text>
  
                  <Text style={styles.verDica}>
                    Ver dica →
                  </Text>
                </View>
              </TouchableOpacity>
  
              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() =>
                  removerFavorito(dica.titulo)
                }
              >
                <Text style={styles.remover}>
                  ⭐
                </Text>
              </TouchableOpacity>
            </View>
          ))}
  
          {/* SEM FAVORITOS */}
          {favoritos.length === 0 && (
            <View style={styles.vazio}>
              <Text style={styles.vazioEmoji}>
                ⭐
              </Text>
  
              <Text style={styles.vazioTitulo}>
                Você ainda não tem favoritos
              </Text>
  
              <Text style={styles.vazioTexto}>
                Quando encontrar uma dica que quiser
                guardar, toque em "Adicionar aos
                favoritos".
              </Text>
  
              <TouchableOpacity
                style={styles.botaoBiblioteca}
                onPress={() =>
                  router.push('/biblioteca' as any)
                }
              >
                <Text style={styles.botaoBibliotecaTexto}>
                  📚 Ir para Biblioteca
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
  
        {/* MENSAGEM */}
        {favoritos.length > 0 && (
          <View style={styles.mensagem}>
            <Text style={styles.mensagemEmoji}>
              💜
            </Text>
  
            <Text style={styles.mensagemTexto}>
              Suas dicas favoritas ficam guardadas para
              você consultar sempre que precisar.
            </Text>
          </View>
        )}
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
      paddingBottom: 15,
    },
  
    voltar: {
      fontSize: 16,
      color: '#8E62B7',
      marginBottom: 25,
    },
  
    titulo: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
  
    subtitulo: {
      fontSize: 16,
      color: '#666',
      lineHeight: 23,
    },
  
    contador: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 18,
      backgroundColor: '#EDE9FF',
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    contadorNumero: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#8E62B7',
      marginRight: 8,
    },
  
    contadorTexto: {
      fontSize: 15,
      color: '#555',
    },
  
    lista: {
      paddingHorizontal: 20,
    },
  
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      padding: 15,
      marginBottom: 14,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    areaDica: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    emojiContainer: {
      width: 55,
      height: 55,
      borderRadius: 15,
      backgroundColor: '#F0EDFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
  
    emoji: {
      fontSize: 30,
    },
  
    conteudoCard: {
      flex: 1,
    },
  
    cardTitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
  
    cardDescricao: {
      fontSize: 13,
      color: '#777',
      lineHeight: 18,
    },
  
    verDica: {
      fontSize: 13,
      color: '#8E62B7',
      fontWeight: '600',
      marginTop: 6,
    },
  
    botaoRemover: {
      padding: 8,
      marginLeft: 5,
    },
  
    remover: {
      fontSize: 22,
    },
  
    vazio: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      padding: 30,
      alignItems: 'center',
      elevation: 2,
    },
  
    vazioEmoji: {
      fontSize: 50,
      marginBottom: 15,
    },
  
    vazioTitulo: {
      fontSize: 19,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 8,
    },
  
    vazioTexto: {
      fontSize: 14,
      color: '#777',
      lineHeight: 21,
      textAlign: 'center',
      marginBottom: 20,
    },
  
    botaoBiblioteca: {
      backgroundColor: '#8E62B7',
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
  
    botaoBibliotecaTexto: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
  
    mensagem: {
      marginHorizontal: 20,
      marginTop: 5,
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