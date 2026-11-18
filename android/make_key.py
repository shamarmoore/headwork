"""Creates a new signing key in android/keys/ (only if you don't already have one).
An APK signed with a new key can't update an install signed with the old key."""
import datetime, os
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'keys'); os.makedirs(d, exist_ok=True)
if os.path.exists(os.path.join(d, 'key.pem')): raise SystemExit('android/keys/key.pem already exists; not overwriting it.')
k = rsa.generate_private_key(public_exponent=65537, key_size=2048)
name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Headwork')])
now = datetime.datetime.now(datetime.timezone.utc)
cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(k.public_key())
        .serial_number(x509.random_serial_number()).not_valid_before(now).not_valid_after(now + datetime.timedelta(days=365*30)).sign(k, hashes.SHA256()))
open(os.path.join(d, 'key.pem'), 'wb').write(k.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
open(os.path.join(d, 'cert.pem'), 'wb').write(cert.public_bytes(serialization.Encoding.PEM))
print('new key written to', d)
