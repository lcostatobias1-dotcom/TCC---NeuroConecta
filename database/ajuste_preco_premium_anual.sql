-- Ajuste seguro e pontual do preço anual do plano Premium.
-- Não remove contas, conteúdos, assinaturas ou registros.
update public.subscription_plans
set preco_mensal = 19.99,
    preco_anual = 299.00
where codigo = 'premium';
