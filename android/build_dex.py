"""Hand-assembles classes.dex for the Headwork Android app (package com.headwork.app).

No Android SDK is needed: the Dalvik bytecode for four small classes is written directly.
  MainActivity  WebView that loads assets/index.html and exposes the Bridge as window.HWAndroid
  Wake          MainActivity subclass that opens over the lock screen at index.html#review
  Bridge        @JavascriptInterface methods: schedule, alarm, cancel, notifyNow, enabled,
                share, openSettings, sdk, canFsi, canExact, openFsi, openExact
  Notify        BroadcastReceiver that posts the notification when an alarm fires (and after a reboot)

Usage: python3 build_dex.py [output path]   (default: classes.dex next to this file)
"""
import os, sys, struct, hashlib, zlib

PKG = 'Lcom/headwork/app/'
MAIN, BRIDGE, NOTIFY, WAKE = PKG + 'MainActivity;', PKG + 'Bridge;', PKG + 'Notify;', PKG + 'Wake;'
URI = 'Landroid/net/Uri;'
OBJ, STR, CTX, ACT, INTENT = 'Ljava/lang/Object;', 'Ljava/lang/String;', 'Landroid/content/Context;', 'Landroid/app/Activity;', 'Landroid/content/Intent;'
CS, PI, NM, AM = 'Ljava/lang/CharSequence;', 'Landroid/app/PendingIntent;', 'Landroid/app/NotificationManager;', 'Landroid/app/AlarmManager;'
NB, BTS, NSTYLE, NCH = 'Landroid/app/Notification$Builder;', 'Landroid/app/Notification$BigTextStyle;', 'Landroid/app/Notification$Style;', 'Landroid/app/NotificationChannel;'
WV, WS, BR, CLS, JSI = 'Landroid/webkit/WebView;', 'Landroid/webkit/WebSettings;', 'Landroid/content/BroadcastReceiver;', 'Ljava/lang/Class;', 'Landroid/webkit/JavascriptInterface;'

def uleb(n):
    out = bytearray()
    while True:
        b = n & 0x7f; n >>= 7
        if n: out.append(b | 0x80)
        else: out.append(b); return bytes(out)

# symbolic references, resolved to indexes once every string/type/method is known
def M(cls, name, ret, *params): return ('m', (cls, name, ret, tuple(params)))
def F(cls, name, typ): return ('f', (cls, name, typ))
def T(t): return ('t', t)
def Sx(s): return ('s', s)

# ---------------- instruction helpers (Dalvik formats) ----------------
def inv(op, meth, *regs):          # 35c: invoke-kind {vC, vD, vE, vF, vG}, meth
    assert len(regs) <= 5 and all(0 <= r < 16 for r in regs)
    r = list(regs) + [0]*(5-len(regs))
    C, D, E, F_, G = r
    return [(len(regs) << 12) | (G << 8) | op, meth, (F_ << 12) | (E << 8) | (D << 4) | C]
IV = lambda m, *r: inv(0x6e, m, *r)    # invoke-virtual
IS = lambda m, *r: inv(0x6f, m, *r)    # invoke-super
ID = lambda m, *r: inv(0x70, m, *r)    # invoke-direct
IST = lambda m, *r: inv(0x71, m, *r)   # invoke-static
def MRO(a): return [(a << 8) | 0x0c]   # move-result-object
def MR(a): return [(a << 8) | 0x0a]    # move-result
def MRW(a): return [(a << 8) | 0x0b]   # move-result-wide
RV = [0x0e]                            # return-void
def RET(a): return [(a << 8) | 0x0f]   # return
def RETO(a): return [(a << 8) | 0x11]  # return-object
def C4(a, v): return [((v & 0xf) << 12) | (a << 8) | 0x12]
def C16(a, v): return [(a << 8) | 0x13, v & 0xffff]
def C32(a, v): return [(a << 8) | 0x14, v & 0xffff, (v >> 16) & 0xffff]
def CH16(a, v): return [(a << 8) | 0x15, (v >> 16) & 0xffff]
def CS_(a, s): return [(a << 8) | 0x1a, Sx(s)]
def CC(a, t): return [(a << 8) | 0x1c, T(t)]
def CHK(a, t): return [(a << 8) | 0x1f, T(t)]
def NEW(a, t): return [(a << 8) | 0x22, T(t)]
def NARR(a, size_reg, t): return [(size_reg << 12) | (a << 8) | 0x23, T(t)]
def APUTO(val, arr, idx): return [(val << 8) | 0x4d, (idx << 8) | arr]
def IGETO(a, obj, f): return [(obj << 12) | (a << 8) | 0x54, f]
def IPUTO(a, obj, f): return [(obj << 12) | (a << 8) | 0x5b, f]
def SGET(a, f): return [(a << 8) | 0x60, f]
def IFNEZ(a, label): return [(a << 8) | 0x39, ('lbl', label)]
def IFEQZ(a, label): return [(a << 8) | 0x38, ('lbl', label)]
def GOTO(label): return [('goto', label)]
def LABEL(name): return [('label', name)]

