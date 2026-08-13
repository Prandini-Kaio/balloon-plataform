# Balloon Site

Site de apresentação e vendas do Balloon — landing page, planos e checkout self-service.

## Pré-requisitos

- Node.js 20+
- npm
- Backend Balloon em execução (`http://localhost:8080`)

## Como executar

```bash
cd balloon-plataform
npm install
npm run dev
```

Abra **`http://localhost:5174`** (não use `127.0.0.1`).

Em desenvolvimento o Vite encaminha `/api` para `https://api.balloon.app.br`, então o site local usa produção sem CORS. Reinicie o `npm run dev` depois de alterar o `.env`.

## Variáveis de ambiente

| Variável | Descrição |
| -------- | --------- |
| `VITE_API_BASE_URL` | Local: `/api/v1` (proxy). Pages: `https://api.balloon.app.br/api/v1` |
| `VITE_ADMIN_URL` | URL do painel admin |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Public key do Mercado Pago (é pública por design) |

Copie `.env.example` para `.env` e ajuste conforme necessário.

## Scripts

| Comando | Descrição |
| -------- | --------- |
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Build de produção (`dist/`) |
| `npm run preview` | Servir build localmente |

## Estrutura

- `src/app` — rotas
- `src/components` — layout e UI
- `src/features/plans` — planos
- `src/features/checkout` — checkout
- `public/brand` — logos SVG da marca

## GitHub Pages e credenciais

O Pages só serve HTML/JS estático. **Não dá para esconder o access token no site.**

| Credencial | Onde fica | Visível no browser? |
| ---------- | --------- | ------------------- |
| `MERCADOPAGO_ACCESS_TOKEN` | **Só no backend** (VPS / Render `.env`) | Não |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Front (GitHub Secret no build) | Sim — é pública por design |
| `VITE_API_BASE_URL` / `VITE_ADMIN_URL` | Build do Pages | Sim — não são segredo |

O checkout pago usa Payment Brick no próprio site (PIX, débito e crédito). A confirmação vai **codificada** para o backend, que consulta o Mercado Pago e só então cria empresa + usuário.

No repositório do site, em **Settings → Secrets and variables → Actions**:

- `VITE_MERCADOPAGO_PUBLIC_KEY` = `TEST-...` (teste) ou a public key de produção

**Nunca** crie um secret `MERCADOPAGO_ACCESS_TOKEN` no Pages — ele iria parar no JavaScript se alguém colocasse `VITE_` na frente.

O token de teste/produção continua no servidor:

```bash
MERCADOPAGO_ACCESS_TOKEN=...
```

## API

- `GET /public/planos` — catálogo comercial (preços, limites, entitlements)
- `POST /public/checkout` — reserva os dados (Trial cria a conta na hora; pagos ficam pendentes)
- `POST /public/checkout/{token}/pagar` — payload Base64; backend valida no Mercado Pago e cria a conta
- `GET /public/checkout/{token}/status` — polling até o pagamento confirmar e a empresa ser criada

Destaques regionais são add-on (painel), não fazem parte do checkout do site.
