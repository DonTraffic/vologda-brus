import net from 'node:net'

function probe(host: string, port: number, ms = 9000): Promise<string> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    const finish = (text: string) => { socket.destroy(); resolve(text) }
    socket.setTimeout(ms)
    socket.once('connect', () => finish('открыт'))
    socket.once('timeout', () => finish('молчит — порт закрыт с этого сервера'))
    socket.once('error', e => finish(`отказ: ${(e as Error).message}`))
    socket.connect(port, host)
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const token = String(config.diagToken ?? '')
  if (!token || getQuery(event).token !== token) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const host = String(config.smtpHost ?? '').trim()
  const port = Number(config.smtpPort) || 465
  const user = String(config.smtpUser ?? '').trim()
  const pass = String(config.smtpPass ?? '')
  const to = String(config.mailTo ?? '').trim()

  const ports = host ? await Promise.all([465, 587, 25].map(p => probe(host, p))) : []

  return {
    настройки: {
      сервер: host || 'ПУСТО',
      порт: config.smtpPort ? String(config.smtpPort) : 'ПУСТО',
      ящик: user || 'ПУСТО',
      пароль: pass ? `задан, ${pass.length} символов` : 'ПУСТО',
      получатель: to || 'не задан, заявки пойдут на сам ящик',
      приёмЗаявок: host && user && pass ? 'включён' : 'ВЫКЛЮЧЕН',
    },
    связь: host
      ? { [`${host}:465`]: ports[0], [`${host}:587`]: ports[1], [`${host}:25`]: ports[2] }
      : 'сервер не задан, проверять нечего',
    используетсяПорт: port,
  }
})