FLAGS_PI = 0x04000000 | 0x08000000  # PendingIntent.FLAG_IMMUTABLE | FLAG_UPDATE_CURRENT

# ---------------- methods ----------------
methods = []
def meth(cls, name, ret, params, access, nlocals, code, annotated=False, static=False):
    ins = (0 if static else 1) + sum(2 if p in ('J','D') else 1 for p in params)
    methods.append(dict(cls=cls, name=name, ret=ret, params=tuple(params), access=access, regs=nlocals+ins, ins=ins, code=code, ann=annotated))

# MainActivity
meth(MAIN, '<init>', 'V', [], 0x10001, 0, ID(M(ACT,'<init>','V'), 0) + RV)
# onCreate(Bundle): locals v0..v4, p0=v5 this, p1=v6 bundle
oc = []
oc += IS(M(ACT,'onCreate','V','Landroid/os/Bundle;'), 5, 6)
oc += NEW(0, WV) + ID(M(WV,'<init>','V',CTX), 0, 5)
oc += IV(M(WV,'getSettings',WS), 0) + MRO(1)
oc += C4(2, 1)
oc += IV(M(WS,'setJavaScriptEnabled','V','Z'), 1, 2)
oc += IV(M(WS,'setDomStorageEnabled','V','Z'), 1, 2)
oc += NEW(1, BRIDGE) + ID(M(BRIDGE,'<init>','V',ACT), 1, 5)
oc += CS_(2, 'HWAndroid') + IV(M(WV,'addJavascriptInterface','V',OBJ,STR), 0, 1, 2)
oc += IV(M(MAIN,'url',STR), 5) + MRO(1) + IV(M(WV,'loadUrl','V',STR), 0, 1)
oc += IV(M(ACT,'setContentView','V','Landroid/view/View;'), 5, 0)
oc += C4(1, 1) + NARR(2, 1, '[Ljava/lang/String;')
oc += CS_(3, 'android.permission.POST_NOTIFICATIONS') + C4(4, 0) + APUTO(3, 2, 4)
oc += IV(M(ACT,'requestPermissions','V','[Ljava/lang/String;','I'), 5, 2, 1)
oc += RV
meth(MAIN, 'onCreate', 'V', ['Landroid/os/Bundle;'], 0x4, 5, oc)
meth(MAIN, 'url', STR, [], 0x1, 1, CS_(0, 'file:///android_asset/index.html') + RETO(0))
# Wake: same app, opened over the lock screen straight into the due review
meth(WAKE, '<init>', 'V', [], 0x10001, 0, ID(M(MAIN,'<init>','V'), 0) + RV)
meth(WAKE, 'url', STR, [], 0x1, 1, CS_(0, 'file:///android_asset/index.html#review') + RETO(0))

