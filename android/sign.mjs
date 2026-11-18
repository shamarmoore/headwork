// Signs android/out/unsigned.apk with APK Signature Scheme v1, v2 and v3 (SHA-256).
// Every update must use the same key, or Android refuses to install it over the old version.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ApkSigner, SigningKey } from 'apk_sign_ts';
const here = dirname(fileURLToPath(import.meta.url));
const apk = new Uint8Array(readFileSync(join(here, 'out', 'unsigned.apk')));
const key = SigningKey.fromPEM(readFileSync(join(here, 'keys', 'key.pem'), 'utf8'), readFileSync(join(here, 'keys', 'cert.pem'), 'utf8'));
const { signedApk } = await new ApkSigner({ signingKey: key, digestAlgorithm: 'SHA-256' }).sign(apk);
writeFileSync(join(here, 'out', 'Headwork.apk'), signedApk);
console.log('signed ->', join(here, 'out', 'Headwork.apk'));
