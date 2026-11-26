import { AccessibleText as Text } from '../../components/Accessibility';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  NativeText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { listarPerfisAdmin, atualizarPerfilAdmin } from '../../services/database';

type Administrador = {
  id: string;
  nome: string;
  email: string;
  nivel: 'Administrador' | 'Editor' | 'Suporte';
  status: 'Ativo' | 'Inativo';
};

export default function AdministradoresAdmin() {
  const router = useRouter();

  const [busca, setBusca] = useState('');

  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarAdministradores() {
    try {
      setCarregando(true);
      const perfis = await listarPerfisAdmin();
      setAdministradores(
        perfis
          .filter((perfil: any) => ['administrador', 'editor', 'suporte'].includes(perfil.role))
          .map((perfil: any) => ({
            id: perfil.id,
            nome: perfil.nome_completo || 'Sem nome',
            email: perfil.email || 'Sem e-mail',
            nivel: (perfil.role === 'administrador' ? 'Administrador' : perfil.role === 'editor' ? 'Editor' : 'Suporte') as Administrador['nivel'],
            status: (perfil.ativo ? 'Ativo' : 'Inativo') as Administrador['status'],
          }))
      );
    } catch (erro) {
      Alert.alert('Erro', erro instanceof Error ? erro.message : 'Não foi possível carregar os administradores.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarAdministradores(); }, []);

  const administradoresFiltrados = administradores.filter(
    (admin) =>
      admin.nome.toLowerCase().includes(busca.toLowerCase()) ||
      admin.email.toLowerCase().includes(busca.toLowerCase())
  );

  function adicionarAdministrador() {
    Alert.alert(
      'Adicionar administrador',
      'Por segurança, primeiro crie a conta em Supabase → Authentication → Users. Depois execute/repita o bloco de administradores do SQL consolidado para conceder o papel. Não crie usuários diretamente nesta tela.'
    );
  }

  function alterarStatus(admin: Administrador) {
    const novoStatus =
      admin.status === 'Ativo' ? 'Inativo' : 'Ativo';

    Alert.alert(
      'Alterar status',
      `Deseja ${
        novoStatus === 'Ativo' ? 'ativar' : 'desativar'
      } ${admin.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await atualizarPerfilAdmin(admin.id, { ativo: novoStatus === 'Ativo' });
              await carregarAdministradores();
            } catch (erro) {
              Alert.alert('Erro', erro instanceof Error ? erro.message : 'Não foi possível atualizar o status.');
            }
          },
        },
      ]
    );
  }

  function alterarNivel(admin: Administrador) {
    const niveis: Administrador['nivel'][] = [
      'Administrador',
      'Editor',
      'Suporte',
    ];

    const opcoes = niveis
      .filter((nivel) => nivel !== admin.nivel)
      .map((nivel) => ({
        text: nivel,
        onPress: async () => {
          try {
            const role = nivel === 'Administrador' ? 'administrador' : nivel === 'Editor' ? 'editor' : 'suporte';
            await atualizarPerfilAdmin(admin.id, { role });
            await carregarAdministradores();
          } catch (erro) {
            Alert.alert('Erro', erro instanceof Error ? erro.message : 'Não foi possível alterar o nível.');
          }
        },
      }));

    Alert.alert(
      'Nível de acesso',
      `Nível atual: ${admin.nivel}`,
      [
        ...opcoes,
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
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
          <Text style={styles.voltarTexto}>‹</Text>
        </TouchableOpacity>

        <View style={styles.tituloArea}>
          <Text style={styles.titulo}>
            Administradores
          </Text>

          <Text style={styles.subtitulo}>
            Gerencie os acessos ao painel
          </Text>
        </View>
      </View>

      {/* RESUMO */}
      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {administradores.length}
          </Text>

          <Text style={styles.resumoTexto}>
            Total
          </Text>
        </View>

        <View style={styles.linha} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {
              administradores.filter(
                (item) => item.status === 'Ativo'
              ).length
            }
          </Text>

          <Text style={styles.resumoTexto}>
            Ativos
          </Text>
        </View>

        <View style={styles.linha} />

        <View style={styles.resumoItem}>
          <Text style={styles.resumoNumero}>
            {
              administradores.filter(
                (item) => item.nivel === 'Administrador'
              ).length
            }
          </Text>

          <Text style={styles.resumoTexto}>
            Admins
          </Text>
        </View>
      </View>

      {/* NOVO ADMIN */}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={adicionarAdministrador}
      >
        <Text style={styles.botaoAdicionarTexto}>
          + Adicionar administrador
        </Text>
      </TouchableOpacity>

      {/* BUSCA */}
      <View style={styles.buscaArea}>
        <Text style={styles.iconeBusca}>
          🔎
        </Text>

        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por nome ou email..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* LISTA */}
      <View style={styles.listaCabecalho}>
        <Text style={styles.listaTitulo}>
          Equipe administrativa
        </Text>

        <Text style={styles.contador}>
          {administradoresFiltrados.length} encontrados
        </Text>
      </View>

      {administradoresFiltrados.map((admin) => (
        <View
          key={admin.id}
          style={styles.adminCard}
        >
          {/* TOPO */}
          <View style={styles.adminTopo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>
                {admin.nome.charAt(0)}
              </Text>
            </View>

            <View style={styles.adminInfo}>
              <Text style={styles.adminNome}>
                {admin.nome}
              </Text>

              <Text style={styles.adminEmail}>
                {admin.email}
              </Text>
            </View>

            <View
              style={[
                styles.status,
                admin.status === 'Ativo'
                  ? styles.statusAtivo
                  : styles.statusInativo,
              ]}
            >
              <Text
                style={[
                  styles.statusTexto,
                  admin.status === 'Ativo'
                    ? styles.statusTextoAtivo
                    : styles.statusTextoInativo,
                ]}
              >
                {admin.status}
              </Text>
            </View>
          </View>

          {/* DETALHES */}
          <View style={styles.detalhes}>
            <View style={styles.nivelArea}>
              <Text style={styles.nivelLabel}>
                Nível de acesso
              </Text>

              <TouchableOpacity
                style={styles.nivel}
                onPress={() => alterarNivel(admin)}
              >
                <Text style={styles.nivelTexto}>
                  {admin.nivel}
                </Text>

                <Text style={styles.nivelSeta}>
                  ⌄
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AÇÕES */}
          <View style={styles.acoes}>
            <TouchableOpacity
              style={styles.botaoAcao}
              onPress={() => alterarNivel(admin)}
            >
              <Text style={styles.botaoAcaoTexto}>
                ✏️ Alterar acesso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botaoAcao,
                admin.status === 'Ativo'
                  ? styles.botaoDesativar
                  : styles.botaoAtivar,
              ]}
              onPress={() => alterarStatus(admin)}
            >
              <Text
                style={[
                  styles.botaoAcaoTexto,
                  admin.status === 'Ativo'
                    ? styles.textoDesativar
                    : styles.textoAtivar,
                ]}
              >
                {admin.status === 'Ativo'
                  ? 'Desativar'
                  : 'Ativar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* NENHUM RESULTADO */}
      {carregando && <Text style={styles.vazioTexto}>Carregando equipe administrativa...</Text>}

      {!carregando && administradoresFiltrados.length === 0 && (
        <View style={styles.vazio}>
          <Text style={styles.vazioEmoji}>
            🔎
          </Text>

          <Text style={styles.vazioTitulo}>
            Nenhum administrador encontrado
          </Text>

          <Text style={styles.vazioTexto}>
            Tente pesquisar por outro nome ou email.
          </Text>
        </View>
      )}

      {/* PERMISSÕES */}
      <View style={styles.permissoesCard}>
        <Text style={styles.permissoesTitulo}>
          🛡️ Níveis de acesso
        </Text>

        <View style={styles.permissao}>
          <View style={styles.permissaoBolinha}>
            <Text>👑</Text>
          </View>

          <View style={styles.permissaoInfo}>
            <Text style={styles.permissaoNome}>
              Administrador
            </Text>

            <Text style={styles.permissaoDescricao}>
              Acesso completo ao painel e configurações.
            </Text>
          </View>
        </View>

        <View style={styles.permissao}>
          <View style={styles.permissaoBolinha}>
            <Text>✏️</Text>
          </View>

          <View style={styles.permissaoInfo}>
            <Text style={styles.permissaoNome}>
              Editor
            </Text>

            <Text style={styles.permissaoDescricao}>
              Gerencia conteúdos e informações do aplicativo.
            </Text>
          </View>
        </View>

        <View style={styles.permissao}>
          <View style={styles.permissaoBolinha}>
            <Text>💬</Text>
          </View>

          <View style={styles.permissaoInfo}>
            <Text style={styles.permissaoNome}>
              Suporte
            </Text>

            <Text style={styles.permissaoDescricao}>
              Acompanha usuários e solicitações de suporte.
            </Text>
          </View>
        </View>
      </View>

      {/* AVISO */}
      <View style={styles.aviso}>
        <Text style={styles.avisoIcone}>
          💡
        </Text>

        <Text style={styles.avisoTexto}>
          Esta lista consulta os perfis reais do Supabase. A criação de novas contas deve ser feita pelo Supabase Auth; esta tela altera somente o papel e o status do perfil.
        </Text>
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
    fontSize: 21,
    fontWeight: '700',
    color: '#7255B8',
  },

  resumoTexto: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
  },

  linha: {
    width: 1,
    height: 34,
    backgroundColor: '#E8E3ED',
  },

  botaoAdicionar: {
    backgroundColor: '#7255B8',
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 15,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  buscaArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 20,
  },

  iconeBusca: {
    fontSize: 17,
    marginRight: 9,
  },

  inputBusca: {
    flex: 1,
    fontSize: 13,
    color: '#333',
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

  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  adminTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#EDE7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  avatarTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7255B8',
  },

  adminInfo: {
    flex: 1,
  },

  adminNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#44394F',
  },

  adminEmail: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
  },

  status: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  statusAtivo: {
    backgroundColor: '#E8F7EE',
  },

  statusInativo: {
    backgroundColor: '#FBEAEC',
  },

  statusTexto: {
    fontSize: 9,
    fontWeight: '700',
  },

  statusTextoAtivo: {
    color: '#31834B',
  },

  statusTextoInativo: {
    color: '#C14F5A',
  },

  detalhes: {
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#EEEAF2',
  },

  nivelArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  nivelLabel: {
    fontSize: 11,
    color: '#888',
  },

  nivel: {
    backgroundColor: '#F1ECF8',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  nivelTexto: {
    fontSize: 10,
    color: '#7255B8',
    fontWeight: '700',
  },

  nivelSeta: {
    fontSize: 13,
    color: '#7255B8',
    marginLeft: 5,
  },

  acoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },

  botaoAcao: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#F2EEF8',
    paddingVertical: 10,
    alignItems: 'center',
  },

  botaoAcaoTexto: {
    fontSize: 10,
    color: '#7255B8',
    fontWeight: '700',
  },

  botaoDesativar: {
    backgroundColor: '#FBEAEC',
  },

  botaoAtivar: {
    backgroundColor: '#E8F7EE',
  },

  textoDesativar: {
    color: '#C14F5A',
  },

  textoAtivar: {
    color: '#31834B',
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
    marginTop: 5,
    textAlign: 'center',
  },

  permissoesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginTop: 10,
    marginBottom: 15,
  },

  permissoesTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D315B',
    marginBottom: 13,
  },

  permissao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  permissaoBolinha: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0EBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  permissaoInfo: {
    flex: 1,
  },

  permissaoNome: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A4055',
  },

  permissaoDescricao: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    lineHeight: 14,
  },

  aviso: {
    backgroundColor: '#F0EBFA',
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  avisoIcone: {
    fontSize: 18,
    marginRight: 9,
  },

  avisoTexto: {
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
    color: '#6D6380',
  },
});