import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';

import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Pagamento() {
  const router = useRouter();
  const params = useLocalSearchParams<{ periodo?: string; valor?: string }>();
  const anual = params.periodo === 'anual';
  const preco = anual ? 'R$ 299,00' : 'R$ 19,99';

  const [metodo, setMetodo] = useState('cartao');

  function finalizarPagamento() {
    Alert.alert(
      'Pagamento',
      'Essa é uma tela demonstrativa do TCC. O pagamento real será conectado ao backend posteriormente.'
    );
  }

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.voltar}>
            ‹ Voltar
          </Text>
        </TouchableOpacity>

        <Text style={styles.avatar}>
          👤
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        <Text style={styles.titulo}>
          Pagamento
        </Text>

        <Text style={styles.subtitulo}>
          Escolha uma forma de pagamento para continuar.
        </Text>

        {/* RESUMO */}
        <View style={styles.resumo}>
          <View>
            <Text style={styles.nomePlano}>
              Plano Premium
            </Text>

            <Text style={styles.periodo}>
              Assinatura {anual ? 'anual' : 'mensal'}
            </Text>
          </View>

          <Text style={styles.preco}>
            {preco}
          </Text>
        </View>

        <Text style={styles.tituloSecao}>
          Forma de pagamento
        </Text>

        {/* CARTÃO */}
        <TouchableOpacity
          style={[
            styles.opcao,
            metodo === 'cartao' &&
              styles.opcaoSelecionada,
          ]}
          onPress={() => setMetodo('cartao')}
        >
          <Text style={styles.opcaoEmoji}>
            💳
          </Text>

          <View style={styles.opcaoTexto}>
            <Text style={styles.opcaoTitulo}>
              Cartão
            </Text>

            <Text style={styles.opcaoDescricao}>
              Crédito ou débito
            </Text>
          </View>

          <View style={styles.radio}>
            {metodo === 'cartao' && (
              <View style={styles.radioSelecionado} />
            )}
          </View>
        </TouchableOpacity>

        {/* PIX */}
        <TouchableOpacity
          style={[
            styles.opcao,
            metodo === 'pix' &&
              styles.opcaoSelecionada,
          ]}
          onPress={() => setMetodo('pix')}
        >
          <Text style={styles.opcaoEmoji}>
            💠
          </Text>

          <View style={styles.opcaoTexto}>
            <Text style={styles.opcaoTitulo}>
              Pix
            </Text>

            <Text style={styles.opcaoDescricao}>
              Pagamento instantâneo
            </Text>
          </View>

          <View style={styles.radio}>
            {metodo === 'pix' && (
              <View style={styles.radioSelecionado} />
            )}
          </View>
        </TouchableOpacity>

        {/* FORMULÁRIO DO CARTÃO */}
        {metodo === 'cartao' && (
          <View style={styles.formulario}>

            <Text style={styles.label}>
              Número do cartão
            </Text>

            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={19}
            />

            <Text style={styles.label}>
              Nome no cartão
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
            />

            <View style={styles.linhaInputs}>

              <View style={styles.inputPequeno}>
                <Text style={styles.label}>
                  Validade
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="MM/AA"
                />
              </View>

              <View style={styles.inputPequeno}>
                <Text style={styles.label}>
                  CVV
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="000"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>

            </View>
          </View>
        )}

        {/* PIX */}
        {metodo === 'pix' && (
          <View style={styles.pix}>
            <Text style={styles.pixEmoji}>
              💠
            </Text>

            <Text style={styles.pixTitulo}>
              Pagamento via Pix
            </Text>

            <Text style={styles.pixTexto}>
              O código Pix será disponibilizado quando
              o pagamento estiver conectado ao backend.
            </Text>
          </View>
        )}

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.botao}
          onPress={finalizarPagamento}
        >
          <Text style={styles.textoBotao}>
            Continuar • {preco}
          </Text>
        </TouchableOpacity>

        <Text style={styles.seguro}>
          🔒 Pagamento seguro
        </Text>

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
  },

  voltar: {
    fontSize: 16,
    color: '#8E62B7',
  },

  avatar: {
    fontSize: 25,
  },

  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5F407C',
    marginTop: 15,
  },

  subtitulo: {
    fontSize: 14,
    color: '#777',
    marginTop: 7,
    marginBottom: 20,
  },

  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  nomePlano: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  periodo: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  preco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8E62B7',
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F407C',
    marginTop: 22,
    marginBottom: 12,
  },

  opcao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  opcaoSelecionada: {
    borderColor: '#8E62B7',
    borderWidth: 2,
  },

  opcaoEmoji: {
    fontSize: 25,
    marginRight: 12,
  },

  opcaoTexto: {
    flex: 1,
  },

  opcaoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  opcaoDescricao: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8E62B7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelecionado: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8E62B7',
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#F8F5FC',
    borderWidth: 1,
    borderColor: '#E0D2EF',
    paddingHorizontal: 12,
    fontSize: 13,
    marginBottom: 13,
  },

  linhaInputs: {
    flexDirection: 'row',
    gap: 10,
  },

  inputPequeno: {
    flex: 1,
  },

  pix: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  pixEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  pixTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  pixTexto: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 7,
  },

  botao: {
    backgroundColor: '#8E62B7',
    height: 50,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  seguro: {
    textAlign: 'center',
    color: '#777',
    fontSize: 11,
    marginTop: 12,
  },
});