# Выкладка

Сайт — статика. Сборка:

```bash
npm ci
npm run generate       # результат в .output/public
```

Папку `.output/public` положить в `/var/www/vologda-brus/public`, конфигурацию
взять из `deploy/nginx.conf`.

## Что настроено конфигурацией

| Пункт ТЗ | Как закрыт |
|---|---|
| Один основной адрес | `www`, кириллический домен и `http://` отдают 301 на `https://vologda-brus.ru` |
| Переадресации | постранично: `$request_uri` сохраняется, старые адреса статей `/tpost/<хеш>-<адрес>` ведут на `/blog/<адрес>`, `/error404` — на `/404.html` |
| Защищённое соединение | certbot на оба домена, автопродление его таймером |
| Адреса со слешем | `rewrite ^/(.*)/$ /$1 permanent` |
| Защитные заголовки | HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` |
| Кэширование | `/_nuxt/`, `/images/`, `/fonts/`, `/vendor/` — год, HTML — с обязательной проверкой |
| Сжатие | gzip для HTML, CSS, JS и SVG; заготовка под brotli закомментирована |

## Что останется сделать руками на сервере

1. Выпустить сертификат:
   `certbot --nginx -d vologda-brus.ru -d www.vologda-brus.ru -d xn--80acbef4bubwkv.xn--p1ai -d www.xn--80acbef4bubwkv.xn--p1ai`
2. Проверить конфигурацию: `nginx -t && systemctl reload nginx`
3. Завести почту `info@vologda-brus.ru` и прописать MX.
4. Снять сайт со службы защиты от атак: именно она сейчас снимает кэширование
   и ставит посетителю cookie с его IP-адресом.
