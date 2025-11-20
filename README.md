# Learn It, Love It

Pequeña aplicación web para **descubrir temas de estudio y compartir enlaces útiles**, donde cada tema y cada link puede recibir votos 👍/👎.

Está pensada como un proyecto **full‑stack sencillo** para practicar:

- Node.js + Express
- Plantillas EJS
- SQLite con `better-sqlite3`
- Un poco de JS en el navegador para votos en vivo y mejoras de UX

---

## Descripción general

**Learn It, Love It** permite:

- Crear **temas** (por ejemplo: “Aprender Node.js”, “Dominar el arte de preparar café”).
- Agregar **enlaces recomendados** dentro de cada tema.
- Votar temas y enlaces para que los recursos más útiles suban primero.
- Editar y eliminar temas y links directamente desde la interfaz.

Todo se guarda en un archivo **SQLite local (`app.db`)**, creado y configurado automáticamente al iniciar la app.

---

## Funcionalidades

### Temas

- Listado de todos los temas ordenados por:
  1. Número de votos (mayor a menor)
  2. ID (más reciente primero, en caso de empate)
- Crear nuevos temas mediante un formulario simple.
- Editar el título de un tema en línea.
- Eliminar temas (se eliminan también sus enlaces asociados).

### Enlaces dentro de cada tema

- Para cada tema se pueden añadir uno o más **links** con:
  - Título descriptivo
  - URL
- Editar título y URL de cada enlace.
- Eliminar enlaces individualmente.

### Votaciones

- Votos independientes para:
  - Temas
  - Enlaces
- Los votos se procesan vía `fetch` hacia rutas JSON:
  - `POST /topics/:id/vote?dir=up|down`
  - `POST /links/:id/vote?dir=up|down`
- Después de votar:
  - Se actualiza el contador en la UI.
  - Se reordena la lista según votos (en el cliente) para reflejar el nuevo ranking.
  - Se muestra un pequeño **“toast”** de confirmación.

### UX y detalles de interfaz

- Estilos modernos con una paleta clara/oscura basada en CSS custom properties.
- Layout minimalista tipo tablero:
  - Tarjetas para temas
  - Listas anidadas para enlaces
- Toast de notificación accesible (`role="status"`, `aria-live="polite"`).
- Confirmación al eliminar temas/enlaces.
- Limpieza básica de inputs (`trim`) antes de enviar formularios.
- Pequeñas protecciones para evitar:
  - Enviar formularios múltiples veces muy rápido.
  - Hacer spam de votos con muchos clics seguidos.

---

## Stack técnico

### Backend

- **Node.js** (ES Modules: `"type": "module"` en `package.json`)
- **Express 4**
- **EJS** como motor de vistas
- **better-sqlite3** como driver sincronizado para SQLite
- Estructura en capas:
  - `/db.js` – conexión a SQLite + creación de tablas + datos de seed
  - `/models/topic.js` – consultas SQL para `topics`
  - `/models/link.js` – consultas SQL para `links`
  - `/controllers/topicsController.js` – lógica de la app (CRUD + votos)
  - `/routes/index.js` – definición de rutas HTTP
  - `/app.js` – configuración principal de Express

### Frontend

- HTML renderizado en servidor con **EJS** (`views/index.ejs` + partials).
- CSS propio en `public/css/styles.css` (diseño responsive básico).
- JavaScript en `public/js/main.js`:
  - Manejo de votos con `fetch`.
  - Ordenamiento de listas por votos.
  - Notificaciones tipo toast.
  - Confirmaciones y pequeñas mejoras de accesibilidad.

### Base de datos

- **SQLite** en un archivo local `app.db`.
- Tablas:
  - `topics(id, title, votes, created_at)`
  - `links(id, topic_id, title, url, votes, created_at)`
- Seed inicial (solo si la tabla está vacía):
  - Crea algunos temas de ejemplo (por ej. “Cómo programar como un ninja”) y enlaces asociados.

---

## Estructura del proyecto

```text
-LearnIt-LoveIt-main/
├─ app.js                # Configuración de Express y arranque del servidor
├─ db.js                 # Conexión SQLite + creación de tablas + seed
├─ package.json          # Dependencias y scripts
├─ package-lock.json
├─ controllers/
│  └─ topicsController.js# Lógica de control: CRUD y votos
├─ models/
│  ├─ topic.js           # Modelo Topic (consultas sobre topics)
│  └─ link.js            # Modelo Link (consultas sobre links)
├─ routes/
│  └─ index.js           # Definición de rutas HTTP
├─ public/
│  ├─ css/
│  │  └─ styles.css      # Estilos globales
│  └─ js/
│     └─ main.js         # Lógica de UI (votos, toasts, etc.)
└─ views/
   ├─ index.ejs          # Página principal
   └─ partials/
      ├─ header.ejs      # Head + apertura de <body>
      └─ footer.ejs      # Cierre de <main> + scripts
```

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/alevarriola/LearnIt-LoveIt.git
cd LearnIt-LoveIt
```

> Si el nombre del directorio es distinto (por ejemplo `-LearnIt-LoveIt-main` al descargar como ZIP), ajustá el `cd` según corresponda.

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:

- `express`
- `ejs`
- `better-sqlite3`
- `nodemon` (como devDependency)

### 3. Ejecutar la app

#### Opción A — Desarrollo (con recarga mediante nodemon)

```bash
npm run dev
```

#### Opción B — Producción simple

```bash
npm start
```

Por defecto, la app escucha en:

- `http://localhost:3000`

La primera vez que se ejecuta:

- Se crea el archivo `app.db` en el directorio raíz.
- Se crean automáticamente las tablas `topics` y `links`.
- Si la tabla `topics` está vacía, se insertan algunos datos de ejemplo.

---

## Uso básico

1. Abrí tu navegador en `http://localhost:3000`.
2. En la parte superior, creá un **nuevo tema** (por ejemplo: “Aprender JavaScript desde cero”).
3. Dentro de cada tema, desplegá la sección **“Enlaces”** y:
   - Agregá links con título + URL.
   - Editá o eliminá los links según sea necesario.
4. Usá los botones de **voto**:
   - Para temas.
   - Para enlaces.
5. Observá cómo:
   - Los contadores de ★ se actualizan en vivo.
   - Los temas y enlaces se reordenan por popularidad.

Este flujo lo hace ideal como demo en clase o como mini‑herramienta personal para curar contenido de estudio.

---

## Rutas principales (resumen)

### Vistas

- `GET /`
  - Renderiza la página principal con todos los temas y sus enlaces.

### CRUD de temas

- `POST /topics`
  - Crea un tema nuevo.
- `POST /topics/:id/edit`
  - Actualiza el título de un tema.
- `POST /topics/:id/delete`
  - Elimina un tema y sus enlaces.

### CRUD de enlaces

- `POST /links`
  - Crea un enlace asociado a un tema.
- `POST /links/:id/edit`
  - Actualiza título y URL de un enlace.
- `POST /links/:id/delete`
  - Elimina un enlace.

### Votaciones (JSON)

- `POST /topics/:id/vote?dir=up|down`
  - Incrementa o decrementa los votos de un tema.
  - Respuesta JSON: `{ ok: true, topic: { ... } }`
- `POST /links/:id/vote?dir=up|down`
  - Incrementa o decrementa los votos de un enlace.
  - Respuesta JSON: `{ ok: true, link: { ... } }`

---

## Autor

**Alejandro Arriola**  
Programador en constante formacion.

- GitHub: [@alevarriola](https://github.com/alevarriola)

