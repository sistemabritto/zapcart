---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments: ['_evo-output/brainstorming/brainstorming-session-2026-05-31-0809.md']
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: saas_b2b
  domain: e-commerce
  complexity: medium-high
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - ZapCart

**Author:** sistemabritto
**Date:** 2026-05-31

## Executive Summary

O ZapCart é uma plataforma SaaS White Label de catálogo virtual voltada para pequenos e médios lojistas. Seu objetivo central é eliminar a fricção do cadastro manual de produtos, transformando-o em um fluxo conversacional natural via WhatsApp. Através de um "Estagiário Virtual" (Agente de IA), o sistema permite que o lojista envie fotos e áudios que são processados e formatados automaticamente em anúncios estruturados e ricos em detalhes. Projetado inicialmente para o case 2M LAB, o ZapCart adota uma estratégia de fechamento assíncrono (handoff de carrinho para o WhatsApp), dispensando integrações complexas de frete ou gateways de pagamento no MVP.

### What Makes This Special

O diferencial do ZapCart reside no seu **Agente de IA Headless e no Fluxo de Rascunho (Ping-Pong)**:
- **Zero Alucinação:** A inteligência artificial (orquestrada via Groq e Whisper 3 Turbo) é proativa em solicitar dados faltantes, mas nunca deduz informações essenciais, garantindo Data Integrity para futuras exportações a marketplaces.
- **Gestão de Concorrência Resiliente:** Webhooks do evoCRM no WhatsApp agrupam inteligentemente imagens e áudios em tempo real utilizando controle de sessão transacional nativo no Supabase (`draft_sessions`), sem infraestruturas pesadas de fila.
- **Ecossistema Headless Híbrido:** O mesmo agente inteligente de cadastro no WhatsApp está disponível no painel de administração web (`/admin`), coexistindo harmoniosamente com fluxos CRUD tradicionais.
- **Handoff Eficiente:** A complexidade de pagamentos e envios é totalmente delegada ao aplicativo nativo da InfinitePay do próprio lojista.

## Project Classification

- **Project Type:** SaaS B2B / Web Application
- **Domain:** E-commerce / IA Automations
- **Complexity:** Medium-High (Integração assíncrona de Webhooks de IA com front-end reativo)
- **Project Context:** Greenfield

## Success Criteria

### User Success
- **Fricção Mínima:** Lojistas conseguem catalogar produtos completos com IA enviando apenas áudio e mídias no WhatsApp, reduzindo drasticamente o tempo de cadastro.
- **Viralidade Compartilhável:** O sistema gera automaticamente links personalizados, limpos e atrativos para cada produto, facilitando o envio para clientes e divulgação no Instagram.

### Business Success
- **Adoção Direta (Case 2M LAB):** Migração total, sem quebras, do catálogo da InfinitePay para a nova arquitetura do ZapCart.
- **Validação de Modelo:** Provar a operação do ZapCart como um modelo White Label "pronto para revenda".

### Technical Success
- **Resiliência:** Tratamento eficiente de concorrência de Webhooks via `draft_sessions` no Supabase (zero rascunhos duplicados).
- **Data Integrity:** A IA não sofre alucinação de atributos; formata um JSON perfeito para o banco.

### Measurable Outcomes
- 100% do catálogo inicial do cliente migrado com sucesso.
- Tempo de resposta imediato para os links compartilháveis.
- Estabilidade total nos testes com múltiplos uploads simultâneos via WhatsApp.

## Product Scope

### SLC - Simple, Lovable, Complete
*Adotando a filosofia de que a versão 1.0 deve ser simples, mas oferecer uma experiência completa e amada pelo usuário.*
- **Vitrine e Carrinho:** Frontend público responsivo com carrinho assíncrono e checkout com "handoff" pro WhatsApp.
- **O Agente (Ping-Pong):** Inteligência de criação de rascunhos de produtos rodando via Webhook (WhatsApp) e Web (`/admin`).
- **Painel de Gestão:** Área restrita para CRUD clássico (editar títulos, preços, excluir e ocultar produtos).
- **Desacoplamento Financeiro:** Ausência de regras de frete e gateways de pagamento (deixados a cargo da InfinitePay do lojista).

### Growth Features (Post-SLC)
- Tratamento nativo e inteligente de Variações de produtos (cores, tamanhos, modelos).
- Otimização automática das imagens salvas.

