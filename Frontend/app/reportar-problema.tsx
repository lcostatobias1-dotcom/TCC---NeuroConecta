import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { reportarProblema } from '../services/database';

export default function ReportarProblema() {
  const router = useRouter();

  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarRelato() {
    if (!assunto.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha o assunto e a descrição.');
      return;
    }
    try {
      setEnviando(true);
      await reportarProblema({ assunto: assunto.trim(), descricao: descricao.trim() });
      Alert.alert('Relato enviado', 'Obrigado por ajudar a melhorar o NeuroConecta.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível enviar o relato.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.voltar}
        onPress={() => router.back()}
      >
        <Text style={styles.voltarTexto}>‹ Voltar</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.titulo}>🐞 Reportar Problema</Text>

        <Text style={styles.subtitulo}>
          Encontrou algum problema no aplicativo? Conte para nós o que
          aconteceu para que possamos melhorar.
        </Text>

        <Text style={styles.label}>Assunto</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Problema ao abrir uma tarefa"
          value={assunto}
          onChangeText={setAssunto}
        />

        <Text style={styles.label}>O que aconteceu?</Text>

        <TextInput
          style={styles.mensagem}
          placeholder="Descreva o problema..."
          multiline
          textAlignVertical="top"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={enviarRelato}
        >
          <Text style={styles.botaoTexto}>{enviando ? "Enviando..." : "Enviar relato"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FB',
  },

  voltar: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  voltarTexto: {
    fontSize: 16,
    color: '#8E62B7',
  },

  conteudo: {
    padding: 25,
    paddingTop: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5F407C',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  mensagem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    height: 160,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0D2EF',
  },

  botao: {
    backgroundColor: '#8E62B7',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});