# Deploy — Abundance Code

Stack en producción:
- **Frontend** → Hostinger (sube `frontend/dist/` a `public_html/`)
- **Backend** → Railway (autodeploy desde GitHub)
- **DB + Auth** → Supabase

---

## 1. Subir el código a GitHub (una sola vez)

### a) Crear el repo en github.com

1. Ve a https://github.com/new
2. **Repository name**: `abundance-code`
3. **Owner**: tu cuenta
4. **Private** (recomendado — el código tiene refs a tu Supabase)
5. **NO marques** "Add README", "Add .gitignore", "Add license" — ya están localmente
6. Click **Create repository**

### b) Conectar y empujar (desde tu máquina)

GitHub te muestra un bloque "…or push an existing repository from the command line". Cópialo y pégalo en tu terminal en `c:\Users\User\Music\abundance-code\`. Será algo así:

```bash
git remote add origin https://github.com/TU-USUARIO/abundance-code.git
git branch -M main
git push -u origin main
```

GitHub te pedirá usuario + token (no la contraseña — los tokens se crean en
GitHub → Settings → Developer settings → Personal access tokens → Tokens classic
→ Generate, scope `repo`).

---

## 2. Desplegar el backend en Railway

### a) Crear el proyecto

1. Ve a https://railway.app → **Login with GitHub**
2. Click **+ New Project** → **Deploy from GitHub repo**
3. Si Railway no ve tu repo: click **Configure GitHub App** → autoriza acceso al repo `abundance-code`
4. Selecciona `abundance-code` → Railway empieza a desplegar (fallará, normal — falta config)

### b) Decirle a Railway que solo despliegue `/backend`

1. En el servicio creado → **Settings** → **Source**
2. **Root Directory** → `backend`
3. **Build Command** → (déjalo vacío, Railway autodetecta `npm install`)
4. **Start Command** → `npm start`

### c) Variables de entorno (Settings → Variables → Raw Editor)

Pega esto y reemplaza los valores marcados con `← LLENAR`:

```
NODE_ENV=production
PORT=5000

# Copia estos 3 valores desde tu backend/.env local (no los pongas en git):
SUPABASE_URL=← LLENAR
SUPABASE_ANON_KEY=← LLENAR (empieza con sb_publishable_)
SUPABASE_SERVICE_ROLE_KEY=← LLENAR (empieza con sb_secret_, nunca commitearlo)

STRIPE_SECRET_KEY=← LLENAR (sk_live_... cuando vayas a vivo, sk_test_... para pruebas)
STRIPE_WEBHOOK_SECRET=← LLENAR (whsec_... — lo generas DESPUÉS, ver paso e)

FRONTEND_URL=https://abundancecode.com
APP_URL=https://TU-SERVICIO.up.railway.app

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=← LLENAR (opcional, para emails de confirmación)
SMTP_PASS=← LLENAR
EMAIL_FROM=noreply@abundancecode.com

WC_URL=https://shop.abundancecode.com
WC_CONSUMER_KEY=← LLENAR (opcional)
WC_CONSUMER_SECRET=← LLENAR (opcional)
WC_CRYSTAL_CODE_ID=14
WC_CRYSTAL_CODE_PREMIUM_ID=15
```

Click **Save** → Railway redeploya.

### d) Obtener la URL pública

1. **Settings** → **Networking** → **Generate Domain**
2. Te da algo como `abundance-code-production.up.railway.app`
3. **Copia esa URL** — la necesitas para el frontend y para Stripe

### e) Configurar el webhook de Stripe contra Railway

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. **Endpoint URL**: `https://abundance-code-production.up.railway.app/api/stripe/webhook`
3. **Events to listen**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Add endpoint** → Stripe te muestra el **Signing secret** (`whsec_…`)
5. Vuelve a Railway → Variables → pega ese valor en `STRIPE_WEBHOOK_SECRET` → Save

### f) Verificar

Abre en el navegador: `https://abundance-code-production.up.railway.app/api/health`

Debes ver:
```json
{ "status": "ok", "backend": "supabase" }
```

Si ves un error, mira los logs en Railway → Deployments → último deploy → View Logs.

---

## 3. Desplegar el frontend en Hostinger

### a) Build local con env de producción

Crea `frontend/.env.production` (en tu máquina, NO se sube a git):

```
VITE_SUPABASE_URL=← LLENAR (copia de backend/.env)
VITE_SUPABASE_ANON_KEY=← LLENAR (copia de backend/.env)
VITE_API_URL=https://TU-SERVICIO.up.railway.app
```

(Reemplaza la última URL por la que te dio Railway.)

Build:

```bash
cd frontend
npm run build
```

Te genera `frontend/dist/` con el sitio listo (HTML + CSS + JS minificados).

### b) Subir a Hostinger

Opción **File Manager** (más fácil):
1. Hostinger → hPanel → File Manager → entra a `public_html/`
2. **Borra** el contenido actual (o muévelo a una carpeta `_backup/`)
3. Sube **el contenido de `frontend/dist/`** (no la carpeta, sino lo que está adentro: `index.html`, `assets/`, `img/`, etc.)

Opción **FTP/SFTP** (más rápido si lo haces seguido):
- Host: tu dominio o `ftp.tudominio.com`
- User/pass: los que te dio Hostinger
- Sube `frontend/dist/*` a `/public_html/`

### c) Configurar SPA routing en Hostinger

React Router usa URLs como `/admin`, `/checkout`, etc. Apache (Hostinger) por
default tirará 404. Crea `frontend/dist/.htaccess` antes de subir (o súbelo
manualmente) con esto:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

(Si Hostinger ya creó uno, fusiona estas líneas — no las dupliques.)

---

## 4. Hacerte admin

1. Ve a `https://abundancecode.com` y regístrate (signup)
2. Supabase → SQL Editor → New query:
   ```sql
   update public.profiles
   set is_admin = true
   where email = 'jeronimosb7@gmail.com';
   ```
3. Click Run
4. Ve a `https://abundancecode.com/admin` → login con esas credenciales

---

## 5. Workflow continuo

A partir de aquí, cada cambio:

1. Editas código local
2. `git add . && git commit -m "describe el cambio" && git push`
3. Railway autodeploya el backend (~1 min)
4. Si tocaste frontend: `cd frontend && npm run build`, sube `dist/` a Hostinger

## Troubleshooting

- **`/api/health` da 502 o "Application failed to respond"** → Railway logs muestran el error real. Usualmente env var faltante.
- **Frontend conecta pero `/api/users/login` da error de CORS** → revisa que `FRONTEND_URL` en Railway sea **exactamente** el dominio que usas (con `https://`, sin slash final).
- **Stripe webhook devuelve 400** → `STRIPE_WEBHOOK_SECRET` no coincide. Cópialo de nuevo desde el endpoint en Stripe Dashboard.
- **PostgREST dice "table not found"** → cache stale. Corre en Supabase SQL Editor: `notify pgrst, 'reload schema';`
- **Login funciona pero `/api/users/me` da 401** → el frontend no está mandando el `Authorization: Bearer ...` o el token expiró. Cierra sesión y vuelve a entrar.
