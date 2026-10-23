import json, os, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, '_source', 'orig')
OUT  = os.path.join(ROOT, 'public', 'images')
UA   = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36'
WIDTHS = [640, 1024, 1600]

man = json.load(open(os.path.join(ROOT, '_source', 'img-manifest.json')))
orig_bytes = new_bytes = 0
report = []

for i, m in enumerate(man, 1):
    slug, ext, url = m['slug'], m['ext'], m['url']
    raw = os.path.join(SRC, f'{slug}.{ext}')
    if not os.path.exists(raw):
        r = subprocess.run(['curl','-sS','-A',UA,'--max-time','90','-o',raw,url])
        if r.returncode != 0 or not os.path.exists(raw):
            print(f'[{i}/{len(man)}] FAIL {slug} {url}', flush=True); continue
    osz = os.path.getsize(raw); orig_bytes += osz

    if ext == 'svg':
        dst = os.path.join(OUT, f'{slug}.svg')
        open(dst,'wb').write(open(raw,'rb').read())
        new_bytes += os.path.getsize(dst)
        print(f'[{i}/{len(man)}] {slug}.svg copied', flush=True); continue

    try:
        im = Image.open(raw); im.load()
    except Exception as e:
        print(f'[{i}/{len(man)}] SKIP {slug}: {e}', flush=True); continue
    if im.mode in ('RGBA','LA','P'):
        bg = Image.new('RGB', im.size, (255,255,255))
        im2 = im.convert('RGBA'); bg.paste(im2, mask=im2.split()[-1]); im = bg
    else:
        im = im.convert('RGB')

    w0, h0 = im.size
    made = 0
    for w in WIDTHS:
        if w > w0 and w != WIDTHS[0]:
            continue
        tw = min(w, w0); th = max(1, round(h0 * tw / w0))
        rs = im.resize((tw, th), Image.LANCZOS)
        p = os.path.join(OUT, f'{slug}-{w}.webp')
        rs.save(p, 'WEBP', quality=82, method=6)
        new_bytes += os.path.getsize(p); made += 1
    # jpg fallback at 1024
    tw = min(1024, w0); th = max(1, round(h0 * tw / w0))
    p = os.path.join(OUT, f'{slug}.jpg')
    im.resize((tw, th), Image.LANCZOS).save(p, 'JPEG', quality=84, optimize=True, progressive=True)
    new_bytes += os.path.getsize(p)
    report.append((slug, w0, h0, osz))
    print(f'[{i}/{len(man)}] {slug}  {w0}x{h0}  {osz//1024}KB -> {made} webp + jpg', flush=True)

print('\n=== ИТОГО ===')
print(f'оригиналы: {orig_bytes/1048576:.2f} MB')
print(f'после пережатия (все варианты): {new_bytes/1048576:.2f} MB')
