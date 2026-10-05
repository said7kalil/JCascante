"""Genera SFX y una cama musical sintética (sin copyright) en public/audio/."""
import numpy as np, wave, os
SR = 44100
os.makedirs("public/audio", exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x):
    x = np.clip(x, -1, 1)
    with wave.open(f"public/audio/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())

def t(d): return np.arange(int(SR * d)) / SR

def lp(x, k):  # simple moving-average low-pass
    return np.convolve(x, np.ones(k) / k, mode="same")

# whoosh: ruido con barrido y envolvente
d = .45; tt = t(d); n = rng.standard_normal(len(tt))
sweep = lp(n, 40) * np.sin(np.pi * tt / d) ** 2
save("whoosh", sweep * 2.2)

# boom: seno cayendo + golpe de ruido
d = 1.0; tt = t(d)
f = 90 * np.exp(-tt * 5) + 38
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
boom += lp(rng.standard_normal(len(tt)), 12) * np.exp(-tt * 25) * .8
save("boom", boom * .95)

# pop (aparición de texto)
d = .12; tt = t(d)
save("pop", np.sin(2 * np.pi * (500 + 1800 * tt) * tt) * np.exp(-tt * 38) * .8)

# ding (CTA)
d = .8; tt = t(d)
save("ding", (np.sin(2 * np.pi * 1318 * tt) + .5 * np.sin(2 * np.pi * 1975 * tt)) * np.exp(-tt * 6) * .5)

# riser (tensión antes del clímax)
d = 1.6; tt = t(d)
f = 200 + 1400 * (tt / d) ** 2
save("riser", lp(rng.standard_normal(len(tt)), 6) * (tt / d) ** 1.5 * .6 + np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / d) ** 2 * .35)

# cama musical: 110 BPM, kick + hat + bajo menor, 48 s
bpm = 110; beat = 60 / bpm; dur = 48; out = np.zeros(int(SR * dur))
bass = [55, 55, 65.4, 49]  # A1 A1 C2 G1 por compás
for b in range(int(dur / beat)):
    s = int(b * beat * SR)
    # kick en cada tiempo
    k = t(.3); kf = 110 * np.exp(-k * 18) + 42
    kick = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-k * 9)
    out[s:s + len(kick)] += kick[: len(out) - s] * .9
    # hat a contratiempo
    h = lp(rng.standard_normal(int(SR * .05)), 2) - lp(rng.standard_normal(int(SR * .05)), 30)
    hs = s + int(beat * SR / 2)
    hh = h * np.exp(-t(.05) * 60)
    if hs + len(hh) < len(out): out[hs:hs + len(hh)] += hh * .35
    # bajo
    note = bass[(b // 4) % 4]; bt = t(beat * .9)
    bs = np.sin(2 * np.pi * note * bt) + .4 * np.sin(2 * np.pi * note * 2 * bt)
    bs *= np.exp(-bt * 3.5)
    out[s:s + len(bs)] += bs[: len(out) - s] * .5
save("beat", out * .8)
print("audio ok")
