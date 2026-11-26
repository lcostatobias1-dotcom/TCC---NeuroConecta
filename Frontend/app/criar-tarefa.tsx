import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { criarTarefa as criarTarefaNoBanco } from '../services/database';

export default function CriarTarefa() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [repetir, setRepetir] = useState(false);
  const [lembrete, setLembrete] = useState(false);

  const criarTarefa = async () => {
    if (!titulo.trim()) {
      Alert.alert(
        'Atenção',
        'Digite o nome da tarefa.'
      );
      return;
    }

    try {
      const dataBanco = data.trim()
        ? (data.includes('/') ? data.split('/').reverse().join('-') : data)
        : null;
      const horarioBanco = horario.trim() || null;
      await criarTarefaNoBanco({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data_vencimento: dataBanco,
        horario: horarioBanco,
        repetir,
        lembrete,
      });

      Alert.alert(
        'Tarefa criada! 🎉',
        'Sua tarefa foi adicionada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/tarefas'),
          },
        ]
      );
    } catch (error) {
      console.log('Erro ao salvar tarefa:', error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar a tarefa.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => router.back()}
        >
          <Text style={styles.voltarTexto}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.tituloHeader}>
          Criar nova tarefa
        </Text>

        <View style={styles.espaco} />
      </View>

      {/* ÍCONE */}
      <View style={styles.iconeContainer}>
        <Text style={styles.icone}>
          📋
        </Text>
      </View>

      <Text style={styles.titulo}>
        Nova tarefa
      </Text>

      <Text style={styles.subtitulo}>
        Organize sua rotina criando uma nova tarefa.
      </Text>

      {/* NOME */}
      <Text style={styles.label}>
        Nome da tarefa
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Organizar o quarto"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* DESCRIÇÃO */}
      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        style={[styles.input, styles.inputDescricao]}
        placeholder="Digite uma descrição para a tarefa"
        placeholderTextColor="#999"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      {/* DATA */}
      <Text style={styles.label}>
        Data
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 29/09/2026"
        placeholderTextColor="#999"
        value={data}
        onChangeText={setData}
        keyboardType="numeric"
      />

      {/* HORÁRIO */}
      <Text style={styles.label}>
        Horário
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 14:00"
        placeholderTextColor="#999"
        value={horario}
        onChangeText={setHorario}
        keyboardType="numeric"
      />

      {/* REPETIÇÃO */}
      <View style={styles.opcao}>
        <View style={styles.opcaoTexto}>
          <Text style={styles.opcaoTitulo}>
            Repetir tarefa
          </Text>

          <Text style={styles.opcaoSubtitulo}>
            Repetir essa tarefa na rotina
          </Text>
        </View>

        <Switch
          value={repetir}
          onValueChange={setRepetir}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            repetir ? '#8E62B7' : '#F4F4F4'
          }
        />
      </View>

      {/* LEMBRETE */}
      <View style={styles.opcao}>
        <View style={styles.opcaoTexto}>
          <Text style={styles.opcaoTitulo}>
            Ativar lembrete
          </Text>

          <Text style={styles.opcaoSubtitulo}>
            Receber um aviso sobre essa tarefa
          </Text>
        </View>

        <Switch
          value={lembrete}
          onValueChange={setLembrete}
          trackColor={{
            false: '#D9D9D9',
            true: '#B88CFF',
          }}
          thumbColor={
            lembrete ? '#8E62B7' : '#F4F4F4'
          }
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.botao}
        onPress={criarTarefa}
      >
        <Text style={styles.botaoTexto}>
          Criar tarefa
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
    marginTop: 5,
    marginBottom: 15,
  },

  icone: {
    fontSize: 38,
  },

  titulo: {
    fontSize: 25,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E3D8F5',
  },

  inputDescricao: {
    height: 95,
    paddingTop: 14,
    textAlignVertical: 'top',
  },

  opcao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E3D8F5',
  },

  opcaoTexto: {
    flex: 1,
    paddingRight: 10,
  },

  opcaoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },

  opcaoSubtitulo: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  botao: {
    height: 52,
    backgroundColor: '#8E62B7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 20,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});