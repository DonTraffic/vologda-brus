export const PHONE_DISPLAY = '+7 (499) 755-97-22'

export const PHONE_HREF = '+74997559722'

export const EMAIL = 'info@vologda-brus.ru'

export const ADDRESS = {
  city: 'Вологда',

  cityIn: 'Вологде',
  street: 'Московское шоссе, 44',
  full: 'г. Вологда, Московское шоссе, 44',

  postalCode: '160033',
  lat: 59.182418 as number | null,
  lon: 39.955073 as number | null,
}

export const WORK_HOURS = {

  text: 'Пн–Пт 9:00–18:00',
  schemaOrg: 'Mo-Fr 09:00-18:00',
}

export const LEGAL = {
  name: 'ИП Виноградов Алексей Михайлович',
  shortName: 'ИП Виноградов А. М.',
  inn: '350701926897',
  ogrnip: '326350000007560',

  addressLegal: '160022, г. Вологда, ул. Преминина, 10Б, кв. 212',
}

export const COMPANY = {
  name: 'Вологда Брус',
  tagline: 'Производство клееного бруса полного цикла и строительство домов под контролем производителя',
  foundedYear: 2017,
  city: 'Вологда',
}

export const MESSENGERS = [
  {
    id: 'telegram',
    label: 'Telegram',

    href: 'https://t.me/vologdabrus',
    icon: 'telegram',
  },
  {
    id: 'max',
    label: 'MAX',
    href: 'https://max.ru/join/1vDulaunJhWgeS-LkQpUcxO1oIgzEMIfZFQYOojQO-k',
    icon: 'max',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',

    href: `https://wa.me/${PHONE_HREF.replace('+', '')}`,
    icon: 'whatsapp',
  },
] as const

export const SOCIAL = [
  { label: 'ВКонтакте', href: 'https://vk.com/vologdabrus' },
  { label: 'Telegram', href: 'https://t.me/vologdabrus' },
]

export const NAV = [
  { label: 'Продукция', href: '/#products' },
  { label: 'Проекты', href: '/#projects' },
  { label: 'Производство', href: '/#quality' },
  { label: 'Для дилеров', href: '/dealers/' },
  { label: 'Блог', href: '/blog/' },
]

export const FOOTER_NAV = [
  { label: 'Проекты', href: '/#projects' },
  { label: 'Блог', href: '/blog/' },
  { label: 'Для дилеров', href: '/dealers/' },
]