# Bridge
FA = F(BRIDGE, 'a', ACT)
meth(BRIDGE, '<init>', 'V', [ACT], 0x10001, 0, ID(M(OBJ,'<init>','V'), 0) + IPUTO(1, 0, FA) + RV)
# schedule(int id, String atMillis, String title, String text): inexact alarm, normal notification
# locals v0..v5; p0=v6 p1=v7 p2=v8 p3=v9 p4=v10
sc = []
sc += IGETO(0, 6, FA)
sc += IST(M('Ljava/lang/Long;','parseLong','J',STR), 8) + MRW(1)
sc += NEW(3, INTENT) + CC(4, NOTIFY) + ID(M(INTENT,'<init>','V',CTX,CLS), 3, 0, 4)
sc += CS_(4, 't') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 3, 4, 9)
sc += CS_(4, 'x') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 3, 4, 10)
sc += CS_(4, 'i') + IV(M(INTENT,'putExtra',INTENT,STR,'I'), 3, 4, 7)
sc += C32(4, FLAGS_PI) + IST(M(PI,'getBroadcast',PI,CTX,'I',INTENT,'I'), 0, 7, 3, 4) + MRO(3)
sc += CS_(4, 'alarm') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 4) + MRO(4) + CHK(4, AM)
sc += C4(5, 0) + IV(M(AM,'setAndAllowWhileIdle','V','I','J',PI), 4, 5, 1, 2, 3)
sc += RV
meth(BRIDGE, 'schedule', 'V', ['I', STR, STR, STR], 0x1, 6, sc, annotated=True)
# alarm(int id, String atMillis, String title, String text): exact alarm, full-screen notification
al = []
al += IGETO(0, 6, FA)
al += IST(M('Ljava/lang/Long;','parseLong','J',STR), 8) + MRW(1)
al += NEW(3, INTENT) + CC(4, NOTIFY) + ID(M(INTENT,'<init>','V',CTX,CLS), 3, 0, 4)
al += CS_(4, 't') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 3, 4, 9)
al += CS_(4, 'x') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 3, 4, 10)
al += CS_(4, 'i') + IV(M(INTENT,'putExtra',INTENT,STR,'I'), 3, 4, 7)
al += CS_(4, 'f') + C4(5, 1) + IV(M(INTENT,'putExtra',INTENT,STR,'I'), 3, 4, 5)
al += C32(4, FLAGS_PI) + IST(M(PI,'getBroadcast',PI,CTX,'I',INTENT,'I'), 0, 7, 3, 4) + MRO(3)
al += CS_(4, 'alarm') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 4) + MRO(4) + CHK(4, AM)
al += C4(5, 0) + IV(M(AM,'setExactAndAllowWhileIdle','V','I','J',PI), 4, 5, 1, 2, 3)
al += RV
meth(BRIDGE, 'alarm', 'V', ['I', STR, STR, STR], 0x1, 6, al, annotated=True)
meth(BRIDGE, 'sdk', 'I', [], 0x1, 1, SGET(0, F('Landroid/os/Build$VERSION;','SDK_INT','I')) + RET(0), annotated=True)
cf = IGETO(0, 2, FA) + CS_(1, 'notification') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 1) + MRO(0) + CHK(0, NM)
cf += IV(M(NM,'canUseFullScreenIntent','Z'), 0) + MR(0) + RET(0)   # API 34+; JS checks sdk() first
meth(BRIDGE, 'canFsi', 'Z', [], 0x1, 2, cf, annotated=True)
ce = IGETO(0, 2, FA) + CS_(1, 'alarm') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 1) + MRO(0) + CHK(0, AM)
ce += IV(M(AM,'canScheduleExactAlarms','Z'), 0) + MR(0) + RET(0)   # API 31+; JS checks sdk() first
meth(BRIDGE, 'canExact', 'Z', [], 0x1, 2, ce, annotated=True)
for nm, action in (('openFsi','android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT'), ('openExact','android.settings.REQUEST_SCHEDULE_EXACT_ALARM')):
    o = CS_(1, 'package:com.headwork.app') + IST(M(URI,'parse',URI,STR), 1) + MRO(1)
    o += NEW(0, INTENT) + CS_(2, action) + ID(M(INTENT,'<init>','V',STR,URI), 0, 2, 1)
    o += IGETO(1, 3, FA) + IV(M(ACT,'startActivity','V',INTENT), 1, 0) + RV
    meth(BRIDGE, nm, 'V', [], 0x1, 3, o, annotated=True)
