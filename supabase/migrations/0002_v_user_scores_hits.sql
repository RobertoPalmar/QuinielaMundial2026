-- =====================================================================
-- v_user_scores: agrega columna `hits` (partidos acertados)
-- "Acertados" = partidos donde se acertó el RESULTADO (ganador correcto,
-- o empate correcto). INCLUYE los marcadores exactos (hits >= exact_hits).
-- Postgres exige conservar nombre/orden/tipo de columnas existentes y
-- APENDER las nuevas al final -> `hits` va como última columna.
-- =====================================================================
create or replace view public.v_user_scores as
select
  p.id                       as user_id,
  p.username,
  p.group_stage_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then r.exact_points
      when m.winner is null and m.home_score = m.away_score and pr.pred_home = pr.pred_away then r.winner_points
      when pr.pred_winner = m.winner then r.winner_points
      else 0
    end
  ), 0)                      as knockout_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then 1
      else 0
    end
  ), 0)                      as exact_hits,
  p.group_stage_points + coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then r.exact_points
      when m.winner is null and m.home_score = m.away_score and pr.pred_home = pr.pred_away then r.winner_points
      when pr.pred_winner = m.winner then r.winner_points
      else 0
    end
  ), 0)                      as total_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then 1
      when m.winner is null and m.home_score = m.away_score and pr.pred_home = pr.pred_away then 1
      when pr.pred_winner = m.winner then 1
      else 0
    end
  ), 0)                      as hits
from public.profiles p
left join public.predictions pr on pr.user_id = p.id
left join public.matches m on m.id = pr.match_id and m.is_approved = true
left join public.rounds r on r.id = m.round_id
group by p.id, p.username, p.group_stage_points;
