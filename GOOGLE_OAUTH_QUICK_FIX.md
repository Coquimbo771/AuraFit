# 🚨 SOLUCIÓN RÁPIDA: Error "provider is not enabled"

## ❌ Error Actual
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

## ✅ Solución (5 minutos)

---

## Paso 1: Ve a Supabase Dashboard

1. Abre: https://supabase.com/dashboard
2. Selecciona tu proyecto **AuraFit**
3. En el menú lateral, ve a: **Authentication** → **Providers**

---

## Paso 2: Habilitar Google Provider

En la lista de providers, busca **Google**:

1. **Toggle ON** el switch de Google (actualmente está OFF)
2. Te pedirá dos campos:
   - **Client ID**: (te lo doy en el paso 3)
   - **Client Secret**: (te lo doy en el paso 3)

**¡NO CIERRES ESTA VENTANA TODAVÍA!**

---

## Paso 3: Obtener Credentials de Google

### Opción A: Testing Rápido (5 min)

Para probar ahora mismo sin configurar Google Cloud:

1. En Supabase, **deja vacíos** Client ID y Client Secret
2. Solo activa el toggle de Google
3. Supabase usará sus propias credenciales de desarrollo

⚠️ **Limitación**: Solo funciona para testing, no para producción.

### Opción B: Configuración Completa (15 min)

Si quieres configurarlo para producción:

#### 3.1 Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea un proyecto nuevo o usa uno existente
3. Habilita **Google+ API**:
   - Menu → APIs & Services → Library
   - Busca "Google+ API"
   - Click **Enable**

#### 3.2 OAuth Consent Screen

1. Menu → APIs & Services → OAuth consent screen
2. Selecciona **External**
3. Completa:
   - App name: `AuraFit`
   - User support email: tu-email@gmail.com
   - Developer contact: tu-email@gmail.com
4. **Save and Continue**

#### 3.3 Crear Credentials

1. Menu → APIs & Services → Credentials
2. **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `AuraFit Web`

5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   ```

6. **Authorized redirect URIs** (¡IMPORTANTE!):
   ```
   https://TU-PROYECTO-ID.supabase.co/auth/v1/callback
   ```
   
   🚨 **Reemplaza `TU-PROYECTO-ID`** con tu ID real de Supabase.
   
   Para encontrarlo:
   - Ve a Supabase Dashboard
   - Settings → API
   - Mira tu **Project URL**: `https://xxxxx.supabase.co`
   - El `xxxxx` es tu Project ID

7. Click **Create**

8. **¡COPIA ESTOS VALORES!**:
   - **Client ID**: `123456789-abc.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxxx`

---

## Paso 4: Pegar Credentials en Supabase

Vuelve a Supabase Dashboard (Authentication → Providers → Google):

1. **Client ID**: Pega el que copiaste
2. **Client Secret**: Pega el que copiaste
3. **Enabled**: Asegúrate que esté ON (azul)
4. Click **Save**

---

## Paso 5: Copiar Redirect URL

Supabase te mostrará:
```
Redirect URL: https://tu-proyecto.supabase.co/auth/v1/callback
```

**Copia esta URL** y:
1. Vuelve a Google Cloud Console
2. Credentials → Tu OAuth Client
3. Authorized redirect URIs
4. **Pega la URL** que copiaste de Supabase
5. **Save**

---

## ✅ Paso 6: Probar

1. Refresca tu app: http://localhost:5173/login
2. Click en **"Continuar con Google"**
3. Debería abrirse el popup de Google ✅

---

## 🔍 Verificar Configuración

### En Supabase Dashboard:

```
Authentication → Providers → Google
✅ Enabled: ON (azul)
✅ Client ID: xxxxx.apps.googleusercontent.com
✅ Client Secret: GOCSPX-xxxxx
```

### En Google Cloud Console:

```
Credentials → OAuth 2.0 Client IDs → AuraFit Web
✅ Authorized JavaScript origins: http://localhost:5173
✅ Authorized redirect URIs: https://tu-proyecto.supabase.co/auth/v1/callback
```

---

## ❓ Si Sigue Sin Funcionar

### Error: "redirect_uri_mismatch"
- Verifica que la redirect URI en Google Cloud coincida **exactamente** con la de Supabase

### Error: "Access blocked"
- En Google Cloud Console → OAuth consent screen
- Agrega tu email a **Test users**

### Error: "Invalid client"
- Verifica que Client ID y Secret estén correctos en Supabase
- Sin espacios extra al inicio o final

### Error: Provider disabled
- Asegúrate que el toggle de Google esté ON en Supabase
- Espera 10 segundos después de guardar
- Refresca la página

---

## 📸 Captura de Pantalla de Referencia

### Supabase Dashboard - Debe verse así:

```
Authentication → Providers

[✓] Google              [Enabled ●]
    Client ID: 123456-xxx.apps.googleusercontent.com
    Client Secret: GOCSPX-xxxxxxxxxxxxx
    Redirect URL: https://xxxxx.supabase.co/auth/v1/callback
    [Save]
```

---

## 🎯 Resumen

**El problema**: Google provider no está habilitado en Supabase

**La solución**:
1. ✅ Supabase Dashboard → Authentication → Providers → Google → **ON**
2. ✅ Agregar Client ID y Secret (de Google Cloud)
3. ✅ Agregar Redirect URI en Google Cloud

**Tiempo estimado**: 5-15 minutos

**Resultado**: Botón "Continuar con Google" funcionará ✅

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema:

1. Verifica que el toggle de Google esté **ON** en Supabase
2. Espera 10-30 segundos después de guardar
3. Cierra y abre tu navegador
4. Revisa que las URLs coincidan exactamente

**¡El código del frontend está correcto!** Solo necesita la configuración de Supabase.

---

**¿Prefieres la Opción A (Testing) u Opción B (Completa)?**

- **Opción A**: Solo toggle ON en Supabase → Funciona en 1 minuto
- **Opción B**: Configuración completa con Google Cloud → 15 minutos pero para producción