# cancel(int id): locals v0..v2; p0=v3 p1=v4
cn = []
cn += IGETO(0, 3, FA)
cn += NEW(1, INTENT) + CC(2, NOTIFY) + ID(M(INTENT,'<init>','V',CTX,CLS), 1, 0, 2)
cn += C32(2, FLAGS_PI) + IST(M(PI,'getBroadcast',PI,CTX,'I',INTENT,'I'), 0, 4, 1, 2) + MRO(1)
cn += CS_(2, 'alarm') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 2) + MRO(2) + CHK(2, AM)
cn += IV(M(AM,'cancel','V',PI), 2, 1) + IV(M(PI,'cancel','V'), 1)
cn += RV
meth(BRIDGE, 'cancel', 'V', ['I'], 0x1, 3, cn, annotated=True)
# notifyNow(String title, String text): locals v0..v2; p0=v3 p1=v4 p2=v5
nn = IGETO(0, 3, FA) + C16(1, 999) + C4(2, 0) + IST(M(NOTIFY,'show','V',CTX,'I',STR,STR,'I'), 0, 1, 4, 5, 2) + RV
meth(BRIDGE, 'notifyNow', 'V', [STR, STR], 0x1, 3, nn, annotated=True)
# enabled(): locals v0,v1; p0=v2
en = IGETO(0, 2, FA) + CS_(1, 'notification') + IV(M(ACT,'getSystemService',OBJ,STR), 0, 1) + MRO(0) + CHK(0, NM)
en += IV(M(NM,'areNotificationsEnabled','Z'), 0) + MR(0) + RET(0)
meth(BRIDGE, 'enabled', 'Z', [], 0x1, 2, en, annotated=True)
# share(String text): locals v0,v1; p0=v2 p1=v3
sh = NEW(0, INTENT) + CS_(1, 'android.intent.action.SEND') + ID(M(INTENT,'<init>','V',STR), 0, 1)
sh += CS_(1, 'text/plain') + IV(M(INTENT,'setType',INTENT,STR), 0, 1)
sh += CS_(1, 'android.intent.extra.TEXT') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 0, 1, 3)
sh += CS_(1, 'Headwork backup') + IST(M(INTENT,'createChooser',INTENT,INTENT,CS), 0, 1) + MRO(0)
sh += IGETO(1, 2, FA) + IV(M(ACT,'startActivity','V',INTENT), 1, 0) + RV
meth(BRIDGE, 'share', 'V', [STR], 0x1, 2, sh, annotated=True)
# openSettings(): locals v0..v2; p0=v3
os_ = NEW(0, INTENT) + CS_(1, 'android.settings.APP_NOTIFICATION_SETTINGS') + ID(M(INTENT,'<init>','V',STR), 0, 1)
os_ += CS_(1, 'android.provider.extra.APP_PACKAGE') + CS_(2, 'com.headwork.app') + IV(M(INTENT,'putExtra',INTENT,STR,STR), 0, 1, 2)
os_ += IGETO(1, 3, FA) + IV(M(ACT,'startActivity','V',INTENT), 1, 0) + RV
meth(BRIDGE, 'openSettings', 'V', [], 0x1, 3, os_, annotated=True)

