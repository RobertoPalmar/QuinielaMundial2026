# Design Brief — Quiniela Mundial FIFA 2026

> Brief para rediseñar la UI. Pégalo en Claude / herramienta de diseño y pide
> mockups modernos por pantalla. La app ya funciona; esto es solo el rediseño visual.

## 1. Producto

Tablero web para gestionar una **quiniela (polla) del Mundial FIFA 2026**, fase
eliminatoria. Los participantes cargan pronósticos ronda por ronda, ganan puntos
y compiten en un ranking en vivo. Hay un panel de administrador.

- **Stack visual**: Next.js (App Router) + Tailwind CSS v4. Componentes React.
- **Público**: amigos/colegas, uso casual, mayoría en **móvil**. Mobile-first.
- **Idioma**: español.

## 2. Dirección visual deseada

- Moderno, deportivo, energético — vibra "Mundial 2026" (sedes USA/México/Canadá).
- **Dark mode** como base (ya es dark). Aceptable proponer light opcional.
- Limpio, mucho aire, tipografía fuerte para números/marcadores.
- Acentos vibrantes (verde césped + dorado trofeo funcionan, pero el diseñador
  puede proponer paleta). Evitar saturar.
- Micro-detalles: badges de estado, medallas en ranking, banderas de países.
- Accesible: contraste AA, áreas táctiles ≥44px.

### Tokens actuales (referencia, se pueden cambiar)
```
bg        #0a0f1c   surface   #111a2e   surface-2 #18233d
border    #243049   primary   #10b981   primary-dk #059669
accent    #f59e0b   text      #e8eefc   muted     #93a1c0
```
Fuente actual: Geist. Libre de proponer otra (sporty/geométrica).

## 3. Layout global

- **Navbar** (sticky top): logo "⚽ Quiniela Mundial 2026" + links: Ranking,
  Mi Pronóstico, Reglas, [Admin si es admin]. Estado sesión: nombre usuario +
  botón Salir, o botón Ingresar.
- **Footer** simple.
- Contenedor centrado máx ~1024px. Responsive: navbar colapsa en móvil.

## 4. Pantallas (con datos y estados)

### 4.1 Landing / Home
- Hero: título grande, subtítulo, CTAs (Cargar pronóstico / Ver ranking / Reglas).
- 3 tarjetas destacando el scoring: **3 pts marcador exacto**, **1 pt equipo que
  avanza**, **cierre por ronda**.

### 4.2 Login
- Card centrada: email, contraseña, botón Ingresar, link a Registro.
- Estados: error ("Email o contraseña incorrectos"), loading.

### 4.3 Registro
- Card: usuario, email, contraseña, botón Crear cuenta, link a Login.
- Estado éxito: mensaje "revisa tu email para confirmar".
- Estados: error de validación, loading.

### 4.4 Reglas
- Explica scoring (3 exacto / 1 ganador), fases del torneo (6 rondas),
  reglas de cierre. Secciones tipo tarjetas. Contenido informativo, escaneable.

### 4.5 Mi Pronóstico (PANTALLA CLAVE)
Lista de partidos de la ronda abierta. Cada partido = una **match card**:
- Equipo local — [input marcador] vs [input marcador] — equipo visitante.
- Selector "¿Quién avanza?" (los 2 equipos).
- Banderas/nombres de países.
- Header de la ronda: nombre ("Dieciseisavos de final") + fecha de cierre +
  badge estado (🟢 Abierta / 🔒 Cerrada).
- Botón "Guardar pronósticos".

**Estados a diseñar:**
- **Abierta**: inputs editables, guardar.
- **Cerrada/locked**: solo lectura, muestra lo que pronosticó (marcador + quién
  avanza), banner "ronda cerrada".
- **Sin ronda abierta**: empty state.
- **Partidos aún no cargados**: empty state.
- Mensajes de éxito/error al guardar.

Datos reales de ejemplo (16avos): "South Africa 0 - 1 Canada", "Argentina vs ...",
etc. (48 equipos, marcadores tipo fútbol 0–4).

### 4.6 Ranking (PANTALLA CLAVE)
Tabla/lista ordenada por puntos totales. Columnas:
- Posición (🥇🥈🥉 para top 3), Participante, Pts Grupos, Pts Eliminatorias,
  Aciertos exactos, **Total** (destacado).
- Badge "🟢 En vivo".
- Responsive: en móvil convertir tabla en tarjetas apiladas.
- Empty state: "aún no hay participantes".
- Ejemplo filas: juan 14 / maria 11 / pedro 9.

### 4.7 Admin — Dashboard
- 2 stats: total participantes, partidos sin aprobar.
- 3 accesos: Resultados, Rondas, Importar grupos.

### 4.8 Admin — Resultados
- Partidos agrupados por ronda. Cada uno: marcador (viene auto de la API,
  editable), selector de quién avanza, badge estado API (FINISHED/TIMED/etc) +
  "última sync", badge ✅ Aprobado / ⏳ Pendiente.
- Acciones: "Aprobar resultado" (dispara puntos), "revertir aprobación".
- Botón global "🔄 Sincronizar con API".

### 4.9 Admin — Rondas
- Lista de 6 rondas. Cada una editable: toggle Abierta, fecha/hora de cierre
  (deadline), pts exacto, pts ganador. Botón Guardar por ronda.

### 4.10 Admin — Importar grupos
- Textarea para pegar "usuario,puntos" (desde Excel). Botón Importar + resultado
  ("Actualizados: N").

## 5. Inventario de componentes a diseñar
- Botones: primary (gradiente), ghost.
- Inputs: text, number (marcador), select, textarea, checkbox/toggle, datetime.
- Card genérica.
- **Match card** (predicción) — abierta y locked.
- **Ranking row / ranking card** (móvil).
- **Round editor card** (admin).
- **Result card** (admin) con badges de estado.
- Badges/pills de estado (abierta, cerrada, aprobado, pendiente, en vivo).
- Navbar + footer.
- Empty states y banners (info / éxito / error).
- Medallas top-3.

## 6. Entregable esperado del diseñador
- Mockups responsive (móvil + desktop) de las 10 pantallas / estados clave.
- Paleta + tipografía + tokens.
- Specs de los componentes reutilizables (sección 5).
- Idealmente como clases Tailwind / estructura HTML para integrar fácil en los
  componentes React existentes (`app/**`, `components/**`).

## 7. Notas de implementación (para integrar después)
- No cambiar la lógica ni los nombres de campos de formulario (`m_<id>_home`,
  `m_<id>_away`, `m_<id>_winner`, etc.) ni los server actions.
- Los estilos viven en `app/globals.css` (utilidades `.card .btn .input .badge`)
  + clases Tailwind inline. Mantener esa estructura facilita el reemplazo.
