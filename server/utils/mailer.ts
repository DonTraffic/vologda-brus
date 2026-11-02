import type { H3Event } from 'h3'
import { createTransport, type Transporter } from 'nodemailer'

export interface SmtpSettings {
  host: string
  port: number
  user: string
  pass: string
  to: string
  mode: 'smtp' | 'imap'
  imapPort: number
}

let cached: Transporter | null = null
let cachedKey = ''

export function readSmtpSettings(event: H3Event): SmtpSettings | null {
  const config = useRuntimeConfig(event)
  const host = String(config.smtpHost || '').trim()
  const user = String(config.smtpUser || '').trim()
  const pass = String(config.smtpPass || '')
  const port = Number(config.smtpPort) || 465
  const to = String(config.mailTo || '').trim() || user
  const mode = String(config.mailMode || 'smtp').trim() === 'imap' ? 'imap' as const : 'smtp' as const
  const imapPort = Number(config.imapPort) || 993

  if (!host || !user || !pass || !to) return null
  return { host, port, user, pass, to, mode, imapPort }
}

export function getTransport(smtp: SmtpSettings): Transporter {
  const key = `${smtp.host}:${smtp.port}:${smtp.user}`
  if (cached && cachedKey === key) return cached

  cached = createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    requireTLS: smtp.port === 587,
    auth: { user: smtp.user, pass: smtp.pass },
    pool: true,
    maxConnections: 1,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  })
  cachedKey = key
  return cached
}
