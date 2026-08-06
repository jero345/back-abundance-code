# Brief para Lovable — Reestructurar la app Abundance Code

**Proyecto:** https://astro-ai-decoder.lovable.app
**Web pública:** https://abundacecode.com
**Fecha:** 30 de julio de 2026

---

## 1. Contexto: qué cambió y por qué

Abundance Code nació como **ecommerce**: se vendía una esfera de cristal física ($177–$217, pago único) que traía dentro una tarjeta con un código; ese código desbloqueaba un portal digital con la lectura de la carta natal. El objeto era el producto y el portal era el regalo que venía dentro.

**Ese modelo se abandonó.** Ahora el producto **es la app**: una web app que lee la carta natal del usuario y la convierte en guía diaria. No hay producto físico, no hay envíos, no hay caja.

La web pública **ya está reestructurada** como túnel de venta hacia la app. Falta que la app acompañe ese cambio: hoy sigue funcionando con el modelo viejo y rompe el embudo en el primer clic.

### El problema concreto a resolver

La página `/activar` pide hoy **un código privado de la caja del producto físico** ("Tu código está vinculado a tu esfera"). Quien viene de la web no tiene ese código y nunca lo va a tener, porque ya no se vende ninguna esfera. **El usuario choca contra un muro.**

Decisión tomada: **el acceso a la app pasa a ser por pago, y el pago ocurre en la web.** El usuario paga en abundacecode.com y llega a la app con un token en la URL que le da acceso automáticamente. Todo eso ya está implementado del lado de la web; lo que falta es el lado de la app.

---

## 2. Qué hace hoy la web (para que la app no la contradiga)

### Rutas de la web

| Ruta | Contenido |
|---|---|
| `/` | Landing del embudo: dolor → identificación → qué descubres → cómo funciona → dentro de la app → qué desbloquea → testimonios → precio → CTA final |
| `/app` | Tour de la app |
| `/how-it-works` | Los 5 pasos, de la fecha de nacimiento a la guía diaria |
| `/pricing` | Precio y formulario de pago — **aquí es donde se cobra** |
| `/about`, `/faq`, `/contact`, `/blog` | Contenido y soporte |
| `/terms`, `/privacy`, `/cookies`, `/disclaimer` | Legales |

Las rutas del ecommerce viejo (`/checkout`, `/abundance-code-sphere`, `/bracelet`, `/shipping`, `/returns`, `/order-confirmation`) se eliminaron y ahora redirigen.

### Cómo llega la gente a la app

Hay dos caminos, y conviene no confundirlos:

| Quién | Desde dónde | A dónde llega |
|---|---|---|
| **Cliente nuevo** | Cualquier botón principal de la web ("Empezar ahora", "Suscribirme"…) | A `/pricing`, paga, y **Stripe lo devuelve a la app con `?token=`** |
| **Cliente que ya pagó** | El enlace "Entrar" del menú, o el correo de acceso | Directo a la app |

Es decir: **la app ya no recibe tráfico frío.** Quien aterriza allí, o trae un token de una compra recién hecha, o es alguien que ya tiene cuenta.

La atribución (qué sección del sitio generó la venta) la resuelve la web: el bloque de origen viaja como metadato hasta Stripe y queda guardado junto a la suscripción. **La app no tiene que hacer nada con los UTM** — lo recibe ya resuelto en el campo `utmCampaign` al canjear el token, por si quiere usarlo.

### Promesas explícitas que hace la web

Todo esto está escrito en la web ahora mismo. La app tiene que poder cumplirlo:

- **Nada que instalar.** Funciona en el navegador de móvil, tablet u ordenador.
- **Multi-dispositivo.** Se entra con la cuenta desde donde sea y las lecturas, historial y favoritos están sincronizados.
- **La carta natal está lista en minutos** desde que se ingresan los datos.
- **Un solo plan, todo incluido.** Sin funciones bloqueadas ni pagos extra dentro de la app.
- **Cancelación en dos clics desde la cuenta**, sin escribir a soporte ni dar explicaciones. Se conserva el acceso hasta el final del periodo pagado.
- **Si se cancela, el historial se guarda**: si el usuario vuelve, lo encuentra donde lo dejó.
- **Se puede corregir la fecha, hora o lugar de nacimiento** desde la cuenta, y la app recalcula la carta y las lecturas.
- **Se puede borrar la cuenta y los datos** de forma permanente, a petición.
- **Se puede dejar la hora de nacimiento en blanco** o poner una aproximada; la lectura sigue siendo personalizada aunque ascendente y casas pierdan precisión.
- **La guía se actualiza cada día**, cruzando los tránsitos actuales con la carta natal.
- **Los datos de nacimiento no se venden ni se comparten** con anunciantes.

### Módulos que la web anuncia

La web muestra una captura real de la app y enumera estos módulos. Deben seguir existiendo con estos nombres:

- **Tu Carta Natal** — calculada y explicada en lenguaje claro, sin jerga
- **Tu Patrón Central** — qué se repite en la vida del usuario y por qué (con el % de alineación)
- **Ciclos y Tránsitos** — qué momento está atravesando
- **Áreas Clave** — dinero, relaciones, propósito, bienestar
- **Guía Personal diaria** — basada en la carta, no en el signo solar
- **Pregunta a tu Código** — preguntas ilimitadas sobre decisiones y momentos concretos
- **Historial y Favoritos** — para volver a lo que sirvió

---

## 3. Qué hay que cambiar en la app

### 3.1 Decisión de arquitectura: **el pago ocurre en la web, no en la app**

Esto ya está implementado en el sitio y define lo que la app tiene que hacer.

```
Web /pricing → el usuario mete su correo → Stripe Checkout (suscripción)
   ↓ paga
Webhook → el backend de la web guarda la suscripción y genera un token de un solo uso
   ↓
success_url de Stripe → https://TU-APP/activar?token=xxxxx
   ↓
La app canjea el token contra el backend de la web
   ↓
Recibe el correo que pagó → crea o vincula la cuenta a ESE correo → onboarding
```

**La app no cobra nada.** No necesita Stripe. Sólo necesita preguntar al backend de la web quién ha pagado.

**Por qué un token y no un simple "regístrate con el mismo correo":** si se le pide al usuario que use el mismo correo, un porcentaje entra con Google y otra cuenta, y acaba habiendo pagado sin poder entrar. El token ya lleva el correo dentro, así que **equivocarse no es posible**: la app lo vincula sola.

### 3.2 Onboarding — lo más importante

**Quitar el muro del código.** El flujo nuevo es:

```
Llega con ?token=xxx (desde Stripe o desde el correo de acceso)
  → La app canjea el token → obtiene el correo que pagó
  → Crea cuenta con ese correo (magic link o Google, ya prevalidado)
  → Ingresa datos de nacimiento (fecha, hora, lugar)
  → Portal: carta natal calculada + primera lectura
```

Casos que hay que contemplar:

- **Llega sin token** (escribió la URL, o vuelve otro día): pantalla normal de iniciar sesión. Tras autenticar, consultar `GET /api/access/status` con su correo para saber si sigue teniendo acceso.
- **Token ya canjeado**: no es un error. El endpoint devuelve `alreadyRedeemed: true` con los mismos datos — simplemente se le deja entrar.
- **Token caducado** (más de 30 días): devuelve `410`. Mandarlo a `https://abundacecode.com/activar-acceso`, donde pide uno nuevo.
- **Se autentica con un correo distinto al que pagó**: no tiene acceso. Explicárselo y ofrecerle entrar con el correo de la compra o recuperar su enlace.
- La hora de nacimiento debe poder quedar **vacía o aproximada** sin bloquear el registro.
- El lugar de nacimiento necesita **autocompletado de ciudades** (para resolver zona horaria y coordenadas; de eso depende la precisión de casas y ascendente).
- **Los que ya compraron una esfera**: mantener la entrada por código como vía secundaria ("Ya tengo mi esfera"), no como puerta principal. En la base de datos se distinguen por `source: 'legacy_sphere'`.

### 3.3 Contrato de los endpoints

Base: `https://TU-BACKEND` (el mismo servidor Express que ya sirve el blog del sitio).

Las dos primeras llamadas son **servidor a servidor**: llevan un secreto compartido que **nunca debe llegar al navegador**. Se manda como `Authorization: Bearer <APP_SHARED_SECRET>` (o cabecera `x-app-secret`).

---

**1. Canjear el token** — al aterrizar con `?token=`

```http
POST /api/access/redeem
Authorization: Bearer <APP_SHARED_SECRET>
Content-Type: application/json

{ "token": "el-token-de-la-url", "appUserId": "id-del-usuario-en-la-app" }
```

Respuesta `200`:

```json
{
  "email": "maria@gmail.com",
  "name": "María",
  "plan": "annual",
  "status": "active",
  "source": "stripe",
  "currentPeriodEnd": "2027-07-30T10:00:00.000Z",
  "hasAccess": true,
  "utmCampaign": "hero",
  "alreadyRedeemed": false
}
```

Otros códigos: `404` token inexistente · `410` caducado (incluye el `email` para poder ofrecer el reenvío) · `401` secreto incorrecto.

`appUserId` es opcional pero conviene mandarlo: deja la trazabilidad de qué cuenta de la app corresponde a qué pago.

---

**2. Consultar el estado** — al iniciar sesión, y periódicamente

```http
GET /api/access/status?email=maria@gmail.com
Authorization: Bearer <APP_SHARED_SECRET>
```

Respuesta `200`: el mismo objeto de arriba, sin `alreadyRedeemed`. Si no existe suscripción:

```json
{ "email": "maria@gmail.com", "hasAccess": false, "status": "none" }
```

Valores de `status`: `active` · `past_due` (impago, aún con acceso de gracia) · `canceled` · `incomplete` · `none`.
**Usar `hasAccess` como criterio, no `status`** — así, si mañana cambian las reglas, la app no se entera.

> **Importante:** la app debe **guardar el resultado en su propia base** y revalidarlo periódicamente (por ejemplo, una vez al día o al iniciar sesión), **no en cada carga de pantalla**. Si el backend de la web se cae, los usuarios ya validados tienen que poder seguir usando la app.

---

**3. Gestionar la suscripción** — el botón de "cancelar en dos clics"

```http
POST /api/stripe/portal
Content-Type: application/json

{ "email": "maria@gmail.com" }
```

Devuelve `{ "url": "https://billing.stripe.com/..." }`. La app sólo tiene que abrir esa URL: es el portal de cliente de Stripe, donde el usuario cancela, cambia de tarjeta y ve sus facturas. No hay que construir ninguna de esas pantallas.

---

### 3.4 Suscripción y pagos: qué NO tiene que hacer la app

- **No integrar Stripe.** El cobro, la renovación y la cancelación ya están resueltos en la web.
- **No guardar datos de tarjeta** ni ids de Stripe. La app sólo maneja `email`, `plan`, `status` y `hasAccess`.
- **No decidir precios.** Están en el backend de la web (`PRICE_INITIAL_CENTS`, `PRICE_MONTHLY_CENTS`, `INCLUDED_DAYS`).

**El modelo de precio, para que la app lo cuente igual que la web:**

| Momento | Importe | Qué significa |
|---|---|---|
| Hoy, al pagar | **US$49** | Cubre los primeros **30 días** de acceso completo |
| Día 31 en adelante | **US$14.99 / mes** | Mantiene activas las lecturas avanzadas, señales diarias, ciclos y nueva orientación personalizada |

En Stripe es **una sola suscripción** de $14.99/mes con 30 días de trial, más un cargo único de $49 cobrado al instante. Por eso, durante el primer mes la suscripción del usuario está en estado `trialing` — **pero eso NO significa que sea gratis**: esos 30 días ya están pagados con los $49. El endpoint `/api/access/status` ya lo traduce: durante ese periodo devuelve `status: "active"` y `hasAccess: true`.

Si la app muestra en algún sitio cuándo vence el acceso, use `currentPeriodEnd`: durante el primer mes es el día 31, que es cuando cae el primer cobro mensual.

### 3.5 Copy de la app

Hoy la app habla como el modelo viejo y hay que reescribirla entera:

| Dice hoy | Problema |
|---|---|
| "Activar mi esfera" (CTA principal) | Ya no hay esfera |
| "Tu código está vinculado a tu esfera" | Ya no hay código ni caja |
| "Ritual de activación de tres pasos: código → datos → lectura" | El primer paso desaparece |
| "30 días de activaciones diarias" | Suena a producto con caducidad; ahora es una suscripción continua |
| "No es una lectura puntual. Es un portal." | **Este sí sirve** — es exactamente el mensaje nuevo |

El tono de la web: directo, sin jerga astrológica, sin promesas de resultados. La idea central es *"tu carta natal no cambia; lo que cambia cada día es lo que el cielo activa en ella"*.

### 3.6 Identidad visual

La app y la web tienen que verse como el mismo producto. La web usa:

| Elemento | Valor |
|---|---|
| Fondo principal | `#F5F1ED` (marfil) |
| Fondo de secciones alternas | `#FFFDF7` |
| Beige de tarjetas | `#E8DCC8` |
| Acento champán | `#D4AF37` |
| Texto principal (moka) | `#3D2817` |
| Texto secundario | `#5B3E2A` |
| Tipografía | Montserrat (única fuente, pesos 300–700) |
| Botones | Píldora, fondo `#3D2817`, texto `#F5F1ED` |

La captura que aparece en la web (`/img/app-es.png` y `/img/app-en.png`) muestra el dashboard actual. **Si la interfaz cambia, hay que regenerar esas capturas** o la web estará enseñando algo que ya no existe.

### 3.7 Idiomas

La web es **bilingüe español / inglés** con selector manual. La app debería serlo también: hoy solo está en español y un usuario que navega la web en inglés aterriza en una app en español.

---

## 4. Lo que NO hay que hacer

- **No pedir dirección de envío** ni ningún dato logístico. No se envía nada.
- **No hablar de esfera, cristal, caja, QR, pulsera ni envío** en ninguna pantalla.
- **No prometer prueba gratis ni "sin tarjeta"** mientras no exista de verdad. La web tenía ese copy escrito y lo desactivé precisamente porque la app no lo cumple. Está listo para reactivarse el día que exista.
- **No bloquear funciones sueltas** para venderlas aparte. La web promete un solo plan con todo incluido.

---

## 5. Decisiones pendientes

1. **¿La renovación de $14.99 es automática o hay que aceptarla?** La web está montada como **renovación automática** (es lo que implica "para mantener activas las lecturas"). Si la intención del cliente es que sea opcional — que a los 30 días se le invite a suscribirse y no se le cobre si no hace nada — es otro montaje en Stripe y hay que decirlo, porque cambia el copy, los Términos y el aviso legal de renovación.
2. **¿Hay prueba gratis o no?** Hoy no: se paga y se entra. La web tiene todo el copy de la prueba escrito y desactivado con una constante, así que reactivarlo es cambiar `TRIAL_ENABLED` a `true`. Si se decide que sí, la app tendría que soportar cuentas en periodo de prueba.
3. **¿Se mantiene la entrada por código** para quienes ya compraron una esfera?
4. **Dominio.** La app está en `astro-ai-decoder.lovable.app`. Lo natural es moverla a un subdominio propio (`app.abundacecode.com`). En la web es cambiar una variable de entorno.

### Lo que hace falta para conectar las dos partes

- El equipo de la web genera el **`APP_SHARED_SECRET`** y os lo pasa por un canal seguro. Va en las variables de entorno del servidor de la app, **nunca en el código del navegador**.
- Hay que confirmar la **URL pública del backend** de la web, para que la app sepa a dónde llamar.
- La web necesita saber la **URL definitiva de la app** y su **ruta de entrada** (hoy `/activar`), porque es el `success_url` de Stripe. Si cambiáis la ruta, avisad: son dos variables de entorno.
- La web permite peticiones sólo desde su propio dominio (CORS). Las llamadas de la app son servidor a servidor, así que no les afecta — pero por eso mismo **no se pueden hacer desde el navegador**.

---

## 6. Resumen en una frase

> La web ya vende y cobra: el usuario paga en abundacecode.com y llega a la app con un token en la URL. La app no necesita cobrar nada — sólo canjear ese token contra el backend, vincular la cuenta al correo que pagó, y quitar de en medio el muro del código y todo el lenguaje de la esfera de cristal que ya no se vende.
