# Ruta Legal

**Recoge tu caso y lo ordena para un abogado de extranjería.**

Ruta Legal es una aplicación web estática, gratuita y privada, pensada para personas inmigrantes en España. Hace preguntas sobre el titular y su familia, guarda los hechos y genera un **informe de caso** en PDF/JSON para que lo revise un abogado o una entidad especializada.

> **No es asesoramiento jurídico, no tramita solicitudes y no emite un veredicto.** No elige una vía por ti ni promete una concesión. La valoración jurídica corresponde a un profesional.

- **GitHub:** [MarkCastelli/inmigracion-espana](https://github.com/MarkCastelli/inmigracion-espana)
- **Versión:** 1.0.0
- **Idioma:** español
- **Interfaz:** español, árabe (RTL), francés, inglés y rumano
- **Contenido legal:** español; la prosa larga se deja a la traducción del navegador y los formularios/avisos críticos se traducen aparte
- **Contenido:** revisado el 21/11/2026
- **Pruebas:** 174 pasando

---

## Qué hace

- Preguntas guiadas sobre identidad, entrada, residencia, asilo, familia, trabajo, estudios, salud, documentos y citas.
- Fichas separadas para pareja, cada hijo y otras personas que conviven.
- Preguntas específicas de asilo en una sola página.
- Datos para el abogado: contacto, urgencia, solicitudes anteriores, denegaciones y dudas.
- Informe de hechos con fechas, familia, documentos y datos que faltan.
- Descarga del informe en PDF y copia JSON.
- Catálogo de vías agrupado por residencia, visado, nacionalidad y protección.
- Guías de trámites, formularios, preguntas frecuentes, derechos, ayudas y directorio.
- Funciona sin servidor y sin registro.

## Qué no hace

- No decide qué vía te corresponde.
- No calcula probabilidades de concesión.
- No sustituye a un abogado.
- No presenta solicitudes ni paga tasas.
- No garantiza que la normativa esté actualizada.
- No envía tus datos a ningún servidor.

---

## Uso rápido

### Abrir directamente

Descarga el repositorio y abre `index.html` en el navegador.

### Versión de un solo archivo

Abre `dist/ruta-legal.html`. Incluye la aplicación completa y funciona sin conexión.

### Servidor local opcional

```bash
python serve.py
```

También puedes usar:

```bash
python -m http.server 8000
```

Y abrir `http://localhost:8000`.

---

## Flujo de uso

1. **Titular:** nacionalidad, edad, ubicación, entrada y tiempo en España.
2. **Familia:** composición, pareja, hijos y otras personas.
3. **Ficha familiar:** situación legal, necesidad, estudios y discapacidad de cada uno.
4. **Asilo:** solo si corresponde, con todas las preguntas en una página.
5. **Objetivo:** qué se espera obtener.
6. **Situación y documentos:** residencia, renovación, citas y trámites.
7. **Datos para el abogado:** contacto, urgencia, antecedentes de solicitudes y dudas.
8. **Informe:** hechos, familia, documentos y preguntas. Sin veredicto.

Los datos se guardan automáticamente en `localStorage` y se pueden descargar como JSON.

---

## Privacidad

- Todo se ejecuta en el navegador.
- No hay cuentas, servidor ni base de datos remota.
- Las respuestas se guardan solo en el dispositivo.
- La copia JSON y el PDF se generan localmente.
- La consulta a una IA solo se envía si tú pulsas el botón correspondiente.

No introduzcas datos que no quieras guardar en el navegador. Si usas un ordenador compartido, borra los datos al terminar.

---

## Estructura

```text
.
├── index.html                 # Aplicación principal
├── dist/ruta-legal.html       # Versión de un solo archivo
├── assets/
│   ├── css/app.css
│   ├── img/
│   └── js/
│       ├── core.js            # Estado, almacenamiento, utilidades
│       ├── engine.js          # Derivación de hechos y cálculos
│       ├── decision.js        # Lógica interna de evaluación
│       ├── forms.js           # Formularios oficiales
│       ├── ai.js              # Generación de prompt para IA
│       ├── pdf.js             # PDF e informe de caso
│       ├── speech.js          # Lectura por voz
│       ├── i18n.js            # Selector de idioma de la interfaz
│       ├── app.js             # Interfaz y navegación
│       └── data/              # Preguntas, vías, trámites, FAQ, ayudas…
├── docs/
│   ├── FUENTES.md             # Fuentes y criterios
│   ├── GASTOS.md              # Protocolo antes de pagar documentos
│   ├── MANTENIMIENTO.md       # Guía técnica
│   └── CONTINUIDAD-2026-11-21.md
├── tests/                     # Pruebas Node y comprobaciones Python
├── build.py                   # Genera dist/ruta-legal.html
├── serve.py                   # Servidor local
├── LICENSE                    # Todos los derechos reservados
└── README.md
```

---

## Desarrollo

Requisitos:

- Un navegador moderno.
- Python 3 para el servidor local y los scripts de comprobación.
- Node.js 18 o superior para las pruebas.

Comprobar la aplicación:

```bash
node tests/engine.test.js
node tests/familia.test.js
node tests/decision.test.js
node tests/timing.test.js
node tests/pdf.test.js
node tests/ui.smoke.js
python tests/check_html.py
```

Generar la versión de un solo archivo:

```bash
python build.py
python tests/check_dist.py
```

Auditar enlaces:

```bash
python tests/check_links.py --all
```

---

## Publicar en GitHub Pages

1. Sube el repositorio.
2. En GitHub: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main` o `master`.
5. Folder: `/ (root)`.
6. Guarda y espera la URL de Pages.

La aplicación no necesita backend. El archivo `.nojekyll` evita que GitHub Pages ignore carpetas que empiezan por `_`.

---

## Limitaciones y aviso legal

Ruta Legal es una herramienta de **orientación y organización de información**. No es un despacho de abogados, no tramita solicitudes y no garantiza la exactitud de la normativa ni la concesión de ninguna autorización.

La normativa cambia y cada expediente tiene matices. Antes de presentar nada, confirma en la fuente oficial y consulta con un abogado de extranjería o una entidad social.

Los documentos de ejemplo y las fuentes están en `docs/`. Las guías y el catálogo son información general: no constituyen un diagnóstico personalizado.

---

## Licencia

**© 2026 MarkCastelli. Todos los derechos reservados.**

No se concede permiso para copiar, modificar, distribuir, publicar, sublicenciar ni reutilizar el código, el diseño o los textos de este repositorio sin autorización escrita.

El repositorio puede ser público para consulta, pero eso **no** lo convierte en software libre ni concede una licencia de reutilización. Consulta [LICENSE](LICENSE).