# Notify
meth(NOTIFY, '<init>', 'V', [], 0x10001, 0, ID(M(BR,'<init>','V'), 0) + RV)
# onReceive(Context, Intent): locals v0..v4; p0=v5 p1=v6 p2=v7
orc = []
orc += CS_(0, 't') + IV(M(INTENT,'getStringExtra',STR,STR), 7, 0) + MRO(0)
orc += C4(3, 0)
orc += IFNEZ(0, 'have')
orc += CS_(0, 'Headwork') + CS_(1, 'Your phone restarted. Open Headwork so your review reminders keep coming.') + C16(2, 998)
orc += GOTO('show')
orc += LABEL('have')
orc += CS_(1, 'x') + IV(M(INTENT,'getStringExtra',STR,STR), 7, 1) + MRO(1)
orc += CS_(2, 'i') + C4(4, 0) + IV(M(INTENT,'getIntExtra','I',STR,'I'), 7, 2, 4) + MR(2)
orc += CS_(4, 'f') + IV(M(INTENT,'getIntExtra','I',STR,'I'), 7, 4, 3) + MR(3)
orc += LABEL('show')
orc += IST(M(NOTIFY,'show','V',CTX,'I',STR,STR,'I'), 6, 2, 0, 1, 3) + RV
meth(NOTIFY, 'onReceive', 'V', [CTX, INTENT], 0x1, 5, orc)
# static show(Context ctx, int id, String title, String text, int full): locals v0..v6; p0=v7 p1=v8 p2=v9 p3=v10 p4=v11
s = []
s += CS_(0, 'notification') + IV(M(CTX,'getSystemService',OBJ,STR), 7, 0) + MRO(0) + CHK(0, NM)
s += IFEQZ(11, 'normal')
s += CS_(2, 'alarms') + CS_(3, 'Study alarms (full screen)') + GOTO('mk')
s += LABEL('normal') + CS_(2, 'reviews') + CS_(3, 'Review reminders')
s += LABEL('mk')
s += NEW(1, NCH) + C4(4, 4) + ID(M(NCH,'<init>','V',STR,CS,'I'), 1, 2, 3, 4)
s += IV(M(NM,'createNotificationChannel','V',NCH), 0, 1)
s += NEW(1, NB) + ID(M(NB,'<init>','V',CTX,STR), 1, 7, 2)
s += C32(3, 17301659) + IV(M(NB,'setSmallIcon',NB,'I'), 1, 3)   # android.R.drawable.ic_dialog_info
s += IV(M(NB,'setContentTitle',NB,CS), 1, 9)
s += IV(M(NB,'setContentText',NB,CS), 1, 10)
s += NEW(3, BTS) + ID(M(BTS,'<init>','V'), 3) + IV(M(BTS,'bigText',BTS,CS), 3, 10)
s += IV(M(NB,'setStyle',NB,NSTYLE), 1, 3)
s += C4(3, 1) + IV(M(NB,'setAutoCancel',NB,'Z'), 1, 3)
s += NEW(3, INTENT) + CC(4, WAKE) + ID(M(INTENT,'<init>','V',CTX,CLS), 3, 7, 4)
s += C32(5, FLAGS_PI) + IST(M(PI,'getActivity',PI,CTX,'I',INTENT,'I'), 7, 8, 3, 5) + MRO(3)
s += IV(M(NB,'setContentIntent',NB,PI), 1, 3)
s += IFEQZ(11, 'post')
s += C4(6, 1) + IV(M(NB,'setFullScreenIntent',NB,PI,'Z'), 1, 3, 6)
s += CS_(4, 'alarm') + IV(M(NB,'setCategory',NB,STR), 1, 4)
s += LABEL('post')
s += IV(M(NB,'build','Landroid/app/Notification;'), 1) + MRO(1)
s += IV(M(NM,'notify','V','I','Landroid/app/Notification;'), 0, 8, 1)
s += RV
meth(NOTIFY, 'show', 'V', [CTX, 'I', STR, STR, 'I'], 0x9, 7, s, static=True)

CLASSES = [(MAIN, ACT), (WAKE, MAIN), (BRIDGE, OBJ), (NOTIFY, BR)]
FIELDS = [(BRIDGE, 'a', ACT)]

# ---------------- collect and sort ids ----------------
strings, types, protos, mids, fids = set(), set(), set(), set(), set()
def shorty(ret, params): return ''.join('L' if t[0] in 'L[' else t for t in (ret,) + tuple(params))
def add_type(t): types.add(t); strings.add(t)
def add_proto(ret, params):
    protos.add((ret, tuple(params))); strings.add(shorty(ret, params)); add_type(ret); [add_type(p) for p in params]
