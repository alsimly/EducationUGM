/**
 * PHYSICS ENGINE - Mesin Fisika untuk Visualisasi Soal Gerak
 * ============================================================
 * Prinsip desain: setiap fungsi solve* itu PURE FUNCTION.
 * Input: variabel yang diketahui dari soal.
 * Output: { known, computed, timeline, steps }
 *
 * Kontrak output ini SAMA untuk semua tipe soal, biar frontend
 * cuma perlu satu cara buat render apapun tipe soalnya.
 *
 * - known    : variabel yang diinput user
 * - computed : hasil perhitungan (jawaban akhir)
 * - timeline : array posisi objek per waktu, buat animasi frame-by-frame
 * - steps    : array langkah solusi, masing-masing punya "atProgress"
 *              (0 sampai 1) biar frontend tau kapan step ini muncul
 *              relatif terhadap animasi yang lagi jalan
 */

const G_DEFAULT = 10; // m/s^2, konvensi umum soal SMA Indonesia

// ============================================================
// HELPER: generate frame posisi dari fungsi posisi(t)
// ============================================================
function generateFrames(positionFn, tMax, dt = 0.02) {
  const frames = [];
  for (let t = 0; t <= tMax + 1e-9; t += dt) {
    frames.push({ t: round(t), ...positionFn(t) });
  }
  return frames;
}

