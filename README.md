# [Nama Proyek] — Visualisasi Interaktif Soal Gerak Fisika

![status](https://img.shields.io/badge/status-under%20development-yellow)

> Dibangun untuk HackTHON UGM — kategori Education

## Masalah

Siswa SMA Indonesia belajar soal cerita fisika (gerak lurus, gerak parabola) hanya dari gambar statis di buku cetak. Proses "dari soal ke jawaban" tidak pernah terlihat bergerak — siswa harus membayangkan sendiri bagaimana suatu objek bergerak dari deskripsi teks dan angka.

## Solusi

**[Nama Proyek]** mengubah soal cerita fisika menjadi **animasi interaktif** yang menunjukkan proses penyelesaian secara visual, tersinkron dengan langkah solusi matematisnya. Siswa bisa mengganti angka soal sendiri dan langsung melihat bagaimana animasi serta jawabannya berubah.

## Kenapa ini beda dari PhET / GeoGebra

PhET dan GeoGebra adalah *simulator umum* — siswa harus sudah paham konsep untuk bisa menyusun simulasinya sendiri. **[Nama Proyek]** sebaliknya: siswa cukup memasukkan angka dari soal yang sedang mereka kerjakan (mis. dari buku atau latihan UTBK), dan sistem otomatis menghasilkan diagram, animasi, serta langkah solusi yang sesuai dengan soal tersebut.

## Fitur utama

- Input soal berbasis template (GLB, GLBB, gerak parabola/proyektil)
- Animasi trajectory objek sesuai angka yang diinput
- Panel langkah solusi yang tersinkron dengan waktu animasi
- Mode eksplorasi: ubah satu variabel, lihat animasi & jawaban berubah instan

## Tech stack

- Frontend: React + Vite
- Rendering: SVG/Canvas native + requestAnimationFrame
- Physics logic: JavaScript murni (pure functions, lihat `/engine`)

## Struktur folder


## Cara menjalankan

```bash
# Physics engine (test standalone)
cd engine
node physics-engine.js

# Frontend (setelah setup — lihat frontend/README.md)
cd frontend
npm install
npm run dev
```

## Tim

- [Nama kamu] — [role]
- [Nama teman 1] — Frontend
- [Nama teman 2] — Backend

## Status pengembangan

🚧 Aktif dikembangkan untuk submission HackTHON UGM.
