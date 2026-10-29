const MAX_FIELDS = 24
const MAX_KEY = 80
const MAX_VALUE = 2000
const MAX_SUBJECT = 180
const RATE_LIMIT = 8
const RATE_WINDOW_MS = 60_000

const clean = (v: unknown, limit: number) =>
  String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, limit)

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const origin = getRequestHeader(event, 'origin')
  if (origin) {
    let from = ''
    try { from = new URL(origin).host }
    catch { from = '' }

    const siteHost = new URL(String(config.public.siteUrl)).host
    const selfHost = getRequestHost(event, { xForwardedHost: true })

    if (from !== siteHost && from !== selfHost) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (tooManyRequests(ip, RATE_LIMIT, RATE_WINDOW_MS)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: { ok: false, error: 'rate_limited' },
    })
  }

  const body = await readBody<{ subject?: unknown, fields?: unknown }>(event)
  const raw = body?.fields

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: { ok: false, error: 'bad_body' } })
  }

  const entries = Object.entries(raw as Record<string, unknown>)
    .slice(0, MAX_FIELDS)
    .map(([k, v]) => [clean(k, MAX_KEY), clean(v, MAX_VALUE)] as const)
    .filter(([k, v]) => k && v)

  if (!entries.length) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: { ok: false, error: 'empty' } })
  }

  const smtp = readSmtpSettings(event)
  if (!smtp) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      data: { ok: false, error: 'not_configured' },
    })
  }

  const subject = clean(body?.subject, MAX_SUBJECT) || 'Заявка с сайта'
  const text = entries.map(([k, v]) => `${k}: ${v}`).join('\n')
  const html = `<table cellpadding="6" style="border-collapse:collapse;font:15px/1.5 Arial,sans-serif">${
    entries.map(([k, v]) =>
      `<tr><td style="border:1px solid #ddd;background:#f6f6f6"><b>${escapeHtml(k)}</b></td>`
      + `<td style="border:1px solid #ddd">${escapeHtml(v)}</td></tr>`,
    ).join('')
  }</table>`

  try {
    await getTransport(smtp).sendMail({
      from: { name: 'Сайт Вологда Брус', address: smtp.user },
      to: smtp.to,
      subject,
      text,
      html,
    })
  }
  catch (e) {
    console.error('[lead] письмо не ушло:', e instanceof Error ? e.message : e)
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      data: { ok: false, error: 'send_failed' },
    })
  }

  return { ok: true }
})