### Vision (Future)
- **SDR IA (Vendedor Virtual):** Lançamento de um agente de vendas treinado com o catálogo que atende o cliente final da vitrine, tira dúvidas, sugere produtos (upsell) e faz o fechamento automático da venda.

## User Journeys

### Jornada 1: O Lojista (Caminho Feliz - Cadastro Mágico)
**Abertura:** Heleno (dono da 2M LAB) acaba de imprimir uma nova coruja 3D. Ele está com pressa, pois precisa embalar outras encomendas.
**Ação:** Ele tira 4 fotos rápidas do produto na bancada e envia as imagens para o WhatsApp do "Estagiário Virtual" do ZapCart. Em seguida, grava um áudio: "Coruja de resina preta, 15cm, custa 45 reais".
**Clímax:** O webhook do evoCRM recebe tudo e agrupa. Em menos de 10 segundos, o agente devolve um card estruturado com um título persuasivo, descrição detalhada e o preço formatado, perguntando: "Tudo certo para ir pra vitrine?".
**Resolução:** Heleno responde "Sim". O sistema devolve o link da loja. Ele apenas encaminha o link para os clientes no Instagram, sentindo alívio por não ter aberto um notebook.

### Jornada 2: O Lojista (Edge Case - Recuperação de Dados Faltantes)
**Abertura:** Heleno envia apenas 1 foto de um chaveiro e diz em áudio: "Novo chaveiro da copa". Ele esquece de falar o preço.
**Ação:** A IA recebe o webhook. Detecta a ausência de um dado crítico (preço) e de imagens suficientes.
**Clímax:** A IA se recusa a alucinar o preço. Ela responde de forma humanizada: "📦 Que legal o novo chaveiro! Mas notei que faltam duas coisinhas pra podermos publicar: Qual é o preço dele? E se puder, mande mais umas 2 fotos para a vitrine ficar atrativa!".
**Resolução:** Heleno percebe o esquecimento, manda um novo áudio com o preço e a foto extra. A IA então gera o rascunho completo.

### Jornada 3: O Cliente Final (Handoff de Carrinho)
**Abertura:** João vê a coruja 3D no Instagram e clica no link da vitrine do ZapCart.
**Ação:** Ele acessa uma loja rápida pelo celular, escolhe a Coruja e um Chaveiro, colocando-os no carrinho. Ao clicar em "Finalizar Pedido", ele não encontra telas chatas de login ou cartão.
**Clímax:** O sistema direciona João direto para o WhatsApp da 2M LAB, com uma mensagem pré-escrita: *"Olá! Gostaria de fechar este pedido: 1x Coruja, 1x Chaveiro. Total: R$ 60,00."*
**Resolução:** A loja recebe a mensagem pronta, devolve o link de pagamento da InfinitePay, e a venda é fechada sem qualquer fricção técnica na plataforma.

### Jornada 4: O Super Admin (Setup de Franquia)
**Abertura:** Você fechou com um novo lojista e precisa colocar a loja dele no ar.
**Ação:** Você configura uma nova instância do Vercel ligada ao GitHub do ZapCart. 
**Clímax:** No banco (Supabase), você cria as tabelas padrão e configura o webhook do evoCRM com a API Key do Groq exclusiva para este cliente.
**Resolução:** A nova loja entra no ar 100% isolada e performática, validando que o modelo SaaS White Label é fácil de gerenciar e escalar.

### Jornada 5: O Lojista (Gestão e Edição Pós-Publicação)
**Abertura:** Heleno percebe que o material de impressão 3D encareceu e ele precisa ajustar o preço da coruja rapidamente.
**Ação:** Ele acessa o painel `/admin` do ZapCart pelo navegador do celular ou computador. Navega até a grade de produtos publicados.
**Clímax:** Ele localiza a "Coruja Preta" através da interface gráfica, edita o campo de preço (CRUD Clássico) e salva.
**Resolução:** A alteração reflete em tempo real na vitrine pública sem necessidade de envolver o Agente de IA. O link do produto compartilhado anteriormente permanece o mesmo e intacto.

