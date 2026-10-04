#!/usr/bin/env python3
"""Check generated routes, anchors, assets, content retention and form labels."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'

class Scan(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.refs=[];self.images=[];self.headings=[];self.labels=set();self.controls=[];self.text=[];self.title=0;self.descriptions=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id {a["id"]}'
            self.ids.add(a['id'])
        if tag in ('a','link') and 'href' in a:self.refs.append(a['href'])
        if tag in ('script','img') and 'src' in a:self.refs.append(a['src'])
        if tag=='img':self.images.append(a)
        if tag=='h1':self.headings.append(a)
        if tag=='label' and 'for' in a:self.labels.add(a['for'])
        if tag in ('input','select','textarea'):self.controls.append(a)
        if tag=='title':self.title+=1
        if tag=='meta' and a.get('name')=='description':self.descriptions+=1
    def handle_data(self,text):self.text.append(text)

pages={p:Scan() for p in DIST.rglob('*.html')}
for p,s in pages.items():s.feed(p.read_text())
count=0
for p,s in pages.items():
    assert s.title==1,f'{p}: no unique title'
    if 'http-equiv="refresh"' not in p.read_text():
        assert len(s.headings)==1,f'{p}: expected exactly one h1'
        assert s.descriptions==1,f'{p}: missing description'
    for im in s.images:
        assert im.get('alt'),f'{p}: missing image text'
        assert im.get('width') and im.get('height'),f'{p}: missing image dimensions'
    for control in s.controls:
        assert control.get('id') in s.labels,f'{p}: unlabeled form field'
    for ref in s.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        target = DIST/u.path.lstrip('/') if u.path.startswith('/') else p.parent/u.path
        if not u.path:target=p
        if target.is_dir():target=target/'index.html'
        assert target.exists(),f'{p}: broken link {ref}'
        if u.fragment and target.suffix=='.html':assert unquote(u.fragment) in pages[target].ids,f'{p}: missing anchor {ref}'
        count+=1
for a in json.loads((ROOT/'content/articles.json').read_text()):
    p=DIST/'post'/a['slug']/'index.html';text=''.join(pages[p].text)
    assert all(b['text'] in text for b in a['blocks']),f'Article content lost: {a["slug"]}'
for p in DIST.rglob('*.html'):
    assert 'getrravelwithsarah' not in p.read_text(),'Original footer email typo retained'
for font in range(6):assert (DIST/f'assets/fonts/font-{font}.woff').stat().st_size>1000,'Font missing'
print(f'PASS: {len(pages)} HTML documents, {count} internal links/assets, all 3 original articles, form labels, image descriptions and fonts.')
