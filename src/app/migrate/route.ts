import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { Client } from "pg";
import { MIGRATIONS } from "@/lib/migrations/embedded";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function page(status: number, title: string, body: string) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} · Bandirector</title>
<style>
  body{background:#0d0d11;color:#c9c9d4;font:15px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;
       display:grid;place-items:center;min-height:100dvh;margin:0;padding:24px;box-sizing:border-box}
  main{max-width:560px;width:100%;border:1px solid #1c1c24;border-radius:16px;padding:28px;background:#131318}
  h1{font-size:18px;margin:0 0 12px;color:#fff}
  code{background:#1c1c24;border-radius:6px;padding:1px 6px;color:#f5a524}
  ul{padding-left:18px}li{margin:6px 0}
  .ok{color:#58c98b}.err{color:#f0655a}
</style></head><body><main><h1>${title}</h1>${body}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

const SETUP_HELP = `
<p>This endpoint applies the app's pending database migrations. To enable it,
add two environment variables to the deployment (then redeploy):</p>
<ul>
  <li><code>SUPABASE_DB_URL</code> — the Postgres connection string from
      Supabase → Project Settings → Database. On serverless hosts use the
      <em>Transaction pooler</em> URI (port 6543).</li>
  <li><code>MIGRATE_TOKEN</code> — any long random string you choose.</li>
</ul>
<p>Then visit <code>/migrate?token=&lt;your MIGRATE_TOKEN&gt;</code>.</p>`;

export async function GET(req: NextRequest) {
  const dbUrl = process.env.SUPABASE_DB_URL;
  const token = process.env.MIGRATE_TOKEN;
  if (!dbUrl || !token) {
    return page(503, "Migrations not configured", SETUP_HELP);
  }

  const given = req.nextUrl.searchParams.get("token") ?? "";
  if (!safeEqual(given, token)) {
    return page(
      403,
      "Forbidden",
      `<p class="err">Missing or wrong token. Visit
       <code>/migrate?token=&lt;your MIGRATE_TOKEN&gt;</code>.</p>`,
    );
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
  } catch (e) {
    return page(
      502,
      "Could not reach the database",
      `<p class="err">${escapeHtml(String(e))}</p>
       <p>Check <code>SUPABASE_DB_URL</code>. On serverless hosts the
       <em>Transaction pooler</em> connection string (port 6543) is usually
       required.</p>`,
    );
  }

  try {
    await client.query(
      `create table if not exists public.schema_migrations (
         id text primary key,
         applied_at timestamptz not null default now()
       )`,
    );
    const { rows } = await client.query<{ id: string }>(
      "select id from public.schema_migrations",
    );
    const done = new Set(rows.map((r) => r.id));

    const ran: string[] = [];
    for (const m of MIGRATIONS) {
      if (done.has(m.id)) continue;
      await client.query("begin");
      try {
        await client.query(m.sql);
        await client.query(
          "insert into public.schema_migrations (id) values ($1)",
          [m.id],
        );
        await client.query("commit");
        ran.push(m.id);
      } catch (e) {
        await client.query("rollback");
        return page(
          500,
          "Migration failed",
          `<p><span class="err">${escapeHtml(m.id)}</span> failed and was
           rolled back:</p><p class="err">${escapeHtml(String(e))}</p>
           ${ran.length ? `<p>Applied before the failure: ${list(ran)}</p>` : ""}`,
        );
      }
    }

    const skipped = MIGRATIONS.filter((m) => done.has(m.id)).map((m) => m.id);
    return page(
      200,
      ran.length ? "Migrations applied" : "Already up to date",
      `${ran.length ? `<p class="ok">Applied: ${list(ran)}</p>` : ""}
       ${skipped.length ? `<p>Already applied: ${list(skipped)}</p>` : ""}
       ${!ran.length && !skipped.length ? "<p>No migrations registered.</p>" : ""}
       <p>Database is current. You can close this tab.</p>`,
    );
  } finally {
    await client.end();
  }
}

function list(ids: string[]) {
  return ids.map((id) => `<code>${escapeHtml(id)}</code>`).join(", ");
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
