import type { Prd } from "./types";

/**
 * Dokumen contoh bawaan: PRD pertama Aplikasi PRD yang sudah terisi penuh
 * (v1.0, kelengkapan 100%), sama dengan dokumen resmi PRD-Aplikasi-PRD.md
 * di repo GitHub cnkgpt-lgtm/prd.
 */
export const seedPrds: Prd[] = [
  {
    id: "contoh-prd-aplikasi-prd",
    judul: "PRD Aplikasi PRD — Pembuat Dokumen Persyaratan Produk",
    produk: "Aplikasi PRD",
    pemilik: "Bapak (Product Owner) — disusun oleh Muse",
    versi: "1.0",
    status: "in_review",
    contoh: true,
    dibuatPada: "2026-10-22T05:12:09.894Z",
    diubahPada: "2026-10-22T05:12:36.908Z",
    overview:
      "Aplikasi PRD adalah aplikasi web berbahasa Indonesia untuk membuat, mengelola, dan menyimpan Product Requirements Document (Dokumen Persyaratan Produk). PRD adalah dokumen panduan atau cetak biru (blueprint) yang merinci tujuan, fitur, fungsionalitas, serta persyaratan teknis dan bisnis dari suatu produk yang akan dikembangkan. Aplikasi ini menjadi acuan tunggal (single source of truth) agar seluruh tim — Product Manager, desainer, engineer, dan stakeholder — memiliki pemahaman yang sama mengenai apa yang sedang dibangun dan mengapa produk tersebut dibuat.",
    masalah:
      "Persyaratan produk selama ini tersebar di chat, catatan, dan ingatan masing-masing orang. Akibatnya: (1) tim sering berbeda pemahaman tentang fitur yang harus dibangun, (2) keputusan produk sulit ditelusuri kembali, (3) ruang lingkup melebar tanpa disadari (scope creep), dan (4) setiap aplikasi baru dimulai dari nol tanpa template yang konsisten. Dibutuhkan satu tempat resmi untuk menulis PRD secara terstruktur sebelum pengembangan dimulai.",
    tujuan:
      "1. Menyediakan template PRD terstruktur yang konsisten untuk setiap produk baru, fitur baru, dan improvement.\n2. Mempercepat penyusunan PRD dari berjam-jam menjadi hitungan menit dengan template siap isi.\n3. Menjadi single source of truth: satu dokumen resmi per produk yang bisa dirujuk seluruh tim.\n4. Memastikan tidak ada bagian penting yang terlewat lewat indikator kelengkapan dokumen real-time.\n5. Menghasilkan dokumen final yang rapi dan siap dibagikan/dicetak sebagai PDF untuk stakeholder.",
    targetPengguna:
      "Utama: Product Manager / Product Owner yang menyusun PRD (dalam hal ini Bapak sebagai pemilik produk). Sekunder: desainer UI/UX, engineer/pengembang yang membaca PRD sebagai acuan pembangunan, dan stakeholder lain (bendahara, pengurus, klien) yang memberikan persetujuan. Pengguna umumnya bekerja dalam Bahasa Indonesia dan membutuhkan alur yang sederhana tanpa pelatihan.",
    scope:
      "Termasuk dalam ruang lingkup v1.0: daftar PRD dengan pencarian, filter status, dan statistik; pembuatan PRD dari 4 template (Kosong, Produk Baru, Fitur Baru, Improvement); editor terstruktur 11 bagian; prioritas fitur MoSCoW; user stories dengan kriteria penerimaan; metrik KPI; timeline/milestone; indikator kelengkapan real-time; mode pratinjau dokumen resmi siap cetak/PDF; duplikasi dan hapus PRD; penyimpanan otomatis di server aplikasi.",
    outOfScope:
      "Tidak termasuk dalam v1.0: kolaborasi multi-user real-time (beberapa orang mengedit bersamaan), komentar dan @mention di dalam dokumen, riwayat versi/revisi per perubahan, integrasi langsung ke GitHub/Vercel/Jira, tanda tangan persetujuan digital, dan notifikasi otomatis ke stakeholder. Fitur-fitur ini dapat dipertimbangkan untuk v2.0.",
    nonFungsional:
      "Bahasa antarmuka: Bahasa Indonesia penuh. Performa: daftar dan editor terbuka < 2 detik. Ketersediaan: data tersimpan di server aplikasi (tidak hilang saat browser ditutup). Keamanan: akses hanya oleh pemilik akun; dokumen tidak dibagikan ke publik kecuali pemilik memilih mencetak/mengekspor sendiri. Responsif: dapat dipakai di HP dan desktop, termasuk untuk membaca pratinjau. Kegunaan: alur buat → isi → pratinjau → cetak dapat diselesaikan tanpa panduan tambahan.",
    risiko:
      "1. Risiko: pengguna mengisi PRD terlalu singkat sehingga dokumen tidak cukup menjadi acuan. Mitigasi: template berisi contoh arah pengisian dan indikator kelengkapan mendorong pengisian lengkap.\n2. Risiko: PRD tidak diperbarui setelah keputusan berubah. Mitigasi: status dokumen (Draft/In Review/Approved/Arsip) dan nomor versi membuat status dokumen selalu jelas.\n3. Risiko: kehilangan data. Mitigasi: penyimpanan di server aplikasi, bukan hanya di browser.",
    asumsi:
      "1. Satu pemilik akun mengelola seluruh PRD pada tahap awal; kolaborasi tim dilakukan dengan membagikan hasil cetak/PDF.\n2. Pengguna memahami konsep dasar PRD sesuai definisi pada dokumen ini.\n3. Format 11 bagian dianggap cukup mewakili kebutuhan PRD untuk aplikasi web dan mobile yang selama ini dibangun (RTKu, SISTER, DojoKu, Barcode Studio, dan sejenisnya).",
    fitur: [
      {
        id: "f1",
        nama: "Daftar & Dashboard PRD",
        deskripsi:
          "Halaman utama berisi semua PRD dengan pencarian berdasarkan judul/nama produk, filter status (Draft, In Review, Approved, Arsip), dan statistik jumlah dokumen per status.",
        prioritas: "Must Have",
      },
      {
        id: "f2",
        nama: "Buat PRD dari Template",
        deskripsi:
          "Membuat PRD baru dari 4 template: Kosong, Produk Baru, Fitur Baru, dan Improvement. Template terisi struktur dan arahan awal agar penyusunan lebih cepat.",
        prioritas: "Must Have",
      },
      {
        id: "f3",
        nama: "Editor PRD 11 Bagian",
        deskripsi:
          "Editor terstruktur: Overview, Masalah, Tujuan, Target Pengguna, Scope & Out of Scope, Fitur, User Stories, Metrik KPI, Timeline/Milestone, Non-fungsional, Risiko, dan Stakeholder.",
        prioritas: "Must Have",
      },
      {
        id: "f4",
        nama: "Fitur dengan Prioritas MoSCoW",
        deskripsi:
          "Setiap fitur diberi prioritas Must Have, Should Have, Could Have, atau Won't Have agar urutan pembangunan jelas dan scope creep terkendali.",
        prioritas: "Must Have",
      },
      {
        id: "f5",
        nama: "User Stories & Kriteria Penerimaan",
        deskripsi:
          "User story dalam format 'Sebagai [pengguna], saya ingin [kebutuhan], agar [manfaat]' dilengkapi acceptance criteria sebagai syarat fitur dianggap selesai.",
        prioritas: "Must Have",
      },
      {
        id: "f6",
        nama: "Indikator Kelengkapan Dokumen",
        deskripsi:
          "Persentase kelengkapan dihitung real-time dari bagian yang sudah terisi, tampil di editor agar penyusun tahu dokumen sudah layak direview atau belum.",
        prioritas: "Should Have",
      },
      {
        id: "f7",
        nama: "Pratinjau & Cetak/PDF",
        deskripsi:
          "Mode pratinjau merender PRD sebagai dokumen resmi terstruktur (termasuk tabel metrik) yang siap dicetak atau disimpan sebagai PDF untuk dibagikan ke stakeholder.",
        prioritas: "Must Have",
      },
      {
        id: "f8",
        nama: "Duplikasi & Hapus PRD",
        deskripsi:
          "PRD yang sudah ada dapat diduplikasi sebagai titik awal produk serupa, dan dihapus bila sudah tidak diperlukan.",
        prioritas: "Should Have",
      },
    ],
    stories: [
      {
        id: "s1",
        sebagai: "Product Owner",
        ingin: "membuat PRD baru dari template Produk Baru",
        agar: "saya tidak perlu menyusun struktur dokumen dari nol setiap ada ide aplikasi",
        kriteria:
          "PRD baru terbuat dengan 11 bagian terstruktur, tersimpan di daftar, dan langsung terbuka di editor.",
      },
      {
        id: "s2",
        sebagai: "Product Owner",
        ingin: "melihat persentase kelengkapan PRD saat mengisi",
        agar: "saya tahu bagian mana yang belum terisi sebelum dokumen saya serahkan untuk direview",
        kriteria:
          "Persentase berubah real-time setiap ada bagian yang diisi atau dikosongkan.",
      },
      {
        id: "s3",
        sebagai: "Engineer / Pengembang",
        ingin: "membaca PRD dalam mode pratinjau yang rapi",
        agar: "saya memahami apa yang harus dibangun, prioritasnya, dan kriteria selesai tanpa bertanya berulang kali",
        kriteria:
          "Pratinjau menampilkan seluruh bagian termasuk fitur MoSCoW, user stories, dan tabel metrik, dan dapat dicetak ke PDF.",
      },
      {
        id: "s4",
        sebagai: "Stakeholder",
        ingin: "melihat status PRD (Draft / In Review / Approved)",
        agar: "saya tahu dokumen mana yang masih rancangan dan mana yang sudah disetujui untuk dibangun",
        kriteria: "Status tampil jelas di daftar PRD dan dapat difilter.",
      },
      {
        id: "s5",
        sebagai: "Product Owner",
        ingin: "menduplikasi PRD produk sebelumnya",
        agar: "produk baru yang mirip dapat dimulai dari dokumen yang sudah terbukti",
        kriteria:
          "Hasil duplikasi muncul sebagai PRD baru berstatus Draft dengan isi sama seperti sumbernya.",
      },
    ],
    metrik: [
      {
        id: "m1",
        nama: "Waktu penyusunan PRD",
        target: "≤ 30 menit per PRD",
        deskripsi:
          "Waktu dari membuat PRD baru sampai status In Review, diukur untuk PRD produk baru dengan template.",
      },
      {
        id: "m2",
        nama: "Kelengkapan dokumen saat review",
        target: "≥ 90%",
        deskripsi:
          "Rata-rata indikator kelengkapan PRD pada saat pertama kali diajukan untuk review.",
      },
      {
        id: "m3",
        nama: "PRD yang berlanjut ke pembangunan",
        target: "≥ 80% PRD Approved dibangun",
        deskripsi:
          "Persentase PRD berstatus Approved yang benar-benar dilanjutkan menjadi aplikasi/fitur.",
      },
      {
        id: "m4",
        nama: "Pertanyaan klarifikasi dari pengembang",
        target: "Turun dibanding tanpa PRD",
        deskripsi:
          "Jumlah pertanyaan pengulangan/klarifikasi selama pembangunan untuk produk yang diawali PRD dibanding yang tidak.",
      },
    ],
    milestones: [
      {
        id: "ms1",
        fase: "Fase 1 — Fondasi",
        waktu: "Selesai — 22 Okt 2026",
        deskripsi:
          "Daftar PRD, pencarian, filter status, statistik, dan pembuatan PRD dari 4 template.",
      },
      {
        id: "ms2",
        fase: "Fase 2 — Editor Lengkap",
        waktu: "Selesai — 22 Okt 2026",
        deskripsi:
          "Editor 11 bagian dengan fitur MoSCoW, user stories, metrik, milestone, stakeholder, dan indikator kelengkapan real-time.",
      },
      {
        id: "ms3",
        fase: "Fase 3 — Keluaran Dokumen",
        waktu: "Selesai — 22 Okt 2026",
        deskripsi:
          "Mode pratinjau dokumen resmi, cetak/PDF, duplikasi, dan hapus PRD. Versi 1.0 siap dipakai dan PRD pertama (dokumen ini) terisi penuh.",
      },
      {
        id: "ms4",
        fase: "Fase 4 — Rencana v2.0",
        waktu: "Belum dijadwalkan",
        deskripsi:
          "Evaluasi kebutuhan kolaborasi, riwayat versi, dan komentar stakeholder berdasarkan pemakaian v1.0.",
      },
    ],
    stakeholders: [
      {
        id: "st1",
        nama: "Bapak",
        peran: "Product Owner",
        tanggungJawab:
          "Menentukan produk yang dibuatkan PRD, mereview isi dokumen, dan menyetujui PRD (Approved) sebelum pembangunan dimulai.",
      },
      {
        id: "st2",
        nama: "Product Manager (Penyusun)",
        peran: "Product Manager",
        tanggungJawab:
          "Menyusun dan menjaga PRD sebagai single source of truth, termasuk memperbarui versi bila keputusan berubah.",
      },
      {
        id: "st3",
        nama: "Desainer UI/UX",
        peran: "Desainer",
        tanggungJawab:
          "Menerjemahkan target pengguna, scope, dan user stories menjadi desain antarmuka.",
      },
      {
        id: "st4",
        nama: "Engineer / Pengembang",
        peran: "Engineer",
        tanggungJawab:
          "Membangun produk sesuai fitur, prioritas MoSCoW, persyaratan non-fungsional, dan kriteria penerimaan di PRD.",
      },
    ],
  },
];
