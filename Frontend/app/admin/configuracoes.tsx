import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  NativeText,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ConfiguracoesAdmin() {
  const router = useRouter();

  const [manutencao, setManutencao] = useState(false);
  const [novosUsuarios, setNovosUsuarios] = useState(true);
  const [novasAssinaturas, setNovasAssinaturas] = useState(true);
  const [relatoriosAutomaticos, setRelatoriosAutomaticos] =
    useState(true);

  function salvarConfiguracoes() {
    Alert.alert(
      'Configurações salvas',
      'As configurações administrativas foram atualizadas.'
    );
  }

  function confirmarManutencao(valor: boolean) {
    if (valor) {
      Alert.alert(
        'Modo manutenção',
        'Ao ativar, o aplicativo poderá ficar temporariamente indisponível para os usuários.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setManutencao(false),
          },
          {
            text: 'Ativar',
            onPress: () => setManutencao(true),
          },
        ]
      );
    } else {
      setManutencao(false);
    }
  }

  function abrirAdministradores() {
    router.push('/admin/administradores' as any);
  }

  function abrirLogs() {
    router.push('/admin/logs' as any);
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
            Configurações
          </Text>

          <Text style={styles.subtitulo}>
            Configurações gerais do painel administrativo
          </Text>
        </View>
      </View>

      {/* SISTEMA */}
      <Text style={styles.secaoTitulo}>
        ⚙️ Sistema
      </Text>

      <View style={styles.card}>
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <View style={styles.icone}>
              <Text>🔧</Text>
            </View>

            <View style={styles.textos}>
              <Text style={styles.opcaoTitulo}>
                Modo manutenção
              </Text>

              <Text style={styles.opcaoDescricao}>
                Pausar temporariamente o acesso dos usuários
              </Text>
            </View>
          </View>

          <Switch
            value={manutencao}
            onValueChange={confirmarManutencao}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              manutencao ? '#7255B8' : '#FFFFFF'
            }
          />
        </View>

        {manutencao && (
          <View style={styles.alerta}>
            <Text style={styles.alertaIcone}>
              ⚠️
            </Text>

            <Text style={styles.alertaTexto}>
              O modo manutenção está ativado. Essa opção é
              demonstrativa nesta versão do aplicativo.
            </Text>
          </View>
        )}
      </View>

      {/* NOTIFICAÇÕES */}
      <Text style={styles.secaoTitulo}>
        🔔 Notificações administrativas
      </Text>

      <View style={styles.card}>
        {/* NOVOS USUÁRIOS */}
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <View style={styles.icone}>
              <Text>👤</Text>
            </View>

            <View style={styles.textos}>
              <Text style={styles.opcaoTitulo}>
                Novos usuários
              </Text>

              <Text style={styles.opcaoDescricao}>
                Avisar quando uma nova conta for criada
              </Text>
            </View>
          </View>

          <Switch
            value={novosUsuarios}
            onValueChange={setNovosUsuarios}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              novosUsuarios ? '#7255B8' : '#FFFFFF'
            }
          />
        </View>

        <View style={styles.divisor} />

        {/* NOVAS ASSINATURAS */}
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <View style={styles.icone}>
              <Text>⭐</Text>
            </View>

            <View style={styles.textos}>
              <Text style={styles.opcaoTitulo}>
                Novas assinaturas
              </Text>

              <Text style={styles.opcaoDescricao}>
                Avisar quando alguém assinar o Premium
              </Text>
            </View>
          </View>

          <Switch
            value={novasAssinaturas}
            onValueChange={setNovasAssinaturas}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              novasAssinaturas ? '#7255B8' : '#FFFFFF'
            }
          />
        </View>

        <View style={styles.divisor} />

        {/* RELATÓRIOS AUTOMÁTICOS */}
        <View style={styles.opcao}>
          <View style={styles.opcaoInfo}>
            <View style={styles.icone}>
              <Text>📊</Text>
            </View>

            <View style={styles.textos}>
              <Text style={styles.opcaoTitulo}>
                Relatórios automáticos
              </Text>

              <Text style={styles.opcaoDescricao}>
                Receber atualizações dos relatórios
              </Text>
            </View>
          </View>

          <Switch
            value={relatoriosAutomaticos}
            onValueChange={setRelatoriosAutomaticos}
            trackColor={{
              false: '#DDD',
              true: '#B7A7E8',
            }}
            thumbColor={
              relatoriosAutomaticos
                ? '#7255B8'
                : '#FFFFFF'
            }
          />
        </View>
      </View>

      {/* GERENCIAMENTO */}
      <Text style={styles.secaoTitulo}>
        👥 Gerenciamento
      </Text>

      <View style={styles.card}>
        {/* ADMINISTRADORES */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={abrirAdministradores}
        >
          <View style={styles.menuIcone}>
            <Text>🛡️</Text>
          </View>

          <View style={styles.menuTextos}>
            <Text style={styles.menuTitulo}>
              Administradores
            </Text>

            <Text style={styles.menuDescricao}>
              Gerencie os acessos dos administradores
            </Text>
          </View>

          <Text style={styles.seta}>
            ›
          </Text>
        </TouchableOpacity>

        <View style={styles.divisor} />

        {/* LOGS */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={abrirLogs}
        >
          <View style={styles.menuIcone}>
            <Text>📋</Text>
          </View>

          <View style={styles.menuTextos}>
            <Text style={styles.menuTitulo}>
              Logs do sistema
            </Text>

            <Text style={styles.menuDescricao}>
              Consulte as atividades realizadas no painel
            </Text>
          </View>

          <Text style={styles.seta}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFORMAÇÕES */}
      <Text style={styles.secaoTitulo}>
        ℹ️ Informações
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>
            Aplicativo
          </Text>

          <Text style={styles.infoValor}>
            Autonomia+
          </Text>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>
            Versão
          </Text>

          <Text style={styles.infoValor}>
            1.0.0
          </Text>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>
            Ambiente
          </Text>

          <View style={styles.ambiente}>
            <Text style={styles.ambienteTexto}>
              Desenvolvimento
            </Text>
          </View>
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>
            Banco de dados
          </Text>

          <Text style={styles.infoValor}>
            MySQL
          </Text>
        </View>
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarConfiguracoes}
      >
        <Text style={styles.botaoSalvarTexto}>
          💾 Salvar configurações
        </Text>
      </TouchableOpacity>

      {/* RODAPÉ */}
      <Text style={styles.rodape}>
        Autonomia+ • Painel Administrativo
      </Text>
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
    marginBottom: 24,
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
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D315B',
    marginBottom: 10,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  opcao: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  opcaoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },

  icone: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textos: {
    flex: 1,
  },

  opcaoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#453B50',
  },

  opcaoDescricao: {
    fontSize: 10,
    color: '#888',
    lineHeight: 15,
    marginTop: 3,
  },

  divisor: {
    height: 1,
    backgroundColor: '#EEEAF2',
  },

  alerta: {
    backgroundColor: '#FFF5DC',
    borderRadius: 12,
    padding: 11,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  alertaIcone: {
    fontSize: 16,
    marginRight: 8,
  },

  alertaTexto: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    color: '#806A25',
  },

  menuItem: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcone: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuTextos: {
    flex: 1,
  },

  menuTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#453B50',
  },

  menuDescricao: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
  },

  seta: {
    fontSize: 28,
    color: '#9A8BAF',
    marginLeft: 8,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    paddingHorizontal: 17,
    marginBottom: 24,
  },

  infoLinha: {
    minHeight: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLabel: {
    fontSize: 12,
    color: '#777',
  },

  infoValor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B4058',
  },

  ambiente: {
    backgroundColor: '#FFF4D9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  ambienteTexto: {
    fontSize: 10,
    color: '#977000',
    fontWeight: '600',
  },

  botaoSalvar: {
    backgroundColor: '#7255B8',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 18,
  },

  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  rodape: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    marginBottom: 10,
  },
});