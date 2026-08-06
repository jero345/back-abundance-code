# Brief de imágenes — Abundance Code

Contexto para generar imágenes (IA o fotografía) coherentes con la web y saber dónde colocarlas.
Fecha: 3 de agosto de 2026 · Complementa a `BRIEF-APP-LOVABLE.md`.

---

## 1. Qué se vende (lo primero que hay que entender)

Abundance Code **ya no vende un objeto físico**. Fue un ecommerce de una esfera de cristal ($177–$217); ese modelo se abandonó.

**Hoy el producto es una web app** que calcula la carta natal del usuario y la traduce en guía diaria. Se paga en `abundacecode.com/pricing` (US$49 los primeros 30 días → US$14.99/mes) y se entra a la app con un token en la URL.

La promesa central: *"tu carta natal no cambia; lo que cambia cada día es lo que el cielo activa en ella"*.

Tono: **directo, sin jerga astrológica, sin promesas de resultados**. La web habla de patrones, decisiones y claridad — no de magia.

### Prohibido que aparezca en cualquier imagen

- Esferas de cristal, bolas de vidrio, cajas de producto, pulseras, códigos QR, cajas abiertas con packaging
- Cartas de tarot, manos leyendo, velas, humo de incienso, runas
- Morados/violetas neón, galaxias saturadas, estrellas brillantes tipo "mística"
- Texto renderizado dentro de la imagen (los modelos lo escriben mal y además la web es bilingüe)
- Símbolos zodiacales literales y obvios (carneros, escorpiones, etc.)

**Por qué importa:** el diferenciador de esta marca frente a las apps de astrología es que **no parece una app de astrología**. Parece editorial de lujo. Si las imágenes caen en el cliché místico, se pierde justo lo que la separa de la competencia.

---

## 2. Identidad visual (obligatoria en todas las imágenes)

| Elemento | Valor |
|---|---|
| Fondo principal | `#F5F1ED` marfil |
| Fondo de secciones alternas | `#FFFDF7` |
| Beige de tarjetas | `#E8DCC8` |
| Acento champán / oro | `#D4AF37` |
| Texto principal (moka) | `#3D2817` |
| Texto secundario | `#5B3E2A` |
| Tipografía | Montserrat, pesos 300–700, única fuente |
| Botones | Píldora, fondo moka `#3D2817`, texto marfil |
| Bordes | `rounded-2xl` (16px), borde `1px #E8DCC8` |

**Dirección de arte en una frase:** bodegón editorial de revista de lujo — luz natural suave y lateral, fondo marfil, materiales nobles (piedra caliza, latón mate, lino, papel grueso, cerámica sin esmaltar), un único acento dorado apagado, mucho aire negativo, sombras largas y suaves, grano fino de película, acabado mate (nada de brillos ni HDR).

**Coletilla técnica para pegar al final de cada prompt:**

```
soft natural side light, ivory #F5F1ED background, warm beige and mocha brown tones,
muted champagne gold accent #D4AF37, matte finish, fine film grain, generous negative space,
editorial luxury still-life photography, shallow depth of field, no text, no logos, no people,
no purple, no neon, no glow, no crystal ball
```

---

## 3. Estado actual (por qué se ve plano)

| Zona | Qué hay ahora |
|---|---|
| Home hero | Captura real de la app ✅ |
| Home §2 Identificación | 4 tarjetas beige + iconos SVG champán ✅ (funciona bien) |
| Home §3 Qué descubres | 3 tarjetas con **emoji** 🔒 💎 ✨ ❌ |
| Home §5 Dentro de la app | **La misma captura del hero, repetida** ❌ |
| Home §5 Lista de módulos | 6 **emoji** 🌐 🔮 🌙 💡 🌟 🎴 ❌ |
| Home §6 Qué desbloquea | Mockups hechos con divs ✅ (se ven bien) |
| Testimonios | Avatares monograma con degradado ⚠️ |
| About, HowItWorks, FAQ, Pricing | **Cero imágenes** ❌ |
| Compartir en redes | **No hay `og:image`** ❌ |

Total de imágenes reales en producción: **1**.

---

## 4. Slots concretos, por prioridad

Todas las imágenes van en `frontend/public/img/`. Formato **WebP** (calidad 82) salvo el OG, que debe ser PNG o JPG.

### P1 — Máximo impacto

**1.1 · `og-image.png` — 1200×630**
No existe. Es la imagen que aparece **cada vez que alguien comparte el enlace** por WhatsApp, Instagram o Facebook. Hoy sale un recuadro vacío. Es el slot con mejor relación esfuerzo/retorno de toda la lista.

> Composición: fondo marfil, la captura de la app inclinada ligeramente a la derecha con sombra suave, wordmark "ABUNDANCE CODE" a la izquierda (se compone en código o en el editor, **no** lo escriba el modelo), filete champán fino. Deja el tercio izquierdo libre para el texto.

Se enlaza en `frontend/index.html` con `<meta property="og:image">` + `twitter:card`.

---

**1.2 · Tres imágenes para la sección "Qué puedes descubrir"** — 900×675 (4:3)
Sustituyen a los emoji 🔒 💎 ✨ en [Home.jsx:343-345](frontend/src/pages/Home.jsx#L343-L345).

| Archivo | Concepto | Prompt |
|---|---|---|
| `discover-blocks.webp` | Bloqueos invisibles | `A single smooth limestone stone resting on ivory linen, one hairline crack running through it filled with thin muted gold (kintsugi), overhead soft window light` + coletilla |
| `discover-clarity.webp` | Decisiones con claridad | `Two thin brushed-brass paths diverging on a cream plaster surface, one catching soft light, minimal geometric composition, long soft shadow` + coletilla |
| `discover-expansion.webp` | Ruta de expansión | `Concentric rings of fine gold thread expanding outward on raw ivory paper, hand-drawn imperfect circles, macro detail, subtle paper texture` + coletilla |

---

**1.3 · `app-mobile-es.webp` / `app-mobile-en.webp`** — 800×1600
La sección 5 "Dentro de la app" ([Home.jsx:476](frontend/src/pages/Home.jsx#L476)) repite la **misma** captura del hero. Repetir la única imagen del sitio a media página es lo que más lo abarata.

Esto **no es una imagen de IA**: es una captura real de la app en móvil (vista "Guía Personal diaria" o "Tu Patrón Central"), montada dentro de un marco de teléfono. Debe ser una pantalla *distinta* a la del hero, para que el visitante sienta que está viendo más producto.

⚠️ El brief de la app dice que la interfaz va a cambiar. **Regenera estas capturas después del rediseño**, o la web estará enseñando algo que ya no existe.

---

### P2 — Consistencia y páginas vacías

**2.1 · Seis iconos SVG para los módulos** — reemplazan 🌐 🔮 🌙 💡 🌟 🎴 en [Home.jsx:499-504](frontend/src/pages/Home.jsx#L499-L504).

**No uses IA aquí.** La Home ya tiene 10 iconos SVG de línea, trazo 1.5, color `#D4AF37` (`IconChart`, `IconDaily`, `IconLock`…). Los emoji rompen esa consistencia y además se dibujan distinto en Android, iPhone y Windows. Hacen falta 6 más en el mismo estilo: carta natal, patrón, ciclos, áreas clave, guía diaria, historial. Es trabajo de código, no de generación.

**2.2 · `about-editorial.webp`** — 1200×800, para [About.jsx](frontend/src/pages/About.jsx)
Página larga y sin una sola imagen.

> `Overhead flat lay on ivory linen: a folded sheet of thick cream paper with faint hand-drawn concentric circles, a slim brass ruler, dried pale eucalyptus sprig, soft morning window light from the left` + coletilla

*(Nota aparte: About.jsx usa `font-serif`, pero la marca es Montserrat única fuente. Conviene unificarlo.)*

**2.3 · Textura de fondo para el CTA final y `/pricing`** — 1920×600, muy sutil
Bandas que hoy son color plano `#E8DCC8`.

> `Extremely subtle abstract texture: raw ivory plaster wall with faint horizontal brush marks and a single hairline gold line, almost flat, very low contrast, seamless` + coletilla

Debe quedar tan tenue que el texto encima siga siendo perfectamente legible: úsala con `opacity: 0.35` o menos.

**2.4 · Portadas de blog** — 1200×630 cada una
Mismo lenguaje de bodegón; una por artículo, para que el listado no sea una lista de texto.

---

### P3 — Con criterio

**3.1 · Fotos de testimonio** — ⚠️ leer antes de generar

`Testimonials.jsx:18` deja preparado el hueco para fotos. Pero si las tres personas (V, C, L) no son clientes reales que hayan dado permiso, **poner retratos generados por IA convierte los testimonios en testimonios fabricados con cara**: eso es publicidad engañosa en la UE y en EE. UU. (FTC), y es exactamente el tipo de cosa que hunde la confianza si alguien hace una búsqueda inversa de la foto.

Opciones sanas:
- **Recomendada:** dejar los monogramas con degradado que ya están — se ven bien y son honestos.
- Fotos reales de clientes reales, con permiso por escrito.
- Retratos ilustrativos **claramente etiquetados** como tales.

**3.2 · Glow del hero** — hazlo con CSS, no con una imagen. Un `radial-gradient` champán al 8% detrás de la captura da el mismo resultado con 0 KB.

---

## 5. Limpieza pendiente

Estas imágenes son del ecommerce abandonado y **ya no las usa ningún componente**. Ocupan sitio en el build y en el deploy a Hostinger:

```
sphere.png · sphere-transparent.png · sphere.svg · box.png
crystal-sphere.mp4 · sphere-rotating.mp4
abundance-collection.png · poder-en-tus-manos.png
elegancia-diurna.png · vision-nocturna.png
design-ref-1.png · design-ref-2.png · logo-ref.png
abundance_code_product_page.html
```

Los `.mp4` son los que más pesan. Conviene moverlos a una carpeta `_archivo/` fuera de `public/` antes de borrarlos, por si acaso.

---

## 6. Reglas técnicas al colocarlas

- **WebP** calidad 82. Un bodegón de 900×675 debe pesar < 120 KB.
- `loading="lazy"` y `decoding="async"` en todo lo que esté por debajo del hero.
- `width` y `height` explícitos siempre, para que no salte el layout al cargar (CLS).
- `alt` descriptivo y **bilingüe**: sale del diccionario `i18n`, no escrito a mano en el JSX.
- Solo el hero lleva `preload` (ya lo tiene `app-es.png` en `index.html`).
- Esquinas `rounded-2xl` + `border: 1px solid #E8DCC8` para que las fotos hereden el lenguaje de las tarjetas.
