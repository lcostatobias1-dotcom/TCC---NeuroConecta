import { AccessibleText as Text } from '../components/Accessibility';
import React, { useEffect, useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { obterConfiguracaoFinanceira, salvarSalario as salvarSalarioBanco, listarMovimentacoesFinanceiras, criarMovimentacao, atualizarMovimentacao, excluirMovimentacao } from '../services/database';

export default function Financas() {
  const router = useRouter();

  const [salario, setSalario] = useState(0);
  const [gastos, setGastos] = useState<{ id: string; nome: string; valor: number }[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  function mostrarAviso(texto: string) { setAviso(texto); setTimeout(() => setAviso(''), 2600); }

  useEffect(() => {
    carregarFinancas();
  }, []);

  async function carregarFinancas() {
    try {
      const [configuracao, movimentacoes] = await Promise.all([
        obterConfiguracaoFinanceira(),
        listarMovimentacoesFinanceiras(),
      ]);
      setSalario(Number(configuracao.salario_mensal || 0));
      setGastos((movimentacoes || [])
        .filter((item: any) => item.tipo === 'despesa')
        .map((item: any) => ({
          id: item.id,
          nome: item.descricao,
          valor: Number(item.valor),
        })));
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível carregar suas finanças.');
    } finally {
      setCarregando(false);
    }
  }

  const [mostrarSalario, setMostrarSalario] = useState(false);
  const [novoSalario, setNovoSalario] = useState('');

  const [mostrarGasto, setMostrarGasto] = useState(false);
  const [nomeGasto, setNomeGasto] = useState('');
  const [valorGasto, setValorGasto] = useState('');

  const totalGastos = gastos.reduce(
    (total, gasto) => total + gasto.valor,
    0
  );

  const disponivel = salario - totalGastos;

  async function salvarSalario() {
    const valor = Number(novoSalario.replace(',', '.'));

    if (!valor || valor <= 0) {
      Alert.alert(
        'Atenção',
        'Digite um valor válido para o salário.'
      );
      return;
    }

    try {
      await salvarSalarioBanco(valor);
      setSalario(valor);
      setNovoSalario('');
      setMostrarSalario(false);
      mostrarAviso('Renda atualizada com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível salvar sua renda.');
    }
  }

  async function adicionarGasto() {
    const valor = Number(valorGasto.replace(',', '.'));

    if (!nomeGasto || !valor || valor <= 0) {
      Alert.alert(
        'Atenção',
        'Preencha o nome e o valor do gasto.'
      );
      return;
    }

    try {
      if (editandoId) {
        await atualizarMovimentacao(editandoId, { descricao: nomeGasto.trim(), valor });
        mostrarAviso('Gasto atualizado.');
      } else {
        await criarMovimentacao({ descricao: nomeGasto.trim(), tipo: 'despesa', valor, pago: true });
        mostrarAviso('Gasto adicionado com sucesso.');
      }
      setNomeGasto('');
      setValorGasto('');
      setMostrarGasto(false);
      setEditandoId(null);
      await carregarFinancas();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível registrar o gasto.');
    }
  }

  function iniciarEdicao(gasto: {id:string;nome:string;valor:number}) {
    setEditandoId(gasto.id); setNomeGasto(gasto.nome); setValorGasto(String(gasto.valor).replace('.', ',')); setMostrarGasto(true);
  }
  async function removerGasto(id: string) {
    Alert.alert('Excluir gasto', 'Deseja realmente excluir este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await excluirMovimentacao(id); await carregarFinancas(); mostrarAviso('Gasto excluído.'); }
        catch (e) { mostrarAviso(e instanceof Error ? e.message : 'Não foi possível excluir o gasto.'); }
      } },
    ]);
  }

  function formatarDinheiro(valor: number) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botaoVoltar}
        >
          <Text style={styles.setaVoltar}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.titulo}>Finanças 💰</Text>
          <Text style={styles.subtitulo}>
            Organize seu dinheiro
          </Text>
        </View>
      </View>

      {aviso ? <View style={styles.toast}><Text style={styles.toastTexto}>{aviso}</Text></View> : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        {/* EXPLICAÇÃO */}
        <View style={styles.explicacao}>
          <Text style={styles.explicacaoTitulo}>
            Vamos organizar seu dinheiro?
          </Text>

          <Text style={styles.explicacaoTexto}>
            Veja quanto você recebe, quanto gastou e quanto ainda tem disponível.
          </Text>
        </View>

        {/* SALÁRIO */}
        <View style={styles.cardSalario}>
          <View style={styles.linhaTitulo}>
            <View>
              <Text style={styles.labelPequeno}>
                Minha renda mensal
              </Text>

              <Text style={styles.valorGrande}>
                {carregando ? 'Carregando...' : salario > 0
                  ? formatarDinheiro(salario)
                  : 'R$ 0,00'}
              </Text>
            </View>

            <Text style={styles.icone}>💵</Text>
          </View>

          {!mostrarSalario ? (
            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => setMostrarSalario(true)}
            >
              <Text style={styles.botaoSecundarioTexto}>
                {salario > 0
                  ? 'Alterar minha renda'
                  : 'Adicionar minha renda'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.label}>
                Quanto você recebe por mês?
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: 1500"
                keyboardType="numeric"
                value={novoSalario}
                onChangeText={setNovoSalario}
              />

              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={salvarSalario}
              >
                <Text style={styles.botaoPrincipalTexto}>
                  Salvar renda
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* RESUMO */}
        <Text style={styles.tituloSecao}>
          Resumo do mês
        </Text>

        <View style={styles.resumoContainer}>

          <View style={styles.resumoCard}>
            <Text style={styles.resumoIcone}>💰</Text>
            <Text style={styles.resumoLabel}>
              Você recebe
            </Text>
            <Text style={styles.resumoValor}>
              {formatarDinheiro(salario)}
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <Text style={styles.resumoIcone}>💸</Text>
            <Text style={styles.resumoLabel}>
              Você gastou
            </Text>
            <Text style={styles.resumoValor}>
              {formatarDinheiro(totalGastos)}
            </Text>
          </View>

        </View>

        {/* DINHEIRO DISPONÍVEL */}
        <View
          style={[
            styles.disponivelCard,
            disponivel < 0 && styles.disponivelNegativo,
          ]}
        >
          <Text style={styles.disponivelTitulo}>
            Dinheiro disponível
          </Text>

          <Text style={styles.disponivelValor}>
            {formatarDinheiro(disponivel)}
          </Text>

          <Text style={styles.disponivelTexto}>
            {disponivel > 0
              ? 'Esse é o valor que você ainda pode usar. 😊'
              : disponivel === 0
              ? 'Você usou todo o dinheiro disponível.'
              : 'Atenção: seus gastos passaram da sua renda.'}
          </Text>
        </View>

        {/* GASTOS */}
        <View style={styles.gastosCabecalho}>
          <Text style={styles.tituloSecao}>
            Meus gastos
          </Text>

          <Text style={styles.totalGastos}>
            {gastos.length} registros
          </Text>
        </View>

        {gastos.length === 0 ? (
          <View style={styles.semGastos}>
            <Text style={styles.semGastosEmoji}>
              📝
            </Text>

            <Text style={styles.semGastosTitulo}>
              Nenhum gasto registrado
            </Text>

            <Text style={styles.semGastosTexto}>
              Adicione seus gastos para acompanhar seu dinheiro.
            </Text>
          </View>
        ) : (
          gastos.map((gasto) => (
            <View
              key={gasto.id}
              style={styles.gastoCard}
            >
              <View style={styles.gastoIcone}>
                <Text>💸</Text>
              </View>

              <View style={styles.gastoInformacoes}>
                <Text style={styles.gastoNome}>
                  {gasto.nome}
                </Text>

                <Text style={styles.gastoDescricao}>
                  Gasto registrado
                </Text>
              </View>

              <View style={styles.acoesGasto}>
                <Text style={styles.gastoValor}>- {formatarDinheiro(gasto.valor)}</Text>
                <View style={styles.acoesLinha}>
                  <TouchableOpacity onPress={() => iniciarEdicao(gasto)}><Text style={styles.acaoEditar}>Editar</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => removerGasto(gasto.id)}><Text style={styles.acaoExcluir}>Excluir</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* ADICIONAR GASTO */}
        {!mostrarGasto ? (
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => setMostrarGasto(true)}
          >
            <Text style={styles.botaoAdicionarTexto}>
              + Adicionar gasto
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.formGasto}>

            <Text style={styles.formTitulo}>
              {editandoId ? 'Editar gasto' : 'Novo gasto'}
            </Text>

            <Text style={styles.label}>
              O que você comprou?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Mercado"
              value={nomeGasto}
              onChangeText={setNomeGasto}
            />

            <Text style={styles.label}>
              Quanto você gastou?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 50"
              keyboardType="numeric"
              value={valorGasto}
              onChangeText={setValorGasto}
            />

            <TouchableOpacity
              style={styles.botaoPrincipal}
              onPress={adicionarGasto}
            >
              <Text style={styles.botaoPrincipalTexto}>
                {editandoId ? 'Salvar alterações' : 'Adicionar gasto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setMostrarGasto(false); setEditandoId(null); setNomeGasto(''); setValorGasto(''); }}
            >
              <Text style={styles.cancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        )}

        {/* DICA */}
        <View style={styles.dica}>
          <Text style={styles.dicaEmoji}>💡</Text>

          <View style={styles.dicaConteudo}>
            <Text style={styles.dicaTitulo}>
              Dica
            </Text>

            <Text style={styles.dicaTexto}>
              Antes de comprar algo, veja quanto dinheiro você ainda tem disponível.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  setaVoltar: {
    fontSize: 32,
    color: '#555555',
    marginTop: -3,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222222',
  },

  subtitulo: {
    fontSize: 13,
    color: '#777777',
    marginTop: 3,
  },

  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  explicacao: {
    backgroundColor: '#EAF6EE',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  explicacaoTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#28643A',
    marginBottom: 6,
  },

  explicacaoTexto: {
    fontSize: 13,
    color: '#54705D',
    lineHeight: 19,
  },

  cardSalario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
  },

  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelPequeno: {
    fontSize: 13,
    color: '#777777',
  },

  valorGrande: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 5,
  },

  icone: {
    fontSize: 35,
  },

  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#8E62B7',
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
    marginTop: 16,
  },

  botaoSecundarioTexto: {
    color: '#5D568F',
    fontWeight: 'bold',
    fontSize: 14,
  },

  tituloSecao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },

  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  resumoCard: {
    width: '48%',
    backgroundColor: '#F7F7F7',
    borderRadius: 17,
    padding: 16,
  },

  resumoIcone: {
    fontSize: 23,
    marginBottom: 7,
  },

  resumoLabel: {
    fontSize: 12,
    color: '#777777',
  },

  resumoValor: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 5,
  },

  disponivelCard: {
    backgroundColor: '#E8F6EC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  disponivelNegativo: {
    backgroundColor: '#FCE8E8',
  },

  disponivelTitulo: {
    fontSize: 14,
    color: '#54705D',
  },

  disponivelValor: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#28643A',
    marginTop: 5,
  },

  disponivelTexto: {
    fontSize: 12,
    color: '#54705D',
    marginTop: 8,
    lineHeight: 18,
  },

  gastosCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalGastos: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },

  gastoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  gastoIcone: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  gastoInformacoes: {
    flex: 1,
  },

  gastoNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333',
  },

  gastoDescricao: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },

  gastoValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D9534F',
  },

  semGastos: {
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 15,
  },

  semGastosEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },

  semGastosTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444444',
  },

  semGastosTexto: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },

  botaoAdicionar: {
    backgroundColor: '#8E62B7',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  formGasto: {
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  formTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },

  botaoPrincipal: {
    backgroundColor: '#8E62B7',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },

  botaoPrincipalTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  cancelar: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 14,
    fontSize: 14,
  },

  dica: {
    backgroundColor: '#FFF7DD',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginTop: 5,
  },

  dicaEmoji: {
    fontSize: 25,
    marginRight: 12,
  },

  dicaConteudo: {
    flex: 1,
  },

  dicaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#765F20',
    marginBottom: 4,
  },

  dicaTexto: {
    fontSize: 12,
    color: '#766B4B',
    lineHeight: 18,
  },
  toast: { position: 'absolute', zIndex: 20, bottom: 18, left: 20, right: 20, backgroundColor: '#3F3150', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, elevation: 5 },
  toastTexto: { color: '#FFFFFF', textAlign: 'center', fontSize: 13, fontWeight: '600' },
  acoesGasto: { alignItems: 'flex-end', marginLeft: 8 },
  acoesLinha: { flexDirection: 'row', gap: 12, marginTop: 7 },
  acaoEditar: { color: '#70469A', fontSize: 12, fontWeight: 'bold' },
  acaoExcluir: { color: '#B42318', fontSize: 12, fontWeight: 'bold' },
});
