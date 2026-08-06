# Integración web ↔ app — Abundance Code

Documento técnico para el equipo de la app (Lovable).
Fecha: 5 de agosto de 2026 · Complementa a `BRIEF-APP-LOVABLE.md`, que sigue siendo válido para producto, copy e identidad visual.

> **Qué cambió desde el brief anterior:** la pasarela de pago ya está montada, probada de punta a punta y funcionando. Este documento describe los contratos **verificados contra el código en ejecución**, no una especificación de intenciones.

---

## 1. Estado real, hoy

Lo que sigue está probado, no supuesto. Se simuló una compra completa y se comprobó cada eslabón:

| Paso | Estado |
|---|---|
| Stripe Checkout en modo suscripción | ✅ crea sesión, USD, $49 hoy |
| Webhook `checkout.session.completed` | ✅ firma validada, responde 200 |
| Fila en la tabla `subscriptions` | ✅ con token de acceso y código de respaldo |
| Correo de acceso al comprador | ✅ recibido, con botón y código |

Ejemplo real de lo que quedó guardado tras una compra de prueba:

```
estado : active | monthly | 49.00 usd
código : AC-8D17-28FC
token  : l4fYiikpEWqIwXB_xTi3440B…   (caduca a los 30 días)
```

---

## 2. El flujo, de principio a fin

```
Web /pricing → el usuario escribe su nombre y correo
   ↓
Stripe Checkout (suscripción)  ·  US$49 hoy + US$14.99/mes desde el día 31
   ↓ paga
Webhook → la web guarda la suscripción y emite un token de un solo uso
   ↓
success_url de Stripe → https://TU-APP/activar?token=xxxxx
   ↓
La app canjea el token contra el backend de la web
   ↓
Recibe el correo que pagó → crea o vincula la cuenta a ESE correo → onboarding
```

En paralelo, **el comprador recibe un correo** con el mismo enlace. Es la red de seguridad de quien cerró la pestaña tras pagar: aunque no vuelva por el `success_url`, tiene su acceso en la bandeja de entrada.

**La app no cobra nada.** No necesita Stripe, ni claves, ni webhooks. Sólo pregunta al backend de la web quién ha pagado.

---

## 3. Contratos de los endpoints

Base: la URL pública del backend Express de la web (ver §6 — pendiente de confirmar).

`/redeem` y `/status` son **servidor a servidor**. Llevan un secreto compartido que **nunca debe llegar al navegador**:

```
Authorization: Bearer <APP_SHARED_SECRET>
```

También se acepta la cabecera `x-app-secret`. El secreto se entrega por canal seguro, aparte de este documento.

---

### 3.1 · Canjear el token — al aterrizar con `?token=`

```http
POST /api/access/redeem
Authorization: Bearer <APP_SHARED_SECRET>
Content-Type: application/json

{ "token": "el-token-de-la-url", "appUserId": "id-del-usuario-en-la-app" }
```

**`200` — canje correcto:**

```json
{
  "email": "maria@gmail.com",
  "name": "María",
  "plan": "monthly",
  "status": "active",
  "source": "stripe",
  "currentPeriodEnd": "2026-09-04T20:15:26.918+00:00",
  "hasAccess": true,
  "utmCampaign": "hero",
  "alreadyRedeemed": false
}
```

**`200` — el token ya se había canjeado.** No es un error: se devuelve el mismo objeto con `alreadyRedeemed: true` y `redeemedAt`. El usuario puede recargar la página o volver a abrir el enlace del correo sin encontrarse un fallo. **Déjalo entrar.**

**Otros códigos:**

| Código | Cuerpo | Qué hacer |
|---|---|---|
| `400` | `{ message: "Falta el token" }` | Error de la app |
| `404` | `{ message, reason: "not_found" }` | Token inexistente |
| `410` | `{ message, reason: "expired", email }` | Caducado (>30 días). Manda al usuario a `https://abundacecode.com/activar-acceso`. El `email` viene incluido para poder prerrellenar el formulario |
| `401` | `{ message: "No autorizado" }` | Secreto incorrecto |
| `503` | `{ message: "Integración con la app no configurada" }` | Al backend de la web le falta el secreto — avisad |

