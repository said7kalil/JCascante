import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/montserrat/800.css';
import {FPS, Shot, SHOTS, starts, TOTAL} from './shots';

const BOX_W = 1080, BOX_H = 1152, BOX_TOP = 300;
const PIC_TOP = 56; // la imagen limpia empieza en y≈56 del video 1280x720

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

const Cam: React.FC<{shot: Shot; muted?: boolean; blur?: boolean}> = ({shot, muted, blur}) => {
  const f = useCurrentFrame();
  const n = Math.round(shot.dur * FPS);
  const maxY = shot.maxY ?? 675;
  const zoom = interpolate(f, [0, n], [shot.z0, shot.z1], {easing: Easing.out(Easing.quad)});
  // "punch" de entrada en cada corte
  const punch = interpolate(f, [0, 7], [1.12, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const shake = shot.shake ? {x: Math.sin(f * 2.3) * 9, y: Math.cos(f * 3.1) * 9} : {x: 0, y: 0};
  const base = Math.max(BOX_H / (maxY - PIC_TOP), BOX_W / 1280);
  const s = Math.max(BOX_H / 620, base) * zoom * punch;
  const left = clamp(BOX_W / 2 - shot.fx * s + shake.x, BOX_W - 1280 * s, 0);
  const top = clamp(BOX_H / 2 - shot.fy * s + shake.y, BOX_H - maxY * s, -PIC_TOP * s);
  const fadeIn = interpolate(f, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [n - 4, n], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <OffthreadVideo
      src={staticFile(`clips/c${shot.clip}.mp4`)}
      startFrom={Math.round(shot.t * FPS)}
      muted={muted}
      volume={Math.min(fadeIn, fadeOut)}
      style={{position: 'absolute', left: blur ? undefined : left, top: blur ? undefined : top, width: 1280, height: 720, transformOrigin: '0 0', transform: blur ? undefined : `scale(${s})`}}
    />
  );
};

const Caption: React.FC<{text: string; big?: boolean}> = ({text, big}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1490, height: 330, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '0 22px', fontFamily: 'Anton, "Noto Color Emoji", sans-serif', fontSize: big ? 118 : 104, lineHeight: 1.12, textAlign: 'center'}}>
      {words.map((w, i) => {
        const hl = w.startsWith('*') || w.includes('*');
        const clean = w.replace(/\*/g, '');
        const sc = spring({frame: f - 2 - i * 2, fps, config: {damping: 9, stiffness: 190}});
        return (
          <span key={i} style={{display: 'inline-block', transform: `scale(${sc}) rotate(${(1 - sc) * -6}deg)`, color: hl ? '#FFE600' : '#fff', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', textShadow: '0 8px 0 #000, 0 14px 24px rgba(0,0,0,.6)'}}>
            {clean}
          </span>
        );
      })}
    </div>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sc = spring({frame: f, fps, config: {damping: 8}});
  const pulse = 1 + Math.sin(f / 4) * 0.04;
  return (
    <div style={{position: 'absolute', top: 1500, left: 0, right: 0, textAlign: 'center', transform: `scale(${sc * pulse})`}}>
      <div style={{display: 'inline-block', background: '#FFE600', color: '#000', fontFamily: 'Anton, "Noto Color Emoji"', fontSize: 84, padding: '18px 44px', borderRadius: 28, boxShadow: '0 10px 0 #000'}}>
        SUSCRÍBETE PARA LA PARTE 2 👉
      </div>
      <div style={{marginTop: 26, fontFamily: 'Anton, "Noto Color Emoji"', fontSize: 64, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill'}}>
        ¿CON QUIÉN TE QUEDAS? 👇 COMENTA
      </div>
    </div>
  );
};

const ShotView: React.FC<{shot: Shot}> = ({shot}) => {
  const f = useCurrentFrame();
  const n = Math.round(shot.dur * FPS);
  const flash = shot.flash ? interpolate(f, [0, 8], [0.9, 0], {extrapolateRight: 'clamp'}) : 0;
  const ctaStart = n - 54;
  return (
    <AbsoluteFill>
      {/* fondo desenfocado */}
      <AbsoluteFill style={{overflow: 'hidden', filter: 'blur(38px) brightness(.55) saturate(1.3)', transform: 'scale(1.1)'}}>
        <div style={{position: 'absolute', left: -1000, top: -250, width: 1280, height: 720, transform: 'scale(3.4)', transformOrigin: '0 0'}}>
          <OffthreadVideo src={staticFile(`clips/c${shot.clip}.mp4`)} startFrom={Math.round(shot.t * FPS)} muted style={{width: 1280, height: 720}} />
        </div>
      </AbsoluteFill>
      {/* caja principal con cámara virtual */}
      <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: BOX_W, height: BOX_H, overflow: 'hidden', borderRadius: 36, boxShadow: '0 20px 60px rgba(0,0,0,.65)', border: shot.hook ? '8px solid #FFE600' : '6px solid rgba(255,255,255,.9)'}}>
        <Cam shot={shot} />
        <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      </div>
      {/* chip superior */}
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '14px 34px', borderRadius: 100, letterSpacing: 2}}>
          {shot.hook ? '⚠️ ESPERA AL FINAL ⚠️' : '3 FAMILIAS · VIAJE A QUITO'}
        </div>
      </div>
      {shot.cta ? (
        <>
          <Sequence durationInFrames={ctaStart}><Caption text={shot.caption} /></Sequence>
          <Sequence from={ctaStart}><Cta /></Sequence>
        </>
      ) : (
        <Caption text={shot.caption} big={shot.hook} />
      )}
    </AbsoluteFill>
  );
};

export const Viral: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={Math.round(s.dur * FPS)}>
          <ShotView shot={s} />
        </Sequence>
      ))}
      {/* barra de progreso */}
      <div style={{position: 'absolute', top: 0, left: 0, height: 14, width: `${(f / TOTAL) * 100}%`, background: '#FFE600'}} />
      {/* audio: cama musical + SFX */}
      <Audio src={staticFile('audio/beat.wav')} volume={(fr) => 0.13 * interpolate(fr, [TOTAL - 30, TOTAL], [1, 0], {extrapolateLeft: 'clamp'})} />
      <Sequence from={0}><Audio src={staticFile('audio/boom.wav')} volume={0.9} /></Sequence>
      {SHOTS.map((s, i) => i > 0 && (
        <Sequence key={`w${i}`} from={starts[i] - 4}><Audio src={staticFile('audio/whoosh.wav')} volume={0.3} /></Sequence>
      ))}
      {SHOTS.map((s, i) => (
        <Sequence key={`p${i}`} from={starts[i] + 3}><Audio src={staticFile('audio/pop.wav')} volume={0.35} /></Sequence>
      ))}
      {SHOTS.map((s, i) => s.riser && (
        <Sequence key={`r${i}`} from={starts[i] + Math.round(s.dur * FPS) - 48}><Audio src={staticFile('audio/riser.wav')} volume={0.5} /></Sequence>
      ))}
      {SHOTS.map((s, i) => (s.flash && i > 0) && (
        <Sequence key={`b${i}`} from={starts[i]}><Audio src={staticFile('audio/boom.wav')} volume={0.6} /></Sequence>
      ))}
      <Sequence from={starts[SHOTS.length - 1] + Math.round(SHOTS[SHOTS.length - 1].dur * FPS) - 54}>
        <Audio src={staticFile('audio/ding.wav')} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};