### Journey Requirements Summary
- **Capacidades Técnicas Reveladas:** 
  - **Debouncing de Webhooks:** Lógica crítica para agrupar as fotos e áudios que chegam em milissegundos via WhatsApp (`draft_sessions`).
  - **Draft Engine (Motor de Rascunhos):** O banco precisa suportar status temporários (`draft`) antes de alterar o produto para `published`.
  - **Verificadores Restritivos de IA:** O *System Prompt* precisa de um "validator" interno para checar se campos obrigatórios (preço, título) estão presentes no áudio antes de tentar gerar a saída.
  - **Carrinho Stateless:** O carrinho não precisa salvar os pedidos permanentemente em banco num primeiro momento, ele apenas monta o state e gera a "wa.me URL" estruturada.

## Domain-Specific Requirements

### Compliance & Regulatory
- **LGPD Básica:** O carrinho captura o contexto e contato do cliente para fazer o *handoff* (direcionamento) ao WhatsApp. O sistema terá uma página dedicada e clara de "Privacidade e Termos" para os compradores da vitrine.
- **Isenção Financeira:** Ao delegar o pagamento para a InfinitePay, o sistema exime-se das rigorosas certificações de processamento de cartões (ex: PCI-DSS).

### Technical Constraints
- **Segurança de IA Contextualizada:** O risco de *Prompt Injection* é baixo e suave. O bot apenas escuta e confia no número de telefone do próprio lojista autorizado, não havendo incentivo para autossabotagem. A restrição foca em gerenciar o "Rate Limit" da chave free do Groq.
- **Isolamento e RLS:** Uso nativo do *Row Level Security* (RLS), que já é padrão no Supabase do projeto, garantindo isolamento sem complexidade extra de código.

### Integration & Architecture Roadmap
- **Evolução do evoCRM (Fase 2):** A integração mais complexa do evoCRM (como disparar webhooks massivos para gerar anúncios em redes sociais e integração com marketplaces) fica para a Fase 2 (Growth). O foco técnico do SLC é o "Caminho Feliz" do agente gerando catálogo internamente.

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Inversão do Fluxo de Cadastro (Workflow Automation)**
O mercado atual de catálogos (LojazapCart, Nuvemshop, Shopify) exige que o lojista *preencha formulários*. O ZapCart inverte esse paradigma: o lojista *fala com o sistema*, exatamente como faz com um funcionário de confiança. Resultado: a barreira de entrada de produtos cai de ~10 minutos para menos de 2 minutos por item.

**2. Agente de IA Headless Omnichannel (AI Agent Pattern)**
A mesma API de inteligência artificial (`/api/ai-draft`) é consumida tanto pelo canal WhatsApp (via evoCRM Webhook) quanto pelo painel web (`/admin`), sem duplicação de código ou lógica de negócio. Um único cérebro, múltiplas entradas.

### Market Context & Competitive Landscape
- O WhatsApp é o aplicativo mais utilizado no Brasil, com adopção universal entre lojistas de pequeno e médio porte.
- Concorrentes como LojazapCart e Nuvemshop capturam parte do mercado de catálogo digital, mas nenhum oferece o loop completo de **voz → IA → rascunho → aprovação → publicação** com o nível de simplicidade e baixo custo operacional do ZapCart.
- O modelo White Label permite que o próprio desenvolvedor replique o sistema para outros lojistas sem reescrever nada, um modelo de SaaS de altissimo ROI.

### Validation Approach
- **Prova de Conceito (Case 2M LAB):** Migrar o catálogo real da InfinitePay e validar o tempo de cadastro com o lojista.
- **Métrica de Sucesso:** O próprio Heleno (dono da 2M LAB) cadastrar um produto novo em menos de 2 minutos sem suporte.

### Risk Mitigation
- **Falha de Transcrição (Groq):** Se o áudio for muito ruidoso ou inaudível, o agente solicita uma nova gravação de forma amigável.
- **Limite Free do Groq:** Monitorar consumo de tokens. Para o SLC com um único cliente, o plano gratuito suporta com ampla folga.

## SaaS B2B Specific Requirements

### Project-Type Overview
O ZapCart é um SaaS B2B White Label. Cada lojista cliente recebe uma instância dedicada e isolada (deploy no Vercel + banco/storage no Supabase), configurada via variáveis de ambiente. Não é multitenant por design no SLC.

### Tenant Model
- **White Label (One Instance per Customer):** Cada lojista = 1 repositório + 1 deploy no Vercel + 1 projeto no Supabase.
- **Isolamento Total:** Não há compartilhamento de banco de dados entre lojistas. Cada instância é soberana.
- **RLS (Row Level Security):** Habilitado por padrão no Supabase para blindar o banco caso o modelo evolua para multitenant no futuro.

