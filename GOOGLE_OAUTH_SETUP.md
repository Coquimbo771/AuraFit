# 🔐 Configuración de Google OAuth - AuraFit

Esta guía te ayudará a configurar la autenticación con Google (OAuth) para que los usuarios puedan registrarse e iniciar sesión con su cuenta de Gmail directamente.

## ✨ Características Implementadas

✅ **Login con Google** - Botón "Continuar con Google" en Login  
✅ **Registro con Google** - Botón "Continuar con Google" en Register  
✅ **Email único** - Supabase garantiza que no se dupliquen emails  
✅ **Flujo OAuth completo** - Redirect automático después de autenticación  
✅ **UI elegante** - Botón con logo oficial de Google  

---

## 📋 Paso 1: Configurar Google Cloud Console

### 1.1 Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: `AuraFit Authentication`

### 1.2 Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** → **Library**
2. Busca "Google+ API"
3. Haz clic en **Enable**

### 1.3 Configurar Pantalla de Consentimiento OAuth

1. Ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **External** (para usuarios fuera de tu organización)
3. Completa los campos requeridos:
   - **App name**: AuraFit
   - **User support email**: tu-email@gmail.com
   - **Developer contact**: tu-email@gmail.com
4. **Scopes**: Agrega `.../auth/userinfo.email` y `.../auth/userinfo.profile`
5. **Test users** (opcional): Agrega emails de prueba si estás en modo testing
6. Guarda y continúa

### 1.4 Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** → **Credentials**
2. Clic en **Create Credentials** → **OAuth client ID**
3. Tipo de aplicación: **Web application**
4. Nombre: `AuraFit Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://tu-dominio.com
   ```
6. **Authorized redirect URIs** - **¡MUY IMPORTANTE!**:
   ```
   https://tu-proyecto.supabase.co/auth/v1/callback
   ```
   
   > 🚨 Reemplaza `tu-proyecto` con tu ID de proyecto de Supabase
   
7. Clic en **Create**
8. **¡GUARDA!** Se te mostrarán:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxx`

---

## 📋 Paso 2: Configurar Supabase

### 2.1 Habilitar Google Provider

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto **AuraFit**
3. Ve a **Authentication** → **Providers**
4. Busca **Google** en la lista
5. **Enable** el toggle
6. Pega las credenciales de Google Cloud:
   - **Client ID**: El que copiaste antes (`xxxxx.apps.googleusercontent.com`)
   - **Client Secret**: El que copiaste antes (`GOCSPX-xxxxx`)
7. **Redirect URL** (copia esta URL para Google Cloud):
   ```
   https://tu-proyecto.supabase.co/auth/v1/callback
   ```
8. **Save**

### 2.2 Verificar Configuración de Email Único

Supabase automáticamente garantiza que los emails sean únicos en la tabla `auth.users`. No necesitas configuración adicional.

Para verificar manualmente:

```sql
-- En Supabase SQL Editor
SELECT * FROM auth.users WHERE email = 'test@gmail.com';
```

Si un usuario intenta registrarse con un email que ya existe (ya sea por registro manual o Google OAuth), Supabase rechazará la solicitud.

---

## 📋 Paso 3: Configurar Variables de Entorno

Tu archivo `.env` ya debería tener:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

**No necesitas agregar Client ID o Secret de Google en el frontend** - Supabase maneja esto automáticamente.

---

## 🚀 Paso 4: Probar la Autenticación

### 4.1 Flujo de Login con Google

1. Inicia tu aplicación:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:5173/login`

3. Haz clic en **"Continuar con Google"**

4. Se abrirá una ventana de Google OAuth

5. Selecciona tu cuenta de Gmail

6. Google te redirigirá a tu app en `/dashboard`

### 4.2 Flujo de Registro con Google

1. Ve a `http://localhost:5173/register`

2. Haz clic en **"Continuar con Google"**

3. Mismo flujo que login - Google OAuth

4. Si el email ya existe, Supabase lo reconoce y hace login

5. Si es nuevo, crea el usuario automáticamente

---

## 🔍 Verificar Usuarios en Supabase

Para ver los usuarios creados con Google OAuth:

```sql
-- En Supabase SQL Editor
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar,
  provider,
  created_at
FROM auth.users
WHERE provider = 'google'
ORDER BY created_at DESC;
```

---

## 🛠️ Estructura del Código

### authStore.ts - Función OAuth

```typescript
signInWithGoogle: async () => {
  set({ loading: true, error: null });
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    set({ loading: false });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : 'Google sign in failed',
      loading: false,
    });
    throw error;
  }
}
```

### Login.tsx / Register.tsx - Botón Google

```tsx
<Button
  variant="outline"
  size="lg"
  type="button"
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center gap-3"
  isLoading={loading}
>
  <GoogleIcon />
  <span>Continuar con Google</span>
</Button>
```

---

## 🎯 Beneficios de Google OAuth

