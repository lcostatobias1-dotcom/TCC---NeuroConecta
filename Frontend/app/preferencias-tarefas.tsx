import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function PreferenciasTarefas() {
  const router = useRouter();

  const [lembretes, setLembretes] = useState(true);
  const [som, setSom] = useState(true);
  const [vibracao, setVibracao] = useState(true);
  const [lembreteAutomatico, setLembreteAutomatico] = useState(false);

  const salvar = () => {
    Alert.alert(
      'Preferências salvas! 💜',
      'Suas preferências de tarefas foram atualizadas.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarTexto}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.tituloHeader}>
          Preferências
        </Text>

        <View style={styles.espaco} />
      </View>

      {/* Ícone */}
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>⚙️</Text>
      </View>

      <Text style={styles.titulo}>
        Preferências de tarefas
      </Text>

      <Text style={styles.subtitulo}>
        Personalize como você quer receber os lembretes.
      </Text>

      {/* Seção */}
      <Text style={styles.secao}>
        Notificações
      </Text>

      <View style={styles.card}>
        <View style={styles.textos}>
          <Text style={styles.nome}>
            Lembretes
          </Text>

          <Text style={styles.descricao}>
            Receber notificações das tarefas
          </Text>
        </View>

        <Switch
          value={lembretes}
          onValueChange={setLembretes}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            lembretes ? '#8E62B7' : '#F4F4F4'
          }
        />
      </View>

      <View style={styles.card}>
        <View style={styles.textos}>
          <Text style={styles.nome}>
            Som
          </Text>

          <Text style={styles.descricao}>
            Reproduzir som nos lembretes
          </Text>
        </View>

        <Switch
          value={som}
          onValueChange={setSom}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            som ? '#8E62B7' : '#F4F4F4'
          }
        />
      </View>

      <View style={styles.card}>
        <View style={styles.textos}>
          <Text style={styles.nome}>
            Vibração
          </Text>

          <Text style={styles.descricao}>
            Vibrar ao receber um lembrete
          </Text>
        </View>

        <Switch
          value={vibracao}
          onValueChange={setVibracao}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            vibracao ? '#8E62B7' : '#F4F4F4'
          }
        />
      </View>

      {/* Lembrete automático */}
      <Text style={styles.secao}>
        Lembrete padrão
      </Text>

      <View style={styles.card}>
        <View style={styles.textos}>
          <Text style={styles.nome}>
            Lembrete automático
          </Text>

          <Text style={styles.descricao}>
            Ativar lembrete automaticamente ao criar uma tarefa
          </Text>
        </View>

        <Switch
          value={lembreteAutomatico}
          onValueChange={setLembreteAutomatico}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            lembreteAutomatico
              ? '#8E62B7'
              : '#F4F4F4'
          }
        />
      </View>

      {/* Botão */}
      <TouchableOpacity
        style={styles.botao}
        onPress={salvar}
      >
        <Text style={styles.botaoTexto}>
          Salvar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    marginBottom: 20,
  },

  voltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  voltarTexto: {
    fontSize: 32,
    color: '#5B2AA8',
    marginTop: -4,
  },

  tituloHeader: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333333',
  },

  espaco: {
    width: 40,
  },

  iconeContainer: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: '#E9D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  icone: {
    fontSize: 36,
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 25,
  },

  secao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B2A75',
    marginTop: 8,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3D8F5',
  },

  textos: {
    flex: 1,
    paddingRight: 12,
  },

  nome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },

  descricao: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },

  botao: {
    height: 52,
    backgroundColor: '#8E62B7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});