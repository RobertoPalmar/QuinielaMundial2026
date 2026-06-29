# Quiniela Mundial FIFA 2026 ⚽

Tablero para gestionar una quiniela del Mundial 2026 (fase eliminatoria).
Next.js + Supabase + Resend + API-Football, desplegable en Vercel.

## Secciones

- **Login / Registro** — Supabase Auth con confirmación por email (SMTP Resend).
- **Reglas** — sistema de puntos (3 exacto / 1 ganador) y dinámica de rondas.
- **Mi Pronóstico** — carga de predicciones de la ronda abierta; se bloquea al
  deadline (kickoff del primer partido de la ronda).
- **Ranking** — puntaje en vivo = grupos + eliminatorias (solo partidos
  aprobados por el admin).
- **Admin** (`role = 'admin'`) — aprobar resultados, abrir/cerrar rondas,
  importar puntos de grupos.

## Stack y flujo de datos

- **API-Football** trae fixtures y marcadores en vivo. Un **cron de Vercel**
  (`/api/cron/sync-matches`, cada 10 min) hace upsert en `matches` SIN tocar la
  aprobación. El admin **confirma el resultado oficial** → recalcula el ranking.
- **Scoring**: vista `v_user_scores`. Marcador exacto = 3 pts; solo equipo que
  avanza = 1 pt. Solo cuentan partidos con `is_approved = true`.

## Setup local

1. Variables de entorno: copia `.env.example` a `.env.local` y complétalo.
   (En este repo ya existe `.env.local` con las credenciales del proyecto.)
2. Instala y corre:
   ```bash
   npm install
   npm run dev
   ```
3. Aplica la migración a Supabase (ya aplicada vía Management API):
   `supabase/migrations/0001_init.sql`.

## Hacerte administrador

Tras registrarte, marca tu usuario como admin en Supabase (SQL Editor):

```sql
update public.profiles set role = 'admin' where username = '<tu-usuario>';
```

## Pendientes / configuración externa

- **API-Football**: pega tu key en `API_FOOTBALL_KEY`. Verifica que la liga
  World Cup (id 1, season 2026) esté disponible en tu plan; ajusta el mapeo de
  rondas en `lib/api-football.ts` (`ROUND_NAME_TO_SLUG`) si los nombres difieren.
- **Resend / emails**: el SMTP está configurado con sender `onboarding@resend.dev`.
  ⚠️ Sin un **dominio verificado** en Resend, solo se entregan correos a tu
  propio email. Para escribir a todos los participantes: verifica un dominio en
  Resend y cambia `smtp_admin_email` (Supabase → Auth → SMTP) a `noreply@tudominio`.
- **locks_at de 16avos**: ajusta el deadline real en Admin → Rondas (o en el seed).

## Deploy en Vercel

1. Sube el repo a GitHub y conéctalo a Vercel.
2. Carga las env vars (incluye `API_FOOTBALL_KEY` y `CRON_SECRET`).
3. Cambia `NEXT_PUBLIC_SITE_URL` y el `site_url`/allow-list de Supabase Auth a
   la URL de producción.
4. El cron de `vercel.json` corre automáticamente. (En plan Hobby la frecuencia
   de crons es limitada; usa el botón "Sincronizar" del admin si hace falta.)
