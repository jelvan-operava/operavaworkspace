import { NextRequest, NextResponse } from 'next/server';
import { getPortalEnv, hasBinding, safeJsonParse } from '@/lib/cloudflare';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tickets — list tickets from D1
 * POST /api/tickets — create/upsert ticket (body = SupportTicket-shaped JSON)
 */
export async function GET() {
  const env = await getPortalEnv();
  if (!env || !hasBinding(env.PORTAL_DB)) {
    return NextResponse.json(
      { error: 'PORTAL_DB binding unavailable' },
      { status: 503 }
    );
  }

  try {
    const { results } = await env.PORTAL_DB.prepare(
      `SELECT id, ticket_no, subject, category, priority, status, channel,
              client_name, client_email, assigned_agent_id, sla_due, sla_breached,
              payload, created_at, updated_at
       FROM tickets ORDER BY updated_at DESC LIMIT 200`
    ).all();

    const tickets = (results ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      const payload = safeJsonParse<Record<string, unknown>>(
        String(r.payload ?? '{}'),
        {}
      );
      return { ...payload, ...r, payload: undefined };
    });

    return NextResponse.json({ tickets });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'List tickets failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const env = await getPortalEnv();
  if (!env || !hasBinding(env.PORTAL_DB)) {
    return NextResponse.json(
      { error: 'PORTAL_DB binding unavailable' },
      { status: 503 }
    );
  }

  let ticket: Record<string, unknown>;
  try {
    ticket = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const id = String(ticket.id || `ticket-${crypto.randomUUID()}`);
  const ticketNo = String(ticket.ticketNo || ticket.ticket_no || `SUP-${Date.now()}`);
  const now = new Date().toISOString();

  try {
    await env.PORTAL_DB.prepare(
      `INSERT INTO tickets (
         id, ticket_no, subject, category, priority, status, channel,
         client_name, client_email, assigned_agent_id, sla_due, sla_breached,
         payload, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         subject = excluded.subject,
         category = excluded.category,
         priority = excluded.priority,
         status = excluded.status,
         channel = excluded.channel,
         client_name = excluded.client_name,
         client_email = excluded.client_email,
         assigned_agent_id = excluded.assigned_agent_id,
         sla_due = excluded.sla_due,
         sla_breached = excluded.sla_breached,
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
      .bind(
        id,
        ticketNo,
        String(ticket.subject || ''),
        ticket.category != null ? String(ticket.category) : null,
        String(ticket.priority || 'Medium'),
        String(ticket.status || 'Open'),
        ticket.channel != null ? String(ticket.channel) : null,
        ticket.clientName != null ? String(ticket.clientName) : null,
        ticket.clientEmail != null ? String(ticket.clientEmail) : null,
        ticket.assignedAgent && typeof ticket.assignedAgent === 'object'
          ? String((ticket.assignedAgent as { id?: string }).id || '')
          : null,
        ticket.slaDue != null ? String(ticket.slaDue) : null,
        ticket.slaBreached ? 1 : 0,
        JSON.stringify(ticket),
        String(ticket.createdAt || now),
        now
      )
      .run();

    return NextResponse.json({ ok: true, id, ticketNo });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Save ticket failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
