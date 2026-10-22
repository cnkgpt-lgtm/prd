import type { Prd } from "./types";
import { idBaru } from "./store";

export type KunciTemplate = "blank" | "new_product" | "new_feature" | "improvement";

export interface InfoTemplate {
  kunci: KunciTemplate;
  nama: string;
  deskripsi: string;
}

export const DAFTAR_TEMPLATE: InfoTemplate[] = [
  {
    kunci: "blank",
    nama: "Kosong",
    deskripsi: "Mulai dari dokumen kosong, isi sendiri semua bagiannya.",
  },
  {
    kunci: "new_product",
    nama: "Produk Baru",
    deskripsi: "Untuk produk yang benar-benar baru, lengkap dengan arahan pengisian tiap bagian.",
  },
  {
    kunci: "new_feature",
    nama: "Fitur Baru",
    deskripsi: "Untuk menambah fitur pada produk yang sudah berjalan.",
  },
  {
    kunci: "improvement",
    nama: "Improvement",
    deskripsi: "Untuk perbaikan atau peningkatan produk/fitur yang sudah ada.",
  },
];

function dasar(judul: string, produk: string): Prd {
  const sekarang = new Date().toISOString();
  return {
    id: idBaru(),
    judul,
    produk,
    pemilik: "",
    versi: "1.0",
    status: "draft",
    overview: "",
    masalah: "",
    tujuan: "",
    targetPengguna: "",
    scope: "",
    outOfScope: "",
    nonFungsional: "",
    risiko: "",
    asumsi: "",
    fitur: [],
    stories: [],
    metrik: [],
    milestones: [],
    stakeholders: [],
    dibuatPada: sekarang,
    diubahPada: sekarang,
  };
}

export function buatDariTemplate(
  kunci: KunciTemplate,
  judul: string,
  produk: string
): Prd {
  const prd = dasar(judul, produk);
  const n = () => Math.random().toString(36).slice(2, 9);

  if (kunci === "new_product") {
    prd.overview =
      "Tuliskan ringkasan produk: apa produknya, untuk siapa, dan nilai utama yang ditawarkan. Produk ini adalah …";
    prd.masalah =
      "Jelaskan masalah yang dialami pengguna saat ini dan dampaknya bila tidak diselesaikan. Saat ini pengguna …";
    prd.tujuan =
      "1. Tujuan utama produk.\n2. Tujuan pendukung.\n3. Hasil yang ingin dicapai dalam 3–6 bulan pertama.";
    prd.targetPengguna =
      "Pengguna utama: …\nPengguna sekunder: …";
    prd.scope =
      "Termasuk dalam v1.0: fitur inti yang wajib ada pada rilis pertama.";
    prd.outOfScope =
      "Tidak termasuk dalam v1.0: hal-hal yang sengaja ditunda ke versi berikutnya.";
    prd.nonFungsional =
      "Bahasa antarmuka: Bahasa Indonesia. Performa: halaman terbuka < 2 detik. Responsif di HP dan desktop.";
    prd.risiko =
      "1. Risiko: … Mitigasi: …";
    prd.asumsi =
      "1. Asumsi yang dipakai dalam dokumen ini: …";
    prd.fitur = [
      {
        id: n(),
        nama: "Fitur inti pertama",
        deskripsi: "Jelaskan fungsi fitur ini dan manfaatnya bagi pengguna.",
        prioritas: "Must Have",
      },
    ];
    prd.stories = [
      {
        id: n(),
        sebagai: "pengguna utama",
        ingin: "melakukan hal terpenting di produk ini",
        agar: "kebutuhan utamanya terpenuhi",
        kriteria: "Syarat yang harus terpenuhi agar story ini dianggap selesai.",
      },
    ];
    prd.metrik = [
      {
        id: n(),
        nama: "Metrik keberhasilan utama",
        target: "Tuliskan target terukur, mis. ≥ 80%",
        deskripsi: "Cara mengukur metrik ini dan kapan dievaluasi.",
      },
    ];
    prd.milestones = [
      {
        id: n(),
        fase: "Fase 1 — Fondasi",
        waktu: "Tuliskan target waktu",
        deskripsi: "Lingkup pekerjaan pada fase ini.",
      },
    ];
    prd.stakeholders = [
      {
        id: n(),
        nama: "",
        peran: "Product Owner",
        tanggungJawab: "Menentukan prioritas dan menyetujui PRD sebelum pembangunan.",
      },
    ];
  }

  if (kunci === "new_feature") {
    prd.overview =
      "Fitur baru untuk produk yang sudah berjalan. Jelaskan fitur yang ditambahkan dan alasan penambahannya sekarang.";
    prd.masalah =
      "Kekurangan pada produk saat ini yang membuat fitur ini dibutuhkan. Pengguna saat ini terpaksa …";
    prd.tujuan =
      "1. Hasil yang ingin dicapai dengan fitur ini.\n2. Dampaknya bagi pengguna dan produk.";
    prd.targetPengguna =
      "Segmen pengguna yang memakai fitur ini: …";
    prd.scope =
      "Termasuk: perilaku fitur, layar/alur yang berubah, dan data yang terlibat.";
    prd.outOfScope =
      "Tidak termasuk: perubahan lain yang tidak terkait langsung dengan fitur ini.";
    prd.fitur = [
      {
        id: n(),
        nama: "Fitur baru yang ditambahkan",
        deskripsi: "Jelaskan perilaku fitur dari sisi pengguna.",
        prioritas: "Must Have",
      },
    ];
    prd.stories = [
      {
        id: n(),
        sebagai: "pengguna produk saat ini",
        ingin: "memakai fitur baru ini",
        agar: "pekerjaannya lebih cepat / mudah",
        kriteria: "Syarat fitur dianggap selesai dan siap dirilis.",
      },
    ];
  }

  if (kunci === "improvement") {
    prd.overview =
      "Perbaikan pada produk/fitur yang sudah ada. Jelaskan kondisi saat ini dan gambaran kondisi setelah perbaikan.";
    prd.masalah =
      "Keluhan, hambatan, atau data yang menunjukkan perlunya perbaikan. Kondisi saat ini: …";
    prd.tujuan =
      "1. Kondisi yang ingin dicapai setelah perbaikan.\n2. Ukuran keberhasilannya.";
    prd.targetPengguna =
      "Pengguna yang terdampak perbaikan ini: …";
    prd.scope =
      "Termasuk: bagian yang diperbaiki dan batas perubahannya.";
    prd.outOfScope =
      "Tidak termasuk: pembangunan ulang total atau perubahan di luar bagian ini.";
    prd.metrik = [
      {
        id: n(),
        nama: "Indikator perbaikan",
        target: "Sebelum: … → Sesudah: …",
        deskripsi: "Cara membandingkan kondisi sebelum dan sesudah perbaikan.",
      },
    ];
    prd.milestones = [
      {
        id: n(),
        fase: "Perbaikan & Verifikasi",
        waktu: "Tuliskan target waktu",
        deskripsi: "Perbaikan dilakukan lalu diverifikasi terhadap indikator perbaikan.",
      },
    ];
  }

  return prd;
}
