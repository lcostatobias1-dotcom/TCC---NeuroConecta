import { AccessibleText as Text } from '../components/Accessibility';
import React, { useState } from 'react';
import {
  View,
  NativeText,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Alert, ActivityIndicator } from 'react-native';
import { solicitarRecuperacaoSenha } from '../services/auth';

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail.');
      return;
    }
    try {
      setCarregando(true);
      await solicitarRecuperacaoSenha(email);
      Alert.alert('E-mail enviado', 'Confira sua caixa de entrada e abra o link para criar uma nova senha.');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível enviar o e-mail.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>‹</Text>
      </TouchableOpacity>

      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Recuperar senha</Text>

      <Text style={styles.subtitulo}>
        Digite seu e-mail para receber o código de recuperação.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={enviar}
      >
        <Text style={styles.textoBotao}>{carregando ? "Enviando..." : "Enviar"}</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F3FB',
  },

  voltar: {
    fontSize: 32,
    color: '#111',
  },

  logo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginTop: 20,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 25,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  botao: {
    height: 45,
    backgroundColor: '#8E62B7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});