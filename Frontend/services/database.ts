
import { supabase } from "./supabase";

async function resultado<T>(promise: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}

async function usuarioAtualId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Faça login para continuar.");
  return data.user.id;
}

export async function listarTarefas() {
  return resultado(supabase.from("tasks").select("*").order("data_vencimento", { ascending: true }).order("ordem"));
}

export async function criarTarefa(dados: {
  titulo: string; descricao?: string; data_vencimento?: string | null;
  horario?: string | null; repetir?: boolean; regra_repeticao?: string | null;
  lembrete?: boolean; lembrete_em?: string | null;
}) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("tasks").insert({ ...dados, user_id }).select().single());
}

export async function atualizarTarefa(id: string, dados: Record<string, any>) {
  return resultado(supabase.from("tasks").update(dados).eq("id", id).select().single());
}

export async function excluirTarefa(id: string) {
  return resultado(supabase.from("tasks").delete().eq("id", id));
}

export async function listarMetas() {
  return resultado(supabase.from("goals").select("*").order("criado_em", { ascending: false }));
}

export async function criarMeta(nome: string) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("goals").insert({ user_id, nome: nome.trim() }).select().single());
}

export async function atualizarMeta(id: string, dados: Record<string, any>) {
  return resultado(supabase.from("goals").update(dados).eq("id", id).select().single());
}

export async function excluirMeta(id: string) {
  return resultado(supabase.from("goals").delete().eq("id", id));
}

export async function listarAgenda() {
  return resultado(supabase.from("agenda_events").select("*").order("data_evento").order("horario"));
}

export async function criarEvento(dados: { titulo: string; horario?: string | null; data_evento?: string; descricao?: string }) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("agenda_events").insert({ ...dados, user_id }).select().single());
}

export async function atualizarEvento(id: string, dados: { titulo?: string; horario?: string | null; data_evento?: string; descricao?: string }) {
  return resultado(supabase.from("agenda_events").update(dados).eq("id", id).select().single());
}

export async function excluirEvento(id: string) {
  return resultado(supabase.from("agenda_events").delete().eq("id", id));
}

export async function obterConfiguracaoFinanceira() {
  const user_id = await usuarioAtualId();
  const data = await resultado(supabase.from("finance_settings").select("*").eq("user_id", user_id).maybeSingle());
  return data || { user_id, salario_mensal: 0, moeda: "BRL" };
}

export async function salvarSalario(salario_mensal: number) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("finance_settings").upsert({ user_id, salario_mensal, moeda: "BRL" }).select().single());
}

export async function listarMovimentacoesFinanceiras() {
  return resultado(supabase.from("finance_transactions").select("*").order("data_movimento", { ascending: false }));
}

export async function criarMovimentacao(dados: {
  descricao: string; tipo: "receita" | "despesa"; valor: number;
  data_movimento?: string; pago?: boolean; observacoes?: string;
}) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("finance_transactions").insert({ ...dados, user_id }).select().single());
}

export async function atualizarMovimentacao(id: string, dados: { descricao?: string; valor?: number }) {
  return resultado(supabase.from("finance_transactions").update(dados).eq("id", id).select().single());
}

export async function excluirMovimentacao(id: string) {
  return resultado(supabase.from("finance_transactions").delete().eq("id", id));
}

export async function enviarFaleConosco(dados: { nome: string; email: string; assunto: string; mensagem: string }) {
  const { data: auth } = await supabase.auth.getUser();
  return resultado(supabase.from("support_tickets").insert({
    ...dados, user_id: auth.user?.id ?? null,
  }).select().single());
}

export async function reportarProblema(dados: { assunto: string; descricao: string; tela?: string; dispositivo?: string }) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("problem_reports").insert({ ...dados, user_id }).select().single());
}

export async function enviarSugestao(dados: { assunto: string; sugestao: string }) {
  const user_id = await usuarioAtualId();
  return resultado(supabase.from("user_suggestions").insert({ ...dados, user_id }).select().single());
}