### Permission Matrix (RBAC)
| Papel | Acesso | Descrição |
|-------|--------|----------|
| `admin` | `/admin/*` + API interna | Lojista autenticado. Acessa CRUD, Agente IA Web e configurações. |
| `cliente` | `/` (vitrine pública) | Comprador final. Sem necessidade de login. |

### Integration List
| Serviço | Fase | Função | Variável de Ambiente |
|---------|------|---------|--------------------|
| **Groq (Whisper 3 Turbo)** | SLC | Transcrição de áudio em texto | `GROQ_API_KEY` |
| **Supabase** | SLC | Banco de dados (Postgres), Storage de imagens | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Vercel** | SLC | Deploy e hospedagem do frontend/backend Next.js | `VERCEL_TOKEN` |
| **InfinitePay** | SLC | Pagamento (handoff pelo próprio lojista, fora do código) | N/A |
| **evoCRM** | Fase 2 | Motor de WhatsApp (webhooks de áudio/foto) | `EVO_API_URL`, `EVO_API_KEY` |

### Technical Architecture Considerations
- **Next.js 14+ (App Router):** Frontend da vitrine (SSR/SSG para SEO) e backend das rotas de API (`/api/ai-draft`, `/api/webhook`).
- **Supabase Storage:** Armazenamento das fotos de produto (3 a 5 por item). Plano free (1GB) suficiente para o SLC.
- **Processamento Assíncrono:** O endpoint de webhook retorna imediatamente ao evoCRM (evitando timeout) e processa o Groq em background.

### Implementation Considerations
- **Variáveis de Ambiente Centralizadas:** Todo comportamento do sistema White Label (número do WhatsApp de vendas, chaves de API) controlado pelo `.env` do Vercel.
- **`WHATSAPP_SALES_NUMBER`:** Variável crítica que define para qual WhatsApp o carrinho do cliente será direcionado.
- **`ADMIN_PASSWORD`:** Fallback de senha do painel admin (default de desenvolvimento: `2mlab@1234`). Em produção, substituído por variável no Vercel.
- **`GROQ_API_KEY`:** Chave da API Groq para transcrição de áudio. Definida no Vercel em produção.

### Authentication & Security
- **Admin Auth:** Supabase Auth (email + senha) para acesso ao `/admin`. Interface leve, sem OAuth externo.
- **Segurança de Chaves Supabase:**
  - `SUPABASE_ANON_KEY` → segura para uso no **frontend público** (vitrine). Nunca expõe dados privados pois o RLS bloqueia.
  - `SUPABASE_SERVICE_ROLE_KEY` → **APENAS no backend** (Server Components / API Routes). Jamais deve aparecer no bundle do browser.
- **Página `/privacidade`:** Rota estática obrigatória desde o dia 1 no Next.js. Cobre o básico da LGPD (dados coletados no handoff do carrinho e uso do WhatsApp).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
**MVP Approach:** SLC — Simple, Lovable, Complete. A versão 1.0 não é um protótipo; é um produto funcional, polido e completo o suficiente para gerar valor real desde o primeiro dia para a 2M LAB.
**Recurso Principal:** 1 desenvolvedor full-stack (sistemabritto) com apoio do Agente de IA.
**Stack:** Next.js 14+ (App Router), Supabase, Vercel, Groq.

### SLC Feature Set (Fase 1 - Lançamento)

**Jornadas Suportadas:** Jornadas 1, 2, 3, 4 e 5 (todas as jornadas do usuário mapeadas).

**Must-Have Capabilities:**
- Vitrine pública responsiva com listagem de produtos e galeria de fotos (3-5 imagens)
- Links de produto individuais, compartilháveis e limpos (ex: `/produto/coruja-preta-15cm`)
- Carrinho stateless com geração de `wa.me URL` estruturada (handoff WhatsApp)
- Painel `/admin` com autenticação (Supabase Auth)
- CRUD clássico de produtos no Admin (criar, editar, inativar, excluir)
- Agente IA Web no Admin: upload de fotos + gravação de áudio → rascunho gerado pelo Groq
- Motor de Rascunhos (`draft_sessions` no Supabase) para controle de estado
- System Prompt com validador anti-alucinação (verifica preço e título antes de gerar)
- Página `/privacidade` estática (LGPD básica)
- Variáveis de ambiente White Label centralizadas