`appUserId` es opcional pero conviene mandarlo: deja trazabilidad de qué cuenta de la app corresponde a qué pago.

---

### 3.2 · Consultar el estado — al iniciar sesión, y periódicamente

```http
GET /api/access/status?email=maria@gmail.com
Authorization: Bearer <APP_SHARED_SECRET>
```

**`200`** — el mismo objeto de arriba, sin `alreadyRedeemed`. Si no hay suscripción:

```json
{ "email": "maria@gmail.com", "hasAccess": false, "status": "none" }
```

Valores de `status`: `active` · `past_due` (impago, aún con acceso de gracia) · `canceled` · `incomplete` · `none`.

> **Usad `hasAccess`, no `status`.** El backend lo calcula (`active` o `past_due` → `true`). Si mañana cambian las reglas de gracia, la app no se entera.

> **Guardad el resultado en vuestra propia base y revalidadlo una vez al día o al iniciar sesión — no en cada carga de pantalla.** Si el backend de la web se cae, los usuarios ya validados tienen que poder seguir usando la app.

---

### 3.3 · Reenviar el enlace — público, sin secreto

```http
POST /api/access/resend
Content-Type: application/json

{ "email": "maria@gmail.com" }
```

Responde **siempre** lo mismo, exista o no la suscripción:

```json
{ "ok": true, "message": "Si hay una suscripción con ese correo, te acabamos de enviar el enlace de acceso." }
```

Es deliberado: decir "ese correo no existe" dejaría que cualquiera averiguase quién es cliente. Cada reenvío **emite un token nuevo e invalida el anterior**, por si el correo viejo acabó en manos de otra persona.

La web ya tiene una página para esto en `/activar-acceso`. La app no necesita implementarlo, sólo enlazar ahí cuando reciba un `410`.

---

### 3.4 · Gestionar la suscripción — el botón de "cancelar en dos clics"

```http
POST /api/stripe/portal
Content-Type: application/json

{ "email": "maria@gmail.com" }
```

Devuelve `{ "url": "https://billing.stripe.com/..." }`. La app sólo abre esa URL: es el portal de cliente de Stripe, donde el usuario cancela, cambia de tarjeta y ve sus facturas. **No hay que construir ninguna de esas pantallas.**

---

## 4. Qué hay que cambiar en la app

### 4.1 · Quitar el muro del código de la esfera

`/activar` pide hoy un código privado que venía en la caja del producto físico. **Ese producto ya no se vende**, así que quien llega desde la web choca contra un muro. El flujo nuevo:

```
Llega con ?token=xxx (desde Stripe o desde el correo de acceso)
  → canjear el token → obtener el correo que pagó
  → crear cuenta con ese correo (magic link o Google, ya prevalidado)
  → pedir datos de nacimiento (fecha, hora, lugar)
  → Portal: carta natal calculada + primera lectura
```

**Por qué un token y no "regístrate con el mismo correo":** si se le pide al usuario que use el mismo correo, un porcentaje entra con Google y otra cuenta, y acaba habiendo pagado sin poder entrar. El token ya lleva el correo dentro, así que equivocarse no es posible.

### 4.2 · Casos que hay que contemplar

- **Llega sin token** (escribió la URL, o vuelve otro día): pantalla normal de iniciar sesión. Tras autenticar, consultar `/api/access/status` con su correo.
- **Token ya canjeado**: `alreadyRedeemed: true`. Dejarlo entrar.
- **Token caducado**: `410` → mandarlo a `https://abundacecode.com/activar-acceso`.
- **Se autentica con un correo distinto al que pagó**: no tiene acceso. Explicárselo y ofrecerle entrar con el correo de la compra, o recuperar su enlace.
- **Hora de nacimiento vacía o aproximada**: no debe bloquear el registro. La lectura sigue siendo personalizada aunque ascendente y casas pierdan precisión.
- **Lugar de nacimiento**: necesita autocompletado de ciudades, para resolver zona horaria y coordenadas.
- **Los que ya compraron una esfera**: mantener la entrada por código como vía secundaria ("Ya tengo mi esfera"), nunca como puerta principal. En la base se distinguen por `source: 'legacy_sphere'`.

### 4.3 · Copy que hay que reescribir

