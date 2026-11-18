"""Converts an Anki deck (.apkg) into the BDA_DECKS / BDA_CARDS data used by app/index.html.

    python3 tools/anki_to_cards.py BDA_Exam_Prep.apkg > bda_data.js

Basic notes need fields Front, Back, Hook, Source; cloze notes need Text, Hook, Source.
Each cloze deletion becomes its own card. Only <b>, <i> and line breaks are kept.
To update the app, replace the existing `const BDA_DECKS = ...` and `const BDA_CARDS = ...`
lines in app/index.html with the output. Card ids come from the Anki note ids, so progress on
existing cards is kept.
"""
import html, json, re, sqlite3, sys, tempfile, zipfile

def clean(s):
    s = s.replace('&nbsp;', ' ')
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = re.sub(r'<(/?)(b|i|strong|em)>', lambda m: '\x01%s%s\x02' % (m.group(1), {'strong': 'b', 'em': 'i'}.get(m.group(2).lower(), m.group(2).lower())), s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).strip()

def main(path):
    tmp = tempfile.mkdtemp()
    zipfile.ZipFile(path).extractall(tmp)
    c = sqlite3.connect(f'{tmp}/collection.anki2')
    models = {int(k): v['name'] for k, v in json.loads(c.execute('select models from col').fetchone()[0]).items()}
    decks = {int(k): v['name'] for k, v in json.loads(c.execute('select decks from col').fetchone()[0]).items()}
    rows = c.execute('select n.id, n.mid, n.flds, min(cd.did) from notes n join cards cd on cd.nid = n.id group by n.id order by min(cd.did), n.id').fetchall()
    names, cards = [], []
    for nid, mid, flds, did in rows:
        deck = decks[did].split('::')[-1]
        if deck not in names: names.append(deck)
        f = [clean(x) for x in flds.split('\x1f')]
        if 'Cloze' not in models[mid]:
            front, back, hook, src = (f + ['', '', '', ''])[:4]
            cards.append({'id': 'b%d' % (nid % 100000), 'deck': len(names) - 1, 'f': front, 'b': back, 'h': hook, 's': src})
            continue
        text, hook, src = (f + ['', '', ''])[:3]
        pat = r'\{\{c(\d+)::(.*?)(?:::[^}]*)?\}\}'
        for n in sorted(set(int(x) for x in re.findall(r'\{\{c(\d+)::', text))):
            front = re.sub(pat, lambda m: '[ ... ]' if int(m.group(1)) == n else m.group(2), text)
            back = re.sub(pat, lambda m: ('\x01b\x02' + m.group(2) + '\x01/b\x02') if int(m.group(1)) == n else m.group(2), text)
            cards.append({'id': 'b%dc%d' % (nid % 100000, n), 'deck': len(names) - 1, 'f': front, 'b': back, 'h': hook, 's': src, 'cloze': True})
    names = [re.sub(r'^\d+\s+', '', d) for d in names]
    print('const BDA_DECKS = ' + json.dumps(names, ensure_ascii=False) + ';')
    print('const BDA_CARDS = ' + json.dumps(cards, ensure_ascii=False) + ';')

if __name__ == '__main__':
    main(sys.argv[1])
