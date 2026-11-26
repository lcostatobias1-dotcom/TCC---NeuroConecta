import { supabase, exigirResultado } from "./supabase";

export type PerfilUsuario = {
  id: string;
  nome_completo: string;
  email: string | null;
  data_nascimento: string | null;
  foto_url: string | null;
  nome_usuario?: string | null;
  telefone?: string | null;
  role: "usuario" | "administrador" | "editor" | "suporte";
  ativo: boolean;
  onboarding_concluido: boolean;
};

export async function cadastrarUsuario(
  nome: string,
  nascimento: string,
  email: string,
  senha: string
) {
  if (senha.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");
  const nascimentoLimpo = nascimento.trim();
 const nascimentoBanco = /^\d{2}\/\d{2}\/\d{4}$/.test(nascimentoLimpo)
    ? nascimentoLimpo.split('/').reverse().join('-')
    : nascimentoLimpo || null;

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: senha,
    options: {
      data: {
        nome_completo: nome.trim(),
        data_nascimento: nascimentoBanco,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("O Supabase não retornou o usuário criado.");
  return { usuario: data.user, sessao: data.session };
}

export async function fazerLogin(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });
  if (error) throw error;
  if (!data.session) {
    throw new Error("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
  }
  const usuario = await buscarPerfil();
  if (!usuario.ativo) {
    await supabase.auth.signOut();
    throw new Error("Esta conta está desativada. Entre em contato com o suporte.");
  }
  return { usuario, sessao: data.session };
}

export async function buscarPerfil(): Promise<PerfilUsuario> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,nome_completo,email,data_nascimento,foto_url,nome_usuario,telefone,role,ativo,onboarding_concluido")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;
  return data as PerfilUsuario;
}

export async function sairDaConta() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function atualizarPerfil(dados: {
  nome: string;
  nome_usuario: string;
  telefone: string;
  data_nascimento: string;
}) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Faça login novamente.");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      nome_completo: dados.nome.trim(),
      nome_usuario: dados.nome_usuario.trim() || null,
      telefone: dados.telefone.trim() || null,
      data_nascimento: dados.data_nascimento || null,
    })
    .eq("id", authData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function solicitarAlteracaoEmail(novoEmail: string) {
  const { data, error } = await supabase.auth.updateUser({
    email: novoEmail.trim().toLowerCase(),
  });
  if (error) throw error;
  return data;
}

export async function alterarSenha(senhaAtual: string, novaSenha: string) {
  if (novaSenha.length < 8) throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;
  if (userError || !user?.email) throw new Error("Faça login novamente.");

  const { error: confirmError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: senhaAtual,
  });
  if (confirmError) throw new Error("A senha atual está incorreta.");

  const { data, error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
  return data;
}

export async function solicitarRecuperacaoSenha(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: "neuroconecta://nova-senha" }
  );
  if (error) throw error;
}

export async function salvarNovaSenha(novaSenha: string) {
  if (novaSenha.length < 8) throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
  const { data, error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
  return data;
}