| Dice hoy | Problema |
|---|---|
| "Activar mi esfera" (CTA principal) | Ya no hay esfera |
| "Tu código está vinculado a tu esfera" | Ya no hay código ni caja |
| "Ritual de activación de tres pasos: código → datos → lectura" | El primer paso desaparece |
| "30 días de activaciones diarias" | Suena a producto con caducidad; ahora es suscripción continua |
| "No es una lectura puntual. Es un portal." | **Este sí sirve** — es el mensaje nuevo |

Tono: directo, sin jerga astrológica, sin promesas de resultados. La idea central es *"tu carta natal no cambia; lo que cambia cada día es lo que el cielo activa en ella"*.

### 4.4 · Idiomas

La web es bilingüe español / inglés con selector manual. La app hoy sólo está en español, así que un usuario que navega la web en inglés aterriza en una app que no entiende.

---

## 5. El modelo de precio, para contarlo igual que la web

| Momento | Importe | Qué significa |
|---|---|---|
| Hoy, al pagar | **US$49** | Cubre los primeros **30 días** de acceso completo |
| Día 31 en adelante | **US$14.99 / mes** | Mantiene activas las lecturas avanzadas, señales diarias, ciclos y nueva orientación |

En Stripe es **una sola suscripción** de $14.99/mes con 30 días de trial, más un cargo único de $49 cobrado al instante. Durante el primer mes la suscripción está en estado `trialing` en Stripe — **pero eso NO significa que sea gratis**: esos 30 días ya están pagados con los $49. El endpoint `/status` ya lo traduce y devuelve `status: "active"`, `hasAccess: true`.

Si la app muestra cuándo vence el acceso, usad `currentPeriodEnd`: durante el primer mes es el día 31, que es cuando cae el primer cobro mensual.

**Lo que la app NO debe hacer:** integrar Stripe, guardar datos de tarjeta o ids de Stripe, ni decidir precios. Sólo maneja `email`, `plan`, `status` y `hasAccess`.

---

## 6. Lo que falta acordar entre los dos equipos

1. **URL pública del backend de la web.** Es a donde la app hace las llamadas. Pendiente de redespliegue — os la pasamos en cuanto esté.
2. **URL definitiva de la app y su ruta de entrada** (hoy `/activar`). Es el `success_url` de Stripe: si cambiáis la ruta, avisad, son dos variables de entorno de nuestro lado. Lo natural sería moverla a `app.abundacecode.com`.
3. **`APP_SHARED_SECRET`.** Ya está generado. Va en las variables de entorno de vuestro servidor, **nunca en el código del navegador**. Se entrega por canal seguro.
4. **El código de respaldo `AC-XXXX-XXXX`.** El correo de acceso lo incluye, pero **hoy `/redeem` sólo acepta el token largo**. Hay que decidir: o añadimos soporte para canjear por código (cambio pequeño de nuestro lado), o el código queda sólo como referencia para soporte. Decidlo vosotros según si queréis una pantalla de "introduce tu código".
5. **¿Renovación automática o aceptada?** La web está montada como renovación automática. Si la intención es que a los 30 días se le invite y no se le cobre si no hace nada, es otro montaje en Stripe y cambia el copy, los Términos y el aviso legal.

---

## 7. Restricciones

- **No pedir dirección de envío** ni ningún dato logístico. No se envía nada.
- **No hablar de esfera, cristal, caja, QR, pulsera ni envío** en ninguna pantalla.
- **No prometer prueba gratis ni "sin tarjeta"** mientras no exista de verdad.
- **No bloquear funciones sueltas** para venderlas aparte. La web promete un solo plan con todo incluido.
- Las llamadas a `/redeem` y `/status` son **servidor a servidor**. La web sólo acepta peticiones de navegador desde su propio dominio (CORS), así que estas llamadas no se pueden hacer desde el cliente — y por seguridad tampoco deben.

---

## 8. Resumen en una frase

> La web ya vende y cobra: el usuario paga en abundacecode.com, recibe un correo con su acceso, y llega a la app con un token en la URL. La app no necesita cobrar nada — sólo canjear ese token contra el backend, vincular la cuenta al correo que pagó, y quitar de en medio el muro del código y todo el lenguaje de la esfera de cristal que ya no se vende.
