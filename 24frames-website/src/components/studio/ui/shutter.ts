/* A soft camera-shutter click, synthesised with Web Audio — no asset to
   load. Two short filtered noise bursts: the first curtain, then the
   mirror settling. Always started from a user gesture, so it is allowed
   on iPad Safari. Fails silently anywhere audio is unavailable. */
type AC = typeof AudioContext;
let ctx: AudioContext | null = null;

function audio() {
  const Ctor: AC | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBurst(c: AudioContext, t: number, dur: number, freq: number, gain: number) {
  const len = Math.ceil(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 1.4;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
}

/** A small, solid lock click: the key turning, then the shackle releasing. */
export function lockClick() {
  try {
    const c = audio();
    if (!c) return;
    const t = c.currentTime + 0.005;
    noiseBurst(c, t, 0.018, 2600, 0.3);
    noiseBurst(c, t + 0.09, 0.03, 1200, 0.32);
  } catch {
    /* no audio */
  }
}

export function shutter() {
  try {
    const c0 = audio();
    if (!c0) return;
    const c = c0;
    const t = c.currentTime + 0.005;
    const burst = (at: number, dur: number, freq: number, gain: number) => {
      const len = Math.ceil(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = freq;
      bp.Q.value = 0.8;
      const g = c.createGain();
      g.gain.value = gain;
      src.connect(bp).connect(g).connect(c.destination);
      src.start(t + at);
    };
    burst(0, 0.03, 3600, 0.35);
    burst(0.065, 0.055, 1700, 0.28);
  } catch {
    /* no audio — the click is a nicety */
  }
}
