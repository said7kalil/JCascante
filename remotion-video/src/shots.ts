export const FPS = 30;
export type Shot = {
  clip: 1 | 2 | 3 | 4 | 5;
  t: number; // segundo de inicio dentro del clip normalizado
  dur: number; // duración en segundos
  fx: number; fy: number; // punto de enfoque (px del video 1280x720)
  z0: number; z1: number; // zoom inicial -> final
  maxY?: number; // límite inferior de la imagen limpia (evita overlays del grabador / miniatura)
  caption: string; // *palabra* = resaltada en amarillo
  flash?: boolean; shake?: boolean; hook?: boolean; cta?: boolean;
  riser?: boolean;
};

export const SHOTS: Shot[] = [
  {clip: 5, t: 7.6, dur: 2.4, fx: 760, fy: 340, z0: 1.15, z1: 1.5, caption: 'NADIE ESPERABA *ESTO* EN EL VUELO ✈️😱', flash: true, shake: true, hook: true},
  {clip: 2, t: 1.6, dur: 2.8, fx: 520, fy: 400, z0: 1.0, z1: 1.2, caption: 'TODO EMPEZÓ EN EL *AEROPUERTO* 🛃'},
  {clip: 2, t: 4.6, dur: 2.6, fx: 560, fy: 400, z0: 1.1, z1: 1.3, caption: 'Y LA FAMILIA LLEGÓ CON *DRAMA* 🎭'},
  {clip: 2, t: 7.6, dur: 1.8, fx: 430, fy: 330, z0: 1.4, z1: 1.6, caption: '¿ESO FUE UN *SECRETO*? 🤫'},
  {clip: 3, t: 1.4, dur: 3.0, fx: 640, fy: 360, z0: 1.1, z1: 1.3, caption: 'DE REPENTE… UNA *CAJA* MISTERIOSA 📦👀'},
  {clip: 3, t: 36.4, dur: 3.6, fx: 700, fy: 330, z0: 1.2, z1: 1.4, maxY: 600, caption: 'SEGURIDAD SE CONVIRTIÓ EN UN *RING* 🥊', shake: true},
  {clip: 3, t: 18.6, dur: 3.0, fx: 640, fy: 330, z0: 1.2, z1: 1.35, maxY: 625, caption: 'MIENTRAS TANTO, EN EL *AVIÓN*… ✈️🏃‍♀️'},
  {clip: 4, t: 3.4, dur: 2.8, fx: 640, fy: 330, z0: 1.1, z1: 1.3, maxY: 585, caption: 'ÉL ENTRÓ MUY *TRANQUILO* 😎'},
  {clip: 4, t: 12.0, dur: 3.4, fx: 640, fy: 340, z0: 1.15, z1: 1.4, maxY: 585, caption: 'Y ELLA LO MIRÓ… 👀 *ESA* MIRADA 😬', riser: true},
  {clip: 5, t: 0.8, dur: 3.2, fx: 520, fy: 330, z0: 1.3, z1: 1.55, caption: 'Y ENTONCES… SE ARMÓ *LA GRANDE* 🔥', flash: true},
  {clip: 5, t: 4.0, dur: 3.2, fx: 700, fy: 340, z0: 1.3, z1: 1.6, caption: 'NADIE SE *SOLTABA* 😂💥', shake: true},
  {clip: 5, t: 21.0, dur: 2.6, fx: 520, fy: 340, z0: 1.1, z1: 1.3, caption: '¿Y LA SEÑORA DEL *LEOPARDO*? 🐆'},
  {clip: 5, t: 24.8, dur: 4.2, fx: 520, fy: 340, z0: 1.15, z1: 1.35, caption: 'LLEGÓ A VER EL *CHISME* ☕😂', cta: true},
];
export const starts = SHOTS.reduce<number[]>((a, s, i) => {
  a.push(i === 0 ? 0 : a[i - 1] + Math.round(SHOTS[i - 1].dur * FPS));
  return a;
}, []);
export const TOTAL = starts[SHOTS.length - 1] + Math.round(SHOTS[SHOTS.length - 1].dur * FPS);