### Para Usuarios
- ✅ **Registro instantáneo** - 1 clic, sin formularios
- ✅ **Sin contraseñas** - Mayor seguridad
- ✅ **Autocompletar datos** - Email y nombre desde Google
- ✅ **Login rápido** - No recordar contraseñas

### Para Desarrolladores
- ✅ **Email verificado** - Google ya verificó el email
- ✅ **Unicidad garantizada** - Supabase previene duplicados
- ✅ **Avatar automático** - Google proporciona foto de perfil
- ✅ **Menos support tickets** - No hay "olvidé mi contraseña"

---

## 🔒 Seguridad y Validaciones

### Prevención de Emails Duplicados

Supabase maneja esto automáticamente:

1. **Primer registro con Google**:
   - Email: `user@gmail.com`
   - Provider: `google`
   - ✅ Usuario creado

2. **Intento de registro manual con mismo email**:
   - Email: `user@gmail.com`
   - Provider: `email`
   - ❌ Rechazado: "User already registered"

3. **Segundo login con Google (mismo email)**:
   - Email: `user@gmail.com`
   - Provider: `google`
   - ✅ Login exitoso (no crea duplicado)

### Políticas RLS (Row Level Security)

Verifica que tus políticas RLS permitan acceso basado en `auth.uid()`:

```sql
-- Ejemplo de política para tabla users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

## 🧪 Testing y Debugging

### Errores Comunes

#### Error: "redirect_uri_mismatch"
**Solución**: Verifica que la URI de redirección en Google Cloud Console coincida **exactamente** con la de Supabase:
```
https://tu-proyecto.supabase.co/auth/v1/callback
```

#### Error: "Email not allowed"
**Solución**: Si tu app está en modo "Testing" en Google Cloud, agrega tu email a la lista de test users.

#### Error: "User already registered"
**Solución**: Este es el comportamiento correcto - Supabase está previniendo duplicados. El usuario debe usar "Login" en lugar de "Register".

### Modo Debug en Consola

Para ver el flujo OAuth en acción:

```javascript
// En consola del navegador
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
  console.log('User:', session?.user);
});
```

---

## 📊 Datos de Usuario desde Google

Cuando un usuario se registra con Google, Supabase recibe:

```json
{
  "id": "uuid-generado",
  "email": "user@gmail.com",
  "user_metadata": {
    "full_name": "John Doe",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "email": "user@gmail.com",
    "email_verified": true,
    "phone_verified": false,
    "sub": "google-user-id"
  },
  "provider": "google",
  "created_at": "2026-02-19T..."
}
```

### Acceder a estos datos en tu app:

```typescript
const { data: { user } } = await supabase.auth.getUser();

const fullName = user?.user_metadata?.full_name;
const avatar = user?.user_metadata?.avatar_url;
const emailVerified = user?.user_metadata?.email_verified;
```

---

## 🎨 Personalización del Botón

### Cambiar texto del botón:

```tsx
<Button ...>
  <GoogleIcon />
  <span>Iniciar sesión con Google</span>  {/* Personaliza aquí */}
</Button>
```

### Cambiar estilo del botón:

```tsx
className="w-full flex items-center justify-center gap-3 
           bg-white hover:bg-gray-50 border-2 border-gray-300 
           text-gray-700 font-semibold"
```

---

## 🌍 Producción - Pasos Adicionales

### 1. Agregar Dominio de Producción

En Google Cloud Console → Credentials:

**Authorized JavaScript origins**:
```
https://aurafit.com
https://www.aurafit.com
```

**Authorized redirect URIs**:
```
https://tu-proyecto.supabase.co/auth/v1/callback
```

### 2. Publicar App OAuth (salir de Testing)

1. Google Cloud Console → OAuth consent screen
2. **Publish App**
3. Espera revisión de Google (1-3 días)

### 3. Actualizar Redirect en Código

```typescript
signInWithGoogle: async () => {
  const redirectUrl = import.meta.env.PROD 
    ? 'https://aurafit.com/dashboard'
    : 'http://localhost:5173/dashboard';
    
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      // ...
    },
  });
}
```

---

## 📚 Recursos Adicionales

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## ✅ Checklist de Configuración

Usa este checklist para verificar que todo esté configurado:

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google+ API habilitada
- [ ] OAuth consent screen configurado
- [ ] OAuth 2.0 credentials creadas
- [ ] Redirect URI agregada en Google Cloud
- [ ] Google provider habilitado en Supabase
- [ ] Client ID y Secret agregados en Supabase
- [ ] Botón de Google visible en Login
- [ ] Botón de Google visible en Register
- [ ] Probado login con Google exitosamente
- [ ] Verificado que no se dupliquen emails
- [ ] Usuario visible en Supabase Dashboard

---

## 🎉 ¡Listo!

Ahora tus usuarios pueden:
- ✅ Registrarse con Gmail en 1 clic
- ✅ Iniciar sesión sin contraseña
- ✅ No preocuparse por duplicados de email

**¡La autenticación con Google está completamente funcional en AuraFit! 🚀**
