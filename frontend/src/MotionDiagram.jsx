import React from 'react';

/**
 * MOTION DIAGRAM - Render diagram statis lintasan gerak
 * ============================================================
 * Komponen ini GENERIK: menerima output apapun dari physics-engine.js
 * (GLB, GLBB, PROJECTILE_SINGLE, PROJECTILE_RENDEZVOUS) dan otomatis
 * tau cara menggambarnya, karena semua tipe soal punya kontrak
 * output yang sama (lihat physics-engine.js).
 *
 * TAHAP INI: statis, tampilkan lintasan penuh + titik awal & akhir.
 * Animasi (objek bergerak real-time) ditambahkan di tahap berikutnya
 * dengan MENGGUNAKAN ULANG semua logic scaling di file ini.
 */

const PADDING = 40;
const VIEW_W = 640;
const VIEW_H = 360;

// ============================================================
// Ubah hasil engine jadi daftar "objek" dengan titik-titik lintasan
// dalam koordinat fisika (meter), bukan koordinat layar.
// ============================================================
function getObjectPaths(result) {
  const { type, timeline } = result;

  switch (type) {
    case 'GLB':
    case 'GLBB':
      return [
        {
          label: 'Objek',
          color: '#2563eb',
          points: timeline.map((f) => ({ x: f.x, y: 0 })),
        },
      ];

    case 'PROJECTILE_SINGLE':
      return [
        {
          label: 'Objek',
          color: '#2563eb',
          points: timeline.map((f) => ({ x: f.x, y: f.y })),
        },
      ];

    case 'PROJECTILE_RENDEZVOUS':
      return [
        {
          label: 'Benda A',
          color: '#dc2626',
          points: timeline.map((f) => ({ x: f.ax, y: f.ay })),
        },
        {
          label: 'Benda B',
          color: '#2563eb',
          points: timeline.map((f) => ({ x: f.bx, y: 0 })),
        },
      ];

    default:
      return [];
  }
}

// ============================================================
// Hitung skala biar semua titik dari semua objek muat di viewBox,
// dengan skala X dan Y SAMA (uniform) supaya bentuk lintasan tidak
// terdistorsi. Ini penting untuk akurasi visual soal fisika.
// ============================================================
function computeScale(objects) {
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  objects.forEach((obj) => {
    obj.points.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
  });

  // Minimum rentang 1 meter, biar soal GLB (yang tidak punya
  // pergerakan vertikal sama sekali) tetap punya "ruang visual"
  // untuk digambar, bukan pipih sempurna.
  const rangeX = Math.max(maxX - minX, 1);
  const rangeY = Math.max(maxY - minY, 1);

  const availableW = VIEW_W - PADDING * 2;
  const availableH = VIEW_H - PADDING * 2;

  const scale = Math.min(availableW / rangeX, availableH / rangeY);

  return { minX, maxX, minY, maxY, scale };
}

// Konversi satu titik koordinat fisika (meter) ke koordinat SVG (piksel)
function toSvgCoords(point, bounds) {
  const { minX, scale } = bounds;
  const groundY = VIEW_H - PADDING;
  const svgX = PADDING + (point.x - minX) * scale;
  const svgY = groundY - point.y * scale; // sumbu Y dibalik: makin tinggi makin ke atas
  return { svgX, svgY };
}

export default function MotionDiagram({ result }) {
  if (!result) return null;

  const objects = getObjectPaths(result);
  if (objects.length === 0) {
    return <p style={{ color: '#999' }}>Tipe soal belum didukung diagram.</p>;
  }

  const bounds = computeScale(objects);
  const groundY = VIEW_H - PADDING;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      style={{ width: '100%', maxWidth: 640, background: '#fafafa', border: '1px solid #ddd', borderRadius: 8 }}
    >
      {/* Garis tanah */}
      <line x1={0} y1={groundY} x2={VIEW_W} y2={groundY} stroke="#333" strokeWidth="2" />

      {objects.map((obj, i) => {
        const svgPoints = obj.points.map((p) => toSvgCoords(p, bounds));
        const pathD = svgPoints
          .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.svgX.toFixed(1)} ${p.svgY.toFixed(1)}`)
          .join(' ');

        const start = svgPoints[0];
        const end = svgPoints[svgPoints.length - 1];

        return (
          <g key={obj.label}>
            {/* Lintasan (garis putus-putus) */}
            <path
              d={pathD}
              fill="none"
              stroke={obj.color}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.6"
            />

            {/* Titik awal */}
            <circle cx={start.svgX} cy={start.svgY} r="8" fill={obj.color} />
            <text x={start.svgX} y={start.svgY - 14} textAnchor="middle" fontSize="12" fill={obj.color}>
              {obj.label} (mulai)
            </text>

            {/* Titik akhir */}
            <circle cx={end.svgX} cy={end.svgY} r="8" fill={obj.color} opacity="0.4" />
            <text x={end.svgX} y={end.svgY - 14} textAnchor="middle" fontSize="12" fill={obj.color}>
              {obj.label} (akhir)
            </text>
          </g>
        );
      })}
    </svg>
  );
}