function round(n, decimals = 3) {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

// ============================================================
// TIPE SOAL 1: GLB (Gerak Lurus Beraturan)
// v konstan, x(t) = x0 + v*t
// ============================================================
function solveGLB({ v, t, x0 = 0, dt = 0.05 }) {
  const jarakTotal = round(v * t);

  const timeline = generateFrames((tt) => ({ x: round(x0 + v * tt) }), t, dt);

  const steps = [
    {
      atProgress: 0,
      title: "Identifikasi besaran diketahui",
      formula: `v = ${v} m/s, t = ${t} s`,
      explanation: "Kecepatan konstan (tidak ada percepatan), waktu tempuh diketahui.",
    },
    {
      atProgress: 0.4,
      title: "Terapkan rumus GLB",
      formula: "x = v × t",
      explanation: "Karena kecepatan tetap, jarak tinggal dikali waktu.",
    },
    {
      atProgress: 1,
      title: "Hasil akhir",
      formula: `x = ${v} × ${t} = ${jarakTotal} m`,
      explanation: `Objek menempuh jarak ${jarakTotal} meter dalam ${t} detik.`,
    },
  ];

  return {
    type: "GLB",
    known: { v, t, x0 },
    computed: { jarakTotal },
    timeline,
    steps,
  };
}

// ============================================================
// TIPE SOAL 2: GLBB (Gerak Lurus Berubah Beraturan)
// x(t) = x0 + v0*t + 0.5*a*t^2
// v(t) = v0 + a*t
// ============================================================
function solveGLBB({ v0, a, t, x0 = 0, dt = 0.05 }) {
  const posisiAkhir = round(x0 + v0 * t + 0.5 * a * t * t);
  const kecepatanAkhir = round(v0 + a * t);

  const timeline = generateFrames(
    (tt) => ({
      x: round(x0 + v0 * tt + 0.5 * a * tt * tt),
      v: round(v0 + a * tt),
    }),
    t,
    dt
  );

  const steps = [
    {
      atProgress: 0,
      title: "Identifikasi besaran diketahui",
      formula: `v0 = ${v0} m/s, a = ${a} m/s², t = ${t} s`,
      explanation: "Ada percepatan, jadi kecepatan berubah terhadap waktu.",
    },
    {
      atProgress: 0.3,
      title: "Hitung posisi akhir",
      formula: "x = v0·t + ½·a·t²",
      explanation: "Rumus posisi GLBB memperhitungkan kontribusi percepatan.",
    },
    {
      atProgress: 0.6,
      title: "Substitusi angka",
      formula: `x = ${v0}(${t}) + 0.5(${a})(${t})² = ${posisiAkhir} m`,
      explanation: "Masukkan angka yang diketahui ke rumus.",
    },
    {
      atProgress: 1,
      title: "Hasil akhir",
      formula: `x = ${posisiAkhir} m, v akhir = ${kecepatanAkhir} m/s`,
      explanation: `Setelah ${t} detik, objek berada di posisi ${posisiAkhir} m dengan kecepatan ${kecepatanAkhir} m/s.`,
    },
  ];

  return {
    type: "GLBB",
    known: { v0, a, t, x0 },
    computed: { posisiAkhir, kecepatanAkhir },
    timeline,
    steps,
  };
}

// ============================================================
// TIPE SOAL 3: Proyektil tunggal (gerak parabola horizontal)
// Diluncurkan horizontal dari ketinggian y0 dengan kecepatan v0
// t_jatuh = sqrt(2*y0/g)
// x(t) = v0*t
// y(t) = y0 - 0.5*g*t^2
// ============================================================
function solveProjectileSingle({ v0, y0, g = G_DEFAULT, dt = 0.02 }) {
  const tJatuh = round(Math.sqrt((2 * y0) / g));
  const xJatuh = round(v0 * tJatuh);

  const timeline = generateFrames(
    (tt) => ({
      x: round(v0 * tt),
      y: round(y0 - 0.5 * g * tt * tt),
    }),
    tJatuh,
    dt
  );

  const steps = [
    {
      atProgress: 0,
      title: "Identifikasi besaran diketahui",
      formula: `v0 = ${v0} m/s, y0 = ${y0} m, g = ${g} m/s²`,
      explanation: "Objek diluncurkan horizontal dari ketinggian y0.",
    },
    {
      atProgress: 0.35,
      title: "Cari waktu jatuh (gerak vertikal)",
      formula: "t = √(2·y0 / g)",
      explanation: "Gerak vertikal murni GLBB (jatuh bebas), tidak dipengaruhi kecepatan horizontal.",
    },
    {
      atProgress: 0.6,
      title: "Substitusi angka",
      formula: `t = √(2 × ${y0} / ${g}) = ${tJatuh} s`,
      explanation: "Ini waktu total sampai objek menyentuh tanah.",
    },
    {
      atProgress: 1,
      title: "Cari jarak horizontal",
      formula: `x = v0 × t = ${v0} × ${tJatuh} = ${xJatuh} m`,
      explanation: `Objek jatuh ${xJatuh} m dari titik peluncuran setelah ${tJatuh} detik.`,
    },
  ];

  return {
    type: "PROJECTILE_SINGLE",
    known: { v0, y0, g },
    computed: { tJatuh, xJatuh },
    timeline,
    steps,
  };
}

// ============================================================
// TIPE SOAL 4: Dua benda bertemu (SESUAI GAMBAR REFERENSI)
// Benda A diluncurkan horizontal dari ketinggian y dengan v1,
// mendarat di titik C sejauh x dari dasar menara.
// Benda B mulai dari dasar menara, bergerak GLB dengan v2,
// harus sampai di C bersamaan dengan A.
//
// Karena gerak horizontal A itu GLB (v1 konstan), dan jarak
// horizontal yang ditempuh A pas mendarat = x (diberikan di soal),
// maka:  t_jatuh = x / v1
// lalu:  y = 0.5 * g * t_jatuh^2      (dari gerak vertikal A)
// lalu:  v2 = x / t_jatuh             (B harus tempuh x dalam waktu sama)
// ============================================================
function solveProjectileRendezvous({ v1, x, g = G_DEFAULT, dt = 0.02 }) {
  const tJatuh = round(x / v1);
  const y = round(0.5 * g * tJatuh * tJatuh);
  const v2 = round(x / tJatuh);

  // Timeline gabungan: posisi A (parabola) dan posisi B (GLB) tiap waktu t
  const timeline = generateFrames(
    (tt) => ({
      // Posisi A relatif ke titik lepas (atas menara)
      ax: round(v1 * tt),
      ay: round(y - 0.5 * g * tt * tt), // tinggi A dari tanah
      // Posisi B relatif ke dasar menara
      bx: round(v2 * tt),
    }),
    tJatuh,
    dt
  );

  const steps = [
    {
      atProgress: 0,
      title: "Identifikasi besaran diketahui",
      formula: `v1 = ${v1} m/s, x = ${x} m`,
      explanation:
        "A diluncurkan horizontal dari atas menara. B bergerak GLB dari dasar menara. Keduanya harus bertemu di titik C.",
    },
    {
      atProgress: 0.25,
      title: "Cari waktu jatuh dari gerak horizontal A",
      formula: "t = x / v1",
      explanation:
        "Gerak horizontal A adalah GLB (kecepatan v1 konstan), dan jarak yang ditempuh saat mendarat = x.",
    },
    {
      atProgress: 0.45,
      title: "Substitusi",
      formula: `t = ${x} / ${v1} = ${tJatuh} s`,
      explanation: "Ini adalah waktu total A melayang sampai menyentuh titik C.",
    },
    {
      atProgress: 0.65,
      title: "Cari tinggi menara (y) dari gerak vertikal A",
      formula: `y = ½·g·t² = 0.5 × ${g} × ${tJatuh}² = ${y} m`,
      explanation: "Gerak vertikal A murni jatuh bebas, dipengaruhi gravitasi saja.",
    },
    {
      atProgress: 1,
      title: "Cari kecepatan B (v2)",
      formula: `v2 = x / t = ${x} / ${tJatuh} = ${v2} m/s`,
      explanation: `Agar B sampai di C bersamaan dengan A, B harus bergerak dengan kecepatan ${v2} m/s.`,
    },
  ];

  return {
    type: "PROJECTILE_RENDEZVOUS",
    known: { v1, x, g },
    computed: { tJatuh, y, v2 },
    timeline,
    steps,
  };
}

// ============================================================
// SELF-TEST — validasi terhadap soal di gambar referensi
// v1 = 30 m/s, x = 12 m -> harus dapet t = 0.4 s, y = 0.8 m, v2 = 30 m/s
// ============================================================
function runSelfTest() {
  const hasil = solveProjectileRendezvous({ v1: 30, x: 12 });
  const expected = { tJatuh: 0.4, y: 0.8, v2: 30 };

  console.log("=== SELF TEST: Soal Referensi (Dua Benda Bertemu) ===");
  console.log("Computed:", hasil.computed);
  console.log("Expected:", expected);

  const cocok =
    hasil.computed.tJatuh === expected.tJatuh &&
    hasil.computed.y === expected.y &&
    hasil.computed.v2 === expected.v2;

  console.log(cocok ? "✅ LULUS - hasil sesuai perhitungan manual" : "❌ GAGAL - cek ulang rumus");
  console.log("Jumlah frame timeline:", hasil.timeline.length);
  console.log("Jumlah step solusi:", hasil.steps.length);
}

runSelfTest();

export {
  solveGLB,
  solveGLBB,
  solveProjectileSingle,
  solveProjectileRendezvous,
};
