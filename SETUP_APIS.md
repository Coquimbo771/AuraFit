# AuraFit - APIs e instalación para sistema completo

Este proyecto ya tiene frontend y Supabase conectados. Con los últimos cambios ahora incluye:

- Roles de usuario (`client`, `stylist`, `admin`)
- **Autenticación con Google OAuth** (Login/Register con Gmail)
- Carrito persistente y checkout
- Creación de órdenes (`orders`, `order_items`)
- Bot comercial para tienda virtual
- Ruta de panel admin

## 1) Lo mínimo para correr

Instala dependencias del proyecto:

```bash
npm install
```

Configura variables en `.env` (copiando desde `.env.example`):

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_CHATBOT_API_URL=...
VITE_CHATBOT_API_KEY=...
```

Ejecuta:

```bash
npm run dev
```

## 2) Supabase (obligatorio)

### Migraciones
Debes aplicar también la nueva migración de comercio:

- `supabase/migrations/20260219091500_003_add_roles_orders_and_assistant_support.sql`

Si usas Supabase CLI local:

```bash
supabase db reset
# o
supabase migration up
```

### Google OAuth (Recomendado)
Para habilitar "Continuar con Google" en Login y Register:

1. Ve a [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) para instrucciones detalladas
2. Configura OAuth 2.0 en Google Cloud Console
3. Habilita Google provider en Supabase Dashboard
4. Agrega Client ID y Client Secret

**Beneficios:**
- ✅ Registro instantáneo con Gmail
- ✅ Email único garantizado (no duplicados)
- ✅ Sin contraseñas que recordar
- ✅ Email verificado automáticamente

## 3) API para Bot (recomendado)

El frontend llama a `VITE_CHATBOT_API_URL` con este payload:

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Debe responder con:

```json
{ "reply": "texto del bot" }
```

Si no configuras API, el bot funciona en modo fallback local.

## 4) APIs recomendadas para tienda virtual

### Pagos
- Stripe API (recomendado)
- Mercado Pago API (LatAm)

### Envíos
- Shippo API
- EasyPost API

### Facturación electrónica (según país)
- Integración local de facturación (SUNAT/DIAN/SII, etc.) mediante backend propio

### Email transaccional
- Resend API
- SendGrid API

### Analytics
- PostHog
- Google Analytics 4

## 5) Backend recomendado (Node.js)

Crea un backend/edge layer para no exponer secretos en frontend.

Paquetes sugeridos:

```bash
npm install express cors zod dotenv
npm install stripe
npm install openai
npm install resend
```

> No pongas llaves secretas de Stripe/OpenAI en variables `VITE_*`.

## 6) Endpoints backend sugeridos

- `POST /api/chatbot` -> responde bot comercial
- `POST /api/checkout/create-payment-intent` -> pagos
- `POST /api/orders/:id/confirm` -> confirmación de orden
- `GET /api/shipping/rates` -> costos de envío
- `POST /api/webhooks/stripe` -> webhook de pagos

## 7) Seguridad necesaria para producción

- Validar rol admin en backend (no solo frontend)
- Verificar ownership de órdenes en API
- Habilitar rate-limit en endpoints chatbot y checkout
- Requerir webhook signature para pagos
- Auditar políticas RLS de Supabase
