import { ImapFlow } from 'imapflow'
import { createTransport } from 'nodemailer'
import type { SmtpSettings } from './mailer'

export interface Letter {
  subject: string
  text: string
  html: string
}

const composer = createTransport({ streamTransport: true, buffer: true, newline: 'unix' })

export async function buildMessage(smtp: SmtpSettings, letter: Letter): Promise<Buffer> {
  const built = await composer.sendMail({
    from: { name: 'Сайт Вологда Брус', address: smtp.user },
    to: smtp.to,
    date: new Date(),
    ...letter,
  })
  return built.message as Buffer
}

export async function putInMailbox(smtp: SmtpSettings, raw: Buffer): Promise<void> {
  const client = new ImapFlow({
    host: smtp.host,
    port: smtp.imapPort,
    secure: smtp.imapPort === 993,
    auth: { user: smtp.user, pass: smtp.pass },
    logger: false,
    emitLogs: false,
  })

  await client.connect()
  try {
    await client.append('INBOX', raw, [], new Date())
  }
  finally {
    await client.logout().catch(() => {})
  }
}
