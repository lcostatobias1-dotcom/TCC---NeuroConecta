import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function TermosDeUso() {
  const router = useRouter();

  // Controla o checkbox
  const [concordou, setConcordou] = useState(false);

  return (
    <View style={styles.container}>

      {/* Barra superior */}
      <View style={styles.topo}>
        <Text style={styles.tituloTopo}>
          Termos de uso
        </Text>
      </View>

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botaoVoltar}
        >
          <Text style={styles.voltar}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Termos de uso
        </Text>

      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Ilustração */}
        <View style={styles.iconeContainer}>
          <View style={styles.documento}>
            <Text style={styles.iconeDocumento}>📄</Text>
          </View>

          <Text style={styles.caneta}>🖊️</Text>
        </View>

        {/* Data */}
        <Text style={styles.atualizacao}>
          Última atualização: 06 de agosto de 2026
        </Text>

        {/* Introdução */}
        <Text style={styles.texto}>
          Bem-vindo ao NeuroConecta! Ao utilizar o aplicativo,
          você concorda com os presentes Termos de Uso.
          Leia atentamente as informações abaixo antes de
          utilizar nossos serviços.
        </Text>

        {/* 1 */}
        <Text style={styles.subtitulo}>
          1. Sobre o NeuroConecta
        </Text>

        <Text style={styles.texto}>
          O NeuroConecta é um aplicativo desenvolvido para
          auxiliar na organização da rotina e incentivar a
          autonomia dos usuários por meio de ferramentas
          como tarefas, metas, lembretes e organização
          financeira.
        </Text>

        {/* 2 */}
        <Text style={styles.subtitulo}>
          2. Uso do aplicativo
        </Text>

        <Text style={styles.texto}>
          O usuário deve utilizar o aplicativo de forma
          responsável e de acordo com suas finalidades.
          Não é permitido utilizar o aplicativo para
          atividades ilegais ou que prejudiquem outros
          usuários.
        </Text>

        {/* 3 */}
        <Text style={styles.subtitulo}>
          3. Conta do usuário
        </Text>

        <Text style={styles.texto}>
          O usuário é responsável por manter seus dados
          atualizados e por proteger as informações de acesso
          à sua conta.
        </Text>

        {/* 4 */}
        <Text style={styles.subtitulo}>
          4. Alterações dos termos
        </Text>

        <Text style={styles.texto}>
          Estes Termos de Uso podem ser atualizados quando
          necessário. Caso ocorram mudanças importantes,
          o usuário poderá ser informado por meio do
          aplicativo.
        </Text>

        {/* 5 */}
        <Text style={styles.subtitulo}>
          5. Aceitação
        </Text>

        <Text style={styles.texto}>
          Ao marcar a opção abaixo e selecionar "Entendi",
          você confirma que leu e concorda com estes
          Termos de Uso.
        </Text>

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* Rodapé */}
      <View style={styles.rodape}>

        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setConcordou(!concordou)}
        >
          <Text style={styles.checkboxTexto}>
            {concordou ? '☑' : '□'}
          </Text>
        </TouchableOpacity>

        {/* Texto */}
        <Text style={styles.concordancia}>
          Li e concordo com os Termos de Uso
        </Text>

        {/* Ir para Política de Privacidade */}
        <TouchableOpacity
          onPress={() => router.push('/politica-privacidade')}
        >
          <Text style={styles.link}>
            Ver Política de Privacidade
          </Text>
        </TouchableOpacity>

        {/* Entendi */}
        <TouchableOpacity
          style={[
            styles.entendi,
            !concordou && styles.entendiDesabilitado,
          ]}
          disabled={!concordou}
          onPress={() => router.back()}
        >
          <Text style={styles.textoEntendi}>
            Entendi
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  /* BARRA SUPERIOR */
  topo: {
    height: 36,
    backgroundColor: '#9B9799',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tituloTopo: {
    color: '#FFF',
    fontSize: 14,
  },

  /* CABEÇALHO */
  cabecalho: {
    height: 52,
    backgroundColor: '#E8DCFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  botaoVoltar: {
    width: 40,
    height: 45,
    justifyContent: 'center',
  },

  voltar: {
    fontSize: 40,
    color: '#111',
    lineHeight: 40,
  },

  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
    marginLeft: 10,
  },

  /* CONTEÚDO */
  scroll: {
    flex: 1,
    paddingHorizontal: 14,
  },

  /* ÍCONE */
  iconeContainer: {
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  documento: {
    width: 72,
    height: 82,
    borderRadius: 8,
    backgroundColor: '#E4D7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconeDocumento: {
    fontSize: 42,
  },

  caneta: {
    position: 'absolute',
    right: 75,
    bottom: 10,
    fontSize: 28,
  },

  /* TEXTO */
  atualizacao: {
    fontSize: 11,
    color: '#555',
    marginBottom: 12,
  },

  subtitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 6,
    marginBottom: 5,
  },

  texto: {
    fontSize: 11,
    color: '#333',
    lineHeight: 16,
    marginBottom: 10,
  },

  /* RODAPÉ */
  rodape: {
    backgroundColor: '#E8DCFF',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
  },

  checkbox: {
    position: 'absolute',
    left: 10,
    top: 8,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxTexto: {
    fontSize: 22,
    color: '#8E62B7',
  },

  concordancia: {
    fontSize: 10,
    color: '#555',
    marginLeft: 30,
    marginBottom: 3,
  },

  link: {
    fontSize: 10,
    color: '#8E62B7',
    textDecorationLine: 'underline',
    marginLeft: 30,
    marginBottom: 7,
  },

  /* BOTÃO */
  entendi: {
    height: 32,
    backgroundColor: '#8E62B7',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  entendiDesabilitado: {
    backgroundColor: '#BDA6D8',
  },

  textoEntendi: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },

});