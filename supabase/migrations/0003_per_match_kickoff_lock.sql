-- Per-match locking: a prediction becomes non-editable once its OWN kickoff
-- time has passed, in addition to the existing round-level open/deadline check.
-- This lets an already-played match in an otherwise-open round be closed while
-- the rest of the round stays editable until each match's kickoff (capped by
-- the round deadline).
--
-- Only the WITH CHECK of predictions_insert and predictions_update changes.
-- predictions_update USING and predictions_select are left untouched.

alter policy predictions_insert on public.predictions
  with check (
    (user_id = current_profile_id())
    and exists (
      select 1 from public.matches m
      join public.rounds r on r.id = m.round_id
      where m.id = predictions.match_id
        and r.is_open = true
        and now() < r.locks_at
        and (m.kickoff_at is null or now() < m.kickoff_at)
    )
  );

alter policy predictions_update on public.predictions
  with check (
    (user_id = current_profile_id())
    and exists (
      select 1 from public.matches m
      join public.rounds r on r.id = m.round_id
      where m.id = predictions.match_id
        and r.is_open = true
        and now() < r.locks_at
        and (m.kickoff_at is null or now() < m.kickoff_at)
    )
  );
