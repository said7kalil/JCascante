#!/usr/bin/env bash
# Normaliza las 5 grabaciones a 1280x720 / 30fps constantes (seek rápido en Remotion).
# Uso: bash scripts/prepare-clips.sh clip1.mp4 clip2.mp4 clip3.mp4 clip4.mp4 clip5.mp4
# (en orden cronológico de grabación: 4.04.34, 4.05.10, 4.06.14, 4.07.16, 4.08.35)
set -e
mkdir -p public/clips
i=1
for f in "$@"; do
  ffmpeg -y -v error -i "$f" -vf "fps=30,scale=1280:720" -c:v libx264 -preset fast -crf 17 -g 15 \
    -pix_fmt yuv420p -c:a aac -ar 48000 -b:a 192k "public/clips/c$i.mp4"
  i=$((i+1))
done