### Fase 2 — Growth (Pós-Lançamento)
- Integração do evoCRM: Webhooks de áudio/foto via WhatsApp do lojista
- Debouncing inteligente de webhooks com `draft_sessions` para agrupamento de mídias
- Notificações automáticas de status ao lojista ("Recebi suas fotos, processando...")
- Otimização automática de imagens no upload (compressão, webp)
- Variações de produtos (cor, tamanho, material)

### Fase 3 — Vision (Futuro)
- SDR IA: Agente de vendas que atende o cliente final da vitrine no WhatsApp
- Publicação automática de anúncios no Mercado Livre e Shopee via webhook
- Painel de analytics de visitas e pedidos
- Multitenancy nativo (uma instância, múltiplas lojas)

### Risk Mitigation Strategy

**Risco Técnico — Timeout de Webhook (evoCRM + Groq):**
Mitigação: Webhook retorna 200 imediatamente e processa o Groq de forma assíncrona (background job ou Supabase Edge Function). Endereçado na Fase 2.

**Risco de Mercado — Adoção do Lojista:**
Mitigação: Prova de conceito direta com a 2M LAB. Feedback real antes de escalar para outros lojistas.

**Risco de Recurso — Desenvolvedor Solo:**
Mitigação: Filosofia SLC garante um escopo cirúrgico e executável. O Agente de IA acelera a geração de código boilerplate e testes.

## Functional Requirements

### Área 1: Vitrine Pública (Storefront)
- FR01: O cliente final pode visualizar o catálogo completo de produtos da loja.
- FR02: O cliente final pode visualizar a página de detalhe de um produto com galeria de fotos (3-5 imagens).
- FR03: O cliente final pode acessar um produto através de um link único, limpo e compartilhável.
- FR04: O cliente final pode adicionar produtos ao carrinho.
- FR05: O cliente final pode remover produtos do carrinho.
- FR06: O cliente final pode visualizar o resumo do carrinho com itens, quantidades e total.
- FR07: O cliente final pode finalizar o pedido gerando uma mensagem pré-formatada redirecionada ao WhatsApp do lojista.
- FR08: O cliente final pode acessar a página de Privacidade e Termos de Uso.

### Área 2: Agente de IA (Criação de Anuncios)
- FR09: O lojista pode enviar um arquivo de áudio com a descrição do produto para o Agente de IA via painel web.
- FR10: O lojista pode fazer upload de 3 a 5 fotos do produto para o Agente de IA via painel web.
- FR11: O sistema pode transcrever automaticamente o áudio do lojista em texto estruturado.
- FR12: O sistema pode gerar um rascunho de anuncio (título, descrição, preço) a partir do áudio transcrito.
- FR13: O sistema pode validar a presença de campos obrigatórios (título e preço) no áudio antes de gerar o rascunho.
- FR14: O sistema pode solicitar ao lojista os dados faltantes de forma conversacional e amigável quando campos obrigatórios não são identificados.
- FR15: O lojista pode revisar e editar o rascunho gerado pelo Agente de IA antes de publicar.
- FR16: O lojista pode aprovar o rascunho e publicar o produto na vitrine com um único comando.
- FR17: O lojista pode descartar o rascunho e iniciar um novo cadastro.

### Área 3: Gestão de Produtos (Admin CRUD)
- FR18: O lojista pode criar um produto manualmente via formulário clássico no painel admin.
- FR19: O lojista pode editar qualquer campo de um produto publicado (título, descrição, preço, fotos).
- FR20: O lojista pode inativar (ocultar) um produto da vitrine sem exclui-lo.
- FR21: O lojista pode excluir permanentemente um produto.
- FR22: O lojista pode visualizar a lista de todos os produtos com status (publicado, rascunho, inativo).
- FR23: O lojista pode gerenciar as fotos de um produto (adicionar, remover, reordenar).

### Área 4: Autenticação e Acesso
- FR24: O lojista pode fazer login no painel admin com email e senha.
- FR25: O lojista pode fazer logout do painel admin.
- FR26: O sistema pode proteger todas as rotas `/admin` de acesso não autenticado.
- FR27: O cliente final pode acessar a vitrine pública sem necessidade de autenticação.

