# Short viral con Remotion (3 Familias – Viaje a Quito)

Short vertical 1080x1920 (<60 s): cortes, zoom con cámara virtual, subtítulos animados, SFX y cama musical sintética.

1. `npm i`
2. `npm run prepare:clips -- clip1.mp4 clip2.mp4 clip3.mp4 clip4.mp4 clip5.mp4` (orden 4.04.34 → 4.08.35)
3. `npm run sfx` (genera `public/audio/*`)
4. `npm run studio` para editar / `npm run render` para exportar.

La edición se controla desde `src/shots.ts` (clip, segundo, zoom, enfoque, texto).
