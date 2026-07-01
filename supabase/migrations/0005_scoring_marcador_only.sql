-- El punto de "ganador" se otorga por el SENTIDO del marcador (1X2),
-- nunca por matches.winner. Así los penales no suman: un empate por
-- marcador que se define en penales solo puntúa a quien predijo empate.
create or replace view public.v_user_scores as
select
  p.id                       as user_id,
  p.username,
  p.group_stage_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then r.exact_points
      when sign(pr.pred_home - pr.pred_away) = sign(m.home_score - m.away_score) then r.winner_points
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
      when sign(pr.pred_home - pr.pred_away) = sign(m.home_score - m.away_score) then r.winner_points
      else 0
    end
  ), 0)                      as total_points,
  coalesce(sum(
    case
      when pr.pred_home = m.home_score and pr.pred_away = m.away_score then 1
      when sign(pr.pred_home - pr.pred_away) = sign(m.home_score - m.away_score) then 1
      else 0
    end
  ), 0)                      as hits
from public.profiles p
left join public.predictions pr on pr.user_id = p.id
left join public.matches m on m.id = pr.match_id and m.is_approved = true
left join public.rounds r on r.id = m.round_id
group by p.id, p.username, p.group_stage_points;
