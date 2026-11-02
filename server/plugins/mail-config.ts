export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  const shown = (v: unknown) => {
    const text = String(v ?? '').trim()
    return text || 'ПУСТО'
  }

  const pass = String(config.smtpPass ?? '')
  const ready = Boolean(String(config.smtpHost ?? '').trim() && String(config.smtpUser ?? '').trim() && pass)

  console.log('[почта] сервер:      ', shown(config.smtpHost))
  console.log('[почта] порт:        ', shown(config.smtpPort))
  console.log('[почта] ящик:        ', shown(config.smtpUser))
  console.log('[почта] пароль:      ', pass ? `задан, ${pass.length} символов` : 'ПУСТО')
  console.log('[почта] получатель:  ', String(config.mailTo ?? '').trim() || 'не задан, заявки пойдут на сам ящик')
  console.log('[почта] приём заявок:', ready ? 'включён' : 'ВЫКЛЮЧЕН, формы ответят «приём не настроен»')
})
