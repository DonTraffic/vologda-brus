const PHONE_WAYS = ['Телефон', 'WhatsApp']

export function wantsPhone(way: string): boolean {
  return PHONE_WAYS.includes(way)
}

export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  else if (digits.length === 10 && !digits.startsWith('7')) digits = `7${digits}`
  else if (!digits.startsWith('7')) digits = `7${digits}`
  return digits.slice(0, 11)
}

export function formatPhone(value: string): string {
  const digits = phoneDigits(value)
  const rest = digits.slice(1)
  if (!rest) return ''

  let out = `+7 ${rest.slice(0, 3)}`
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`
  return out
}

export function phoneError(value: string): string {
  const digits = phoneDigits(value)
  if (digits.length <= 1) return 'Укажите номер телефона'
  if (digits.length < 11) return 'Номер неполный — нужно 11 цифр'
  if (!/^7[3-9]/.test(digits)) return 'Такого кода в России нет'
  if (new Set(digits.slice(1)).size < 3) return 'Это не похоже на настоящий номер'
  return ''
}

export function nickError(value: string, way: string): string {
  const nick = value.trim().replace(/^@+/, '')
  if (!nick) return `Укажите ник в ${way}`
  if (nick.length < 4) return 'Ник слишком короткий'
  if (nick.length > 32) return 'Ник слишком длинный'
  if (!/^[a-zA-Z0-9._-]+$/.test(nick)) return 'В нике бывают только латинские буквы, цифры и подчёркивание'
  if (!/[a-zA-Z]/.test(nick)) return 'Это не похоже на ник'
  return ''
}

export function contactError(value: string, way: string): string {
  return wantsPhone(way) ? phoneError(value) : nickError(value, way)
}

export function nameError(value: string): string {
  const name = value.trim()
  if (name.length < 2) return 'Укажите имя'
  if (name.length > 60) return 'Слишком длинное имя'
  if (/\d/.test(name)) return 'В имени не бывает цифр'
  if (!/^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s'-]*$/.test(name)) return 'Имя записано странно'
  return ''
}

export function questionError(value: string): string {
  const text = value.trim()
  if (text.length < 10) return 'Опишите вопрос подробнее — хотя бы несколько слов'
  if (text.length > 2000) return 'Слишком длинный вопрос, сократите'
  return ''
}