export async function listarCategoriasBiblioteca() {
  return resultado(supabase.from("content_categories").select("*").eq("ativo", true).order("ordem"));
}

export async function listarConteudosBiblioteca(categoryId?: string) {
  let query = supabase.from("library_contents").select("*,content_categories(nome,slug)").eq("status", "publicado").order("ordem");
  if (categoryId) query = query.eq("category_id", categoryId);
  return resultado(query);
}

export async function listarFavoritos() {
  return resultado(supabase.from("content_favorites").select("content_id,criado_em,library_contents(*)"));
}

export async function alternarFavorito(contentId: string, favoritado: boolean) {
  const user_id = await usuarioAtualId();
  if (favoritado) return resultado(supabase.from("content_favorites").delete().eq("user_id", user_id).eq("content_id", contentId));
  return resultado(supabase.from("content_favorites").insert({ user_id, content_id: contentId }).select().single());
}

export async function listarPerfisAdmin() {
  return resultado(supabase.from("profiles").select("id,nome_completo,email,role,ativo,criado_em").order("criado_em", { ascending: false }));
}

export async function atualizarPerfilAdmin(id: string, dados: { role?: string; ativo?: boolean }) {
  return resultado(supabase.from("profiles").update(dados).eq("id", id).select().single());
}

export async function listarLogsAdmin() {
  return resultado(supabase.from("admin_audit_logs").select("*").order("criado_em", { ascending: false }).limit(200));
}

export async function registrarLogAdmin(acao: string, descricao: string, tabela_afetada?: string, registro_id?: string) {
  const admin_id = await usuarioAtualId();
  return resultado(supabase.from("admin_audit_logs").insert({ admin_id, acao, descricao, tabela_afetada, registro_id }).select().single());
}

export async function listarPlanos() {
  return resultado(supabase.from("subscription_plans").select("*").eq("status", "ativo").order("ordem"));
}

// Busca somente a assinatura do usuário conectado.
export async function listarAssinaturaAtual() {
  const user_id = await usuarioAtualId();

  const assinatura = await resultado(
    supabase
      .from("user_subscriptions")
      .select("*,subscription_plans(*)")
      .eq("user_id", user_id)
      .eq("status", "ativa")
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle()
  );

  if (!assinatura) return null;

  const agora = new Date();
  const inicio = assinatura.inicio_em ? new Date(assinatura.inicio_em) : null;
  const fim = assinatura.fim_em ? new Date(assinatura.fim_em) : null;

  if (inicio && inicio.getTime() > agora.getTime()) return null;
  if (fim && fim.getTime() <= agora.getTime()) return null;

  return assinatura;
}

export async function listarNotificacoes() {
  return resultado(supabase.from("user_notifications").select("*").order("criada_em", { ascending: false }));
}

export async function marcarNotificacaoLida(id: string) {
  return resultado(supabase.from("user_notifications").update({ lida: true, lida_em: new Date().toISOString() }).eq("id", id));
}

export async function obterResumoProgresso() {
  const [tarefas, metas, gastos, favoritos] = await Promise.all([
    resultado(supabase.from("tasks").select("id,status,concluida_em,criado_em")),
    resultado(supabase.from("goals").select("id,status,progresso")),
    resultado(supabase.from("finance_transactions").select("id,tipo")),
    resultado(supabase.from("content_favorites").select("content_id")),
  ]);

  const tarefasConcluidas = (tarefas || []).filter((t: any) => t.status === "concluida" || !!t.concluida_em).length;

  return {
    totalTarefas: (tarefas || []).length,
    tarefasConcluidas,
    tarefasPendentes: (tarefas || []).filter((t: any) => t.status !== "concluida" && !t.concluida_em).length,
    totalMetas: (metas || []).length,
    metasConcluidas: (metas || []).filter((m: any) => m.status === "concluida" || Number(m.progresso) >= 100).length,
    totalGastos: (gastos || []).filter((g: any) => g.tipo === "despesa").length,
    totalFavoritos: (favoritos || []).length,
  };
}
