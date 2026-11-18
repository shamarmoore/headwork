"""Builds an unsigned Headwork APK: binary manifest + hand-built classes.dex + app/index.html as an asset.

    python3 android/build_apk.py           -> android/out/unsigned.apk
    node android/sign.mjs                  -> android/out/Headwork.apk (needs android/keys/key.pem + cert.pem)
"""
import os, subprocess, sys, zipfile
from lxml import etree
from pyaxml import axml

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)

a = axml.AXML(); a.from_xml(etree.fromstring(open(os.path.join(HERE, 'AndroidManifest.xml'), 'rb').read())); a.compute()
manifest = os.path.join(OUT, 'AndroidManifest.xml'); open(manifest, 'wb').write(a.pack())
dex = os.path.join(OUT, 'classes.dex')
subprocess.run([sys.executable, os.path.join(HERE, 'build_dex.py'), dex], check=True)

apk = os.path.join(OUT, 'unsigned.apk')
with zipfile.ZipFile(apk, 'w') as z:
    z.write(manifest, 'AndroidManifest.xml', compress_type=zipfile.ZIP_DEFLATED)
    z.write(dex, 'classes.dex', compress_type=zipfile.ZIP_DEFLATED)
    z.write(os.path.join(ROOT, 'app', 'index.html'), 'assets/index.html', compress_type=zipfile.ZIP_DEFLATED)
print('unsigned apk ->', apk)