### Área 5: Configuração White Label
- FR28: O operador (Super Admin) pode configurar o número de WhatsApp de destino do carrinho via variável de ambiente (`WHATSAPP_SALES_NUMBER`).
- FR29: O operador pode configurar o nome da loja, logo e cores via variáveis de ambiente ou painel.
- FR30: O operador pode configurar as chaves de API de todas as integrações (Groq, Supabase) via variáveis de ambiente.

### Área 6: Controle de Estado e Persistência
- FR31: O sistema pode criar e manter uma sessão de rascunho (`draft_session`) enquanto o lojista envia mídias para o Agente de IA.
- FR32: O sistema pode associar múltiplas fotos e um áudio a uma mesma sessão de rascunho.
- FR33: O sistema pode armazenar as fotos de produtos no Supabase Storage.
- FR34: O sistema pode alterar o status de um produto entre `draft`, `published` e `inactive`.
- FR35: O sistema pode gerar e retornar um link único e permanente para cada produto publicado.
- FR36: O sistema gera automaticamente um `slug` de URL limpo e SEO-friendly a partir do título do produto (ex: `coruja-preta-15cm`).
- FR37: O lojista pode editar manualmente o `slug` de um produto no painel admin.

### Área 7: Descoberta e Feedback
- FR38: O cliente final pode buscar ou filtrar produtos por categoria ou nome na vitrine.
- FR39: O sistema exibe um indicador de status de processamento enquanto o Agente de IA transcreve o áudio e gera o rascunho.
- FR40: O lojista pode visualizar o histórico de rascunhos gerados (com status: aprovado, descartado, pendente) no painel admin.
- FR41: O agente multimodal pode cadastrar anúncios usando o modelo NVIDIA (qwen3.5) via API, enviando imagens em base64 e áudio para geração de anúncios.

```python
import os, requests, base64

def read_b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

payload = {
    "model": os.getenv("NVIDIA_MODEL", "qwen/qwen3.5-122b-a10b"),
    "messages": [{"role": "user", "content": f"Imagem: {read_b64('foto.jpg')}\nÁudio: {read_b64('audio.wav')}"}],
    "max_tokens": 16384,
    "temperature": 0.60,
    "top_p": 0.95,
}

headers = {
    "Authorization": f"Bearer {os.getenv('NVIDIA_API_KEY')}",
    "Accept": "application/json",
}

response = requests.post(os.getenv('NVIDIA_INVOKE_URL'), headers=headers, json=payload)
print(response.json())
```

## Non-Functional Requirements

### Performance
- **Response Time:** Todas as interações de usuário (visualizar catálogo, detalhes de produto, adicionar ao carrinho) devem responder em ≤ 2 s em conexões 3G/4G.
- **Throughput:** O backend deve suportar simultaneamente 200 requisições HTTP por segundo sem degradação perceptível.
- **Caching:** Utilizar CDN (Vercel Edge) para assets estáticos e SWR para dados de catálogo, garantindo carregamento instantâneo de páginas frequentes.

### Security & Privacy (LGPD)
- **Data Encryption:** Todos os dados em repouso (Supabase) e em trânsito (HTTPS/TLS) devem ser criptografados.
- **Access Control:** Rotas `/admin/*` protegidas por Supabase Auth; tokens de API (Groq, Supabase Service Role) nunca expostos ao cliente.
- **Minimal Data Retention:** Dados de contato do cliente (telefone) são mantidos apenas temporariamente para gerar o link `wa.me` e são descartados após 24 h.
- **Audit Logging:** Todas as ações de CRUD e geração de rascunhos são registradas em tabela de auditoria para rastreabilidade.

### Scalability & Reliability
- **Horizontal Scaling:** Vercel auto‑escalará funções serverless conforme a carga; Supabase oferece auto‑scaling de banco de dados.
- **Availability:** SLA interno de 99.5 % de uptime para a vitrine e painel administrativo.
- **Graceful Degradation:** Em caso de falha do serviço Groq, o sistema apresenta mensagem amigável solicitando nova gravação de áudio.

### Accessibility
- **WCAG 2.1 AA Compliance:** Contraste de cores, navegação por teclado, textos alternativos para imagens e suporte a leitores de tela.

### Integration
- **Webhook Reliability:** EvoCRM webhooks respondem 200 imediatamente; processamento assíncrono garante que falhas temporárias não causem retries infinitas.
- **API Rate Limits:** Monitoramento de limites de chamadas ao Groq; fallback para modo offline (salvar áudio para processamento posterior) quando limite for atingido.
