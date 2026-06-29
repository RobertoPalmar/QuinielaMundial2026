import { NextRequest, NextResponse } from "next/server";
import { syncMatches } from "@/lib/sync-matches";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Endpoint que llama el Vercel Cron. Hace poll a API-Football y upsert de
// marcadores/estado en `matches`. NUNCA modifica is_approved/approved_at:
// la aprobacion del resultado oficial la hace el admin.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncMatches();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "sync failed" },
      { status: 502 }
    );
  }
}