for c, sup in CLASSES: add_type(c); add_type(sup)
add_type(JSI)
for (c, n, t) in FIELDS: fids.add((c, n, t)); add_type(c); add_type(t); strings.add(n)
for m in methods:
    mids.add((m['cls'], m['name'], m['ret'], m['params'])); add_type(m['cls']); strings.add(m['name']); add_proto(m['ret'], m['params'])
    for w in m['code']:
        if isinstance(w, tuple):
            if w[0] == 'm': c, n, r, p = w[1]; mids.add(w[1]); add_type(c); strings.add(n); add_proto(r, p)
            elif w[0] == 'f': fids.add(w[1]); add_type(w[1][0]); add_type(w[1][2]); strings.add(w[1][1])
            elif w[0] == 't': add_type(w[1])
            elif w[0] == 's': strings.add(w[1])

def u16key(s): return s.encode('utf-16-be')
SL = sorted(strings, key=u16key); SI = {s: i for i, s in enumerate(SL)}
TL = sorted(types, key=lambda t: SI[t]); TI = {t: i for i, t in enumerate(TL)}
PL = sorted(protos, key=lambda p: (TI[p[0]], [TI[x] for x in p[1]])); PI_ = {p: i for i, p in enumerate(PL)}
FL = sorted(fids, key=lambda f: (TI[f[0]], SI[f[1]], TI[f[2]])); FI = {f: i for i, f in enumerate(FL)}
ML = sorted(mids, key=lambda m: (TI[m[0]], SI[m[1]], PI_[(m[2], m[3])])); MI = {m: i for i, m in enumerate(ML)}

def encode(code):
    pos, labels, items = 0, {}, []
    for w in code:
        if isinstance(w, tuple) and w[0] == 'label': labels[w[1]] = pos; continue
        items.append((pos, w)); pos += 1
    out = []
    for p, w in items:
        if isinstance(w, tuple):
            k = w[0]
            if k == 'm': out.append(MI[w[1]])
            elif k == 'f': out.append(FI[w[1]])
            elif k == 't': out.append(TI[w[1]])
            elif k == 's': out.append(SI[w[1]])
            elif k == 'lbl': out.append((labels[w[1]] - (p - 1)) & 0xffff)  # if-*: offset from the opcode word
            elif k == 'goto':
                off = labels[w[1]] - p; assert -128 <= off < 128; out.append(((off & 0xff) << 8) | 0x28)
        else: out.append(w)
    for v in out: assert 0 <= v <= 0xffff, v
    return out

def outs_of(code):
    o = 0
    for i, w in enumerate(code):
        if isinstance(w, int) and (w & 0xff) in (0x6e, 0x6f, 0x70, 0x71) and i + 1 < len(code) and isinstance(code[i+1], tuple) and code[i+1][0] == 'm':
            o = max(o, w >> 12)
    return o

# ---------------- layout ----------------
def align(b, n=4):
    while len(b) % n: b.append(0)

n_s, n_t, n_p, n_f, n_m, n_c = len(SL), len(TL), len(PL), len(FL), len(ML), len(CLASSES)
off = 0x70
string_ids_off = off; off += 4*n_s
type_ids_off = off; off += 4*n_t
proto_ids_off = off; off += 12*n_p
field_ids_off = off; off += 8*n_f
method_ids_off = off; off += 8*n_m
class_defs_off = off; off += 32*n_c
data_off = off
data = bytearray()
def doff(): return data_off + len(data)

code_offs = {}
for m in methods:
    align(data)
    insns = encode(m['code'])
    code_offs[(m['cls'], m['name'], m['ret'], m['params'])] = doff()
    data += struct.pack('<HHHHII', m['regs'], m['ins'], outs_of(m['code']), 0, 0, len(insns))
    data += b''.join(struct.pack('<H', v) for v in insns)
code_start = code_offs[min(code_offs, key=code_offs.get)]
n_code = len(methods)
align(data)
tl_start = doff(); tl_offs = {}; n_tl = 0
for p in PL:
    if p[1] and p[1] not in tl_offs:
        align(data); tl_offs[p[1]] = doff(); n_tl += 1
        data += struct.pack('<I', len(p[1])) + b''.join(struct.pack('<H', TI[x]) for x in p[1])
sd_start = doff(); sd_offs = []
for s_ in SL:
    sd_offs.append(doff()); b = s_.encode('utf-8'); data += uleb(len(s_)) + b + b'\x00'
