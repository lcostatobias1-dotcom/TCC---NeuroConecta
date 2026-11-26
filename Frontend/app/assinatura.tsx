import { AccessibleText as Text } from '../components/Accessibility';
import React from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Assinatura() {
  const router = useRouter();
  const params = useLocalSearchParams<{ periodo?: string; valor?: string }>();
  const anual = params.periodo === 'anual';
  const preco = anual ? 'R$ 299,00' : 'R$ 19,99';
  const periodoTexto = anual ? 'Anual' : 'Mensal';

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.avatar}>👤</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.titulo}>
          Assinatura
        </Text>

        <Text style={styles.subtitulo}>
          Confira os detalhes do seu plano antes de continuar.
        </Text>

        <View style={styles.cardPlano}>
          <View style={styles.linhaTopo}>
            <Text style={styles.nomePlano}>
              Premium
            </Text>

            <Text style={styles.emoji}>
              👑
            </Text>
          </View>

          <Text style={styles.preco}>
            {preco}
          </Text>

          <Text style={styles.periodo}>
            {anual ? 'por ano' : 'por mês'}
          </Text>

          <View style={styles.divisor} />

          <Text style={styles.item}>
            ✓ Conteúdos exclusivos
          </Text>

          <Text style={styles.item}>
            ✓ Mais recursos
          </Text>

          <Text style={styles.item}>
            ✓ Recursos personalizados
          </Text>

          <Text style={styles.item}>
            ✓ Experiência sem anúncios
          </Text>
        </View>

        <Text style={styles.tituloSecao}>
          Resumo
        </Text>

        <View style={styles.resumo}>
          <View style={styles.linhaResumo}>
            <Text style={styles.label}>
              Plano
            </Text>

            <Text style={styles.valor}>
              Premium
            </Text>
          </View>

          <View style={styles.linhaResumo}>
            <Text style={styles.label}>
              Período
            </Text>

            <Text style={styles.valor}>
              {periodoTexto}
            </Text>
          </View>

          <View style={styles.linhaResumo}>
            <Text style={styles.label}>
              Valor
            </Text>

            <Text style={styles.valorDestaque}>
              {preco}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.push({ pathname: '/pagamento', params: { periodo: anual ? 'anual' : 'mensal', valor: anual ? '299.00' : '19.99' } })}
        >
          <Text style={styles.textoBotao}>
            Continuar para pagamento
          </Text>
        </TouchableOpacity>

        <Text style={styles.aviso}>
          A cobrança será realizada somente após a confirmação
          do pagamento.
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
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 20,
  },

  cardPlano: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 2,
    borderColor: '#8E62B7',
  },

  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nomePlano: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5F407C',
  },

  emoji: {
    fontSize: 30,
  },

  preco: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#8E62B7',
    marginTop: 10,
  },

  periodo: {
    fontSize: 12,
    color: '#777',
  },

  divisor: {
    height: 1,
    backgroundColor: '#E5D9EE',
    marginVertical: 15,
  },

  item: {
    fontSize: 13,
    color: '#666',
    marginBottom: 9,
  },

  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5F407C',
    marginTop: 22,
    marginBottom: 12,
  },

  resumo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  label: {
    color: '#777',
    fontSize: 13,
  },

  valor: {
    color: '#5F407C',
    fontSize: 13,
    fontWeight: 'bold',
  },

  valorDestaque: {
    color: '#8E62B7',
    fontSize: 15,
    fontWeight: 'bold',
  },

  botao: {
    height: 50,
    borderRadius: 13,
    backgroundColor: '#8E62B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  aviso: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});