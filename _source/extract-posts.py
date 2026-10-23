# Разбирает сохранённые страницы статей Тильды в структурные данные.
# Важно не потерять подзаголовки: в редакторе Тильды они набраны тремя
# способами — <strong> внутри сплошного текста, <h2>/<h3> и просто КАПСОМ.
# Первые два вида становятся заголовками, капс остаётся абзацем, как в оригинале.
# Тип части: h2/h3 — крупные заголовки редактора, hb — подзаголовок жирным
# внутри сплошного текста (в оригинале это <strong> того же кегля), p — абзац.
import re, json, html, glob, os

NBSP = ' '

def article_body(s):
    i = s.find('<div itemprop="articleBody"')
    i = s.index('>', i) + 1
    depth, j = 1, i
    pat = re.compile(r'</?div\b', re.I)
    while depth:
        m = pat.search(s, j)
        if not m:
            break
        depth += -1 if s[m.start():m.start() + 2] == '</' else 1
        j = m.end()
    return s[i:j - len('</div')]

def plain(c):
    # Одиночный <br> — перенос строки внутри абзаца, он виден в оригинале,
    # поэтому сохраняем его как \n, а не схлопываем в пробел.
    t = html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'<br\s*/?>', '\n', c)))
    t = t.replace(NBSP, ' ')
    return '\n'.join(re.sub(r'[ \t]+', ' ', ln).strip() for ln in t.split('\n')).strip('\n ')

def parse(body):
    parts = []
    for m in re.finditer(r'<(h2|h3)\b[^>]*>(.*?)</\1>|<div class="t-redactor__text"[^>]*>(.*?)</div>', body, re.S):
        if m.group(1):
            t = plain(m.group(2))
            if t:
                parts.append({'type': m.group(1), 'text': t})
            continue
        # Текстовый блок может содержать несколько абзацев через двойной <br>
        for chunk in re.split(r'(?:<br\s*/?>\s*){2,}', m.group(3)):
            chunk = chunk.strip()
            t = plain(chunk)
            if not t:
                continue
            flat = re.sub(r'<br\s*/?>', ' ', chunk)
            is_h = bool(re.fullmatch(r'\s*<strong>.*?</strong>\s*', flat, re.S))
            parts.append({'type': 'hb' if is_h else 'p', 'text': t})
    return parts

out = []
for f in sorted(glob.glob('_source/posts/*.html')):
    s = open(f, encoding='utf-8').read()
    title = re.search(r'<h1[^>]*itemprop="headline"[^>]*>(.*?)</h1>', s, re.S)
    cover = re.search(r'<img itemprop="image" src="([^"]+)"', s)
    date = re.search(r'<meta itemprop="datePublished" content="([^"]+)"', s)
    descr = re.search(r'<meta itemprop="description" content="([^"]*)"', s)
    slug = os.path.basename(f)[:-5]
    out.append({
        'slugFull': slug,
        'slug': slug.split('-', 1)[1],
        'title': plain(title.group(1)) if title else '',
        'description': html.unescape(descr.group(1)) if descr else '',
        'date': date.group(1)[:10] if date else '',
        'coverUrl': cover.group(1) if cover else '',
        'parts': parse(article_body(s)),
    })

json.dump(out, open('_source/posts2.json', 'w'), ensure_ascii=False, indent=1)
for p in out:
    nh = sum(1 for x in p['parts'] if x['type'] != 'p')
    print(f"{p['slug']:45} {p['date']}  абзацев {len(p['parts']):3}  заголовков {nh}")