# one runtime-visible @JavascriptInterface annotation, shared by every Bridge method
ann_item_off = doff(); data += bytes([0x01]) + uleb(TI[JSI]) + uleb(0)
align(data); ann_set_off = doff(); data += struct.pack('<II', 1, ann_item_off)
align(data); ann_dir_off = doff()
annotated = sorted([MI[(m['cls'], m['name'], m['ret'], m['params'])] for m in methods if m['ann']])
data += struct.pack('<IIII', 0, 0, len(annotated), 0) + b''.join(struct.pack('<II', mi, ann_set_off) for mi in annotated)
cd_start = doff(); cd_offs = {}
for c, sup in CLASSES:
    cd_offs[c] = doff()
    ms = [m for m in methods if m['cls'] == c]
    direct = sorted([m for m in ms if m['access'] & 0x10008 or m['name'] == '<init>'], key=lambda m: MI[(m['cls'], m['name'], m['ret'], m['params'])])
    virt = sorted([m for m in ms if m not in direct], key=lambda m: MI[(m['cls'], m['name'], m['ret'], m['params'])])
    fs = sorted([f for f in FL if f[0] == c], key=lambda f: FI[f])
    b = uleb(0) + uleb(len(fs)) + uleb(len(direct)) + uleb(len(virt))
    prev = 0
    for f in fs: b += uleb(FI[f] - prev) + uleb(0x2); prev = FI[f]
    for group in (direct, virt):
        prev = 0
        for m in group:
            k = (m['cls'], m['name'], m['ret'], m['params']); mi = MI[k]
            b += uleb(mi - prev) + uleb(m['access']) + uleb(code_offs[k]); prev = mi
    data += b
align(data); map_off = doff()
entries = [(0x0000, 1, 0), (0x0001, n_s, string_ids_off), (0x0002, n_t, type_ids_off), (0x0003, n_p, proto_ids_off)]
if n_f: entries.append((0x0004, n_f, field_ids_off))
entries += [(0x0005, n_m, method_ids_off), (0x0006, n_c, class_defs_off),
            (0x2001, n_code, code_start), (0x1001, n_tl, tl_start), (0x2002, n_s, sd_start),
            (0x2004, 1, ann_item_off), (0x1003, 1, ann_set_off), (0x2006, 1, ann_dir_off),
            (0x2000, n_c, cd_start), (0x1000, 1, map_off)]
entries.sort(key=lambda e: e[2])
data += struct.pack('<I', len(entries)) + b''.join(struct.pack('<HHII', t, 0, n, o) for t, n, o in entries)
align(data)

ids = bytearray()
for o in sd_offs: ids += struct.pack('<I', o)
for t in TL: ids += struct.pack('<I', SI[t])
for p in PL: ids += struct.pack('<III', SI[shorty(*p)], TI[p[0]], tl_offs.get(p[1], 0) if p[1] else 0)
for f in FL: ids += struct.pack('<HHI', TI[f[0]], TI[f[2]], SI[f[1]])
for m in ML: ids += struct.pack('<HHI', TI[m[0]], PI_[(m[2], m[3])], SI[m[1]])
for c, sup in CLASSES:
    ids += struct.pack('<IIIIIIII', TI[c], 0x1, TI[sup], 0, 0xffffffff, ann_dir_off if c == BRIDGE else 0, cd_offs[c], 0)
assert 0x70 + len(ids) == data_off
body = bytes(ids) + bytes(data)
size = 0x70 + len(body)
hdr = bytearray(b'dex\n035\x00') + bytes(24)
hdr += struct.pack('<' + 'I'*20, size, 0x70, 0x12345678, 0, 0, map_off,
                   n_s, string_ids_off, n_t, type_ids_off, n_p, proto_ids_off, n_f, field_ids_off,
                   n_m, method_ids_off, n_c, class_defs_off, len(data), data_off)
dex = bytearray(hdr + body)
assert len(hdr) == 0x70
dex[12:32] = hashlib.sha1(dex[32:]).digest()
dex[8:12] = struct.pack('<I', zlib.adler32(bytes(dex[12:])) & 0xffffffff)
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'classes.dex')
open(out, 'wb').write(dex)
print('dex', len(dex), 'bytes ->', out)
