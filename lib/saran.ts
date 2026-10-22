import type {
  Prd,
  Fitur,
  UserStory,
  Metrik,
  Milestone,
  Stakeholder,
} from "./types";

/**
 * Pustaka "Pilihan AI": saran jawaban siap pakai untuk setiap pertanyaan PRD.
 *
 * Catatan kejujuran: pilihan ini BUKAN hasil panggilan model AI live dan tidak
 * memakai API key eksternal. Pilihan dihasilkan dari pustaka jawaban terkurasi
 * yang dipersonalisasi di sisi klien memakai nama produk, judul PRD, dan
 * konteks dokumen (produk baru / fitur baru / perbaikan) yang sedang dibuka.
 */

export const CATATAN_SARAN =
  "Saran otomatis dari pustaka jawaban — sesuaikan dengan produk Anda.";

export interface PilihanTeks {
  /** Sudut jawaban, mis. "Ringkas", "Formal", "Fokus Pengguna". */
  label: string;
  teks: string;
}

export interface PaketDaftar<T> {
  label: string;
  /** Ringkasan pendek isi paket untuk ditampilkan di panel. */
  ringkasan: string[];
  entri: T[];
}

function uid(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

/** Nama produk untuk personalisasi; fallback bila kolom produk masih kosong. */
export function namaProduk(prd: Prd): string {
  const p = (prd.produk || "").trim();
  return p.length > 0 ? p : "produk ini";
}

type Konteks = "produk_baru" | "fitur_baru" | "perbaikan" | "umum";

/**
 * Tebak konteks dokumen dari judul/overview agar sudut pilihan relevan:
 * PRD fitur baru dan PRD perbaikan mendapat varian yang berbeda dari produk baru.
 */
export function konteksDokumen(prd: Prd): Konteks {
  const teks = `${prd.judul} ${prd.overview}`.toLowerCase();
  if (
    teks.includes("perbaikan") ||
    teks.includes("peningkatan") ||
    teks.includes("improvement") ||
    teks.includes("optimalisasi")
  ) {
    return "perbaikan";
  }
  if (teks.includes("fitur baru") || teks.includes("penambahan fitur")) {
    return "fitur_baru";
  }
  if (teks.includes("produk baru")) return "produk_baru";
  return "umum";
}

/* ------------------------------------------------------------------ */
/* Pilihan untuk kolom teks                                            */
/* ------------------------------------------------------------------ */

export type KunciTeks =
  | "overview"
  | "masalah"
  | "tujuan"
  | "targetPengguna"
  | "scope"
  | "outOfScope"
  | "nonFungsional"
  | "risiko"
  | "asumsi";

export function pilihanTeks(kunci: KunciTeks, prd: Prd): PilihanTeks[] {
  const P = namaProduk(prd);
  const k = konteksDokumen(prd);

  switch (kunci) {
    case "overview":
      return [
        {
          label: "Ringkas",
          teks: `${P} adalah produk yang membantu pengguna menyelesaikan kebutuhan utamanya secara lebih cepat dan sederhana. Dokumen ini merinci tujuan, fitur, dan persyaratan ${P} agar seluruh tim memiliki pemahaman yang sama tentang apa yang dibangun dan mengapa.`,
        },
        {
          label: "Formal",
          teks: `Dokumen ini merupakan Product Requirements Document (PRD) untuk ${P}, yang berfungsi sebagai acuan tunggal (single source of truth) pengembangan. Di dalamnya diuraikan latar belakang, tujuan, target pengguna, ruang lingkup, fitur beserta prioritasnya, serta persyaratan teknis dan bisnis ${P}, sebagai dasar kesepakatan antara Product Manager, desainer, engineer, dan stakeholder.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `${P} dibuat untuk pengguna yang selama ini kesulitan menyelesaikan pekerjaannya dengan cara manual. Nilai utama ${P} adalah kemudahan: pengguna dapat mencapai hasil yang mereka butuhkan dalam langkah yang lebih sedikit, tanpa pelatihan khusus, dan dengan hasil yang konsisten setiap kali digunakan.`,
        },
      ];

    case "masalah":
      return [
        {
          label: "Ringkas",
          teks: `Saat ini pengguna belum memiliki cara yang praktis untuk menyelesaikan kebutuhan yang hendak dijawab ${P}. Proses yang ada lambat, rawan salah, dan sulit dilacak kembali.`,
        },
        {
          label: "Berbasis Dampak",
          teks: `Permasalahan yang dihadapi pengguna saat ini berdampak langsung pada waktu dan kualitas hasil: (1) pekerjaan dilakukan berulang secara manual, (2) informasi tersebar sehingga sulit menemukan versi yang benar, dan (3) kesalahan baru diketahui setelah terlanjur berdampak. Bila tidak diselesaikan, dampak ini terus berulang dan membesar seiring bertambahnya pengguna ${P}.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `Pengguna ${P} saat ini terpaksa mengandalkan cara seadanya — catatan terpisah, pesan chat, dan ingatan masing-masing. Akibatnya mereka sering berbeda pemahaman, mengulang pekerjaan yang sama, dan tidak yakin apakah hasil pekerjaannya sudah benar. Inilah masalah utama yang hendak diselesaikan ${P}.`,
        },
      ];

    case "tujuan":
      return [
        {
          label: "Ringkas",
          teks: `1. Menyediakan ${P} yang menyelesaikan kebutuhan utama pengguna secara sederhana dan andal.\n2. Menjadi acuan resmi yang dipakai seluruh tim selama pengembangan.\n3. Mencapai hasil terukur dalam 3–6 bulan pertama setelah rilis.`,
        },
        {
          label: "Terukur (SMART)",
          teks: `1. Meluncurkan versi pertama ${P} dengan seluruh fitur Must Have berfungsi dan teruji.\n2. Mencapai tingkat adopsi pengguna sasaran minimal 70% dalam 3 bulan pertama.\n3. Menurunkan waktu penyelesaian pekerjaan utama pengguna minimal 50% dibanding cara lama.\n4. Menjaga kepuasan pengguna pada skor minimal 4 dari 5 berdasarkan survei setelah pemakaian.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `1. Pengguna dapat menyelesaikan pekerjaan utamanya di ${P} tanpa bantuan orang lain.\n2. Pengguna baru memahami cara memakai ${P} dalam waktu kurang dari 5 menit.\n3. Pengguna merasa hasilnya lebih rapi dan dapat dipercaya dibanding cara lama.`,
        },
      ];

    case "targetPengguna":
      return [
        {
          label: "Ringkas",
          teks: `Pengguna utama: pihak yang setiap hari menjalankan pekerjaan yang dibantu ${P}. Pengguna sekunder: pihak yang menerima hasil pekerjaan tersebut dan pihak yang mengawasi/menyetujuinya.`,
        },
        {
          label: "Formal",
          teks: `Pengguna utama ${P} adalah pengguna akhir yang berinteraksi langsung dengan produk untuk menyelesaikan tugas utamanya; mereka membutuhkan alur yang sederhana dalam Bahasa Indonesia dan tidak memerlukan pelatihan khusus. Pengguna sekunder adalah pengelola/penanggung jawab yang meninjau hasil, memberikan persetujuan, dan membutuhkan ringkasan yang jelas. Stakeholder lain (desainer, engineer, dan pemberi keputusan) memakai ${P} sebagai acuan, bukan sebagai pengguna harian.`,
        },
        {
          label: "Persona Singkat",
          teks: `Persona utama: pengguna aktif berusia produktif yang terbiasa memakai HP untuk pekerjaan sehari-hari, memiliki waktu terbatas, dan menginginkan hasil yang cepat tanpa langkah rumit. Persona sekunder: penanggung jawab yang hanya membuka ${P} untuk memeriksa hasil akhir dan memberikan persetujuan.`,
        },
      ];

    case "scope":
      return [
        {
          label: "Ringkas",
          teks: `Termasuk dalam versi pertama ${P}: fitur inti yang menjawab kebutuhan utama pengguna, pengelolaan data dasar yang terkait fitur inti, tampilan yang responsif di HP dan desktop, serta penyimpanan yang aman dan dapat diandalkan.`,
        },
        {
          label: "Formal",
          teks: `Ruang lingkup ${P} versi pertama mencakup: (1) seluruh fitur berprioritas Must Have yang tercantum pada bagian Fitur dokumen ini, (2) antarmuka berbahasa Indonesia, (3) alur utama pengguna dari awal sampai hasil akhir tercapai, dan (4) keluaran/dokumen hasil yang siap dibagikan. Perubahan di luar daftar ini memerlukan pembaruan versi PRD.`,
        },
        {
          label: "Fokus Rilis Pertama",
          teks: `Untuk rilis pertama, ${P} difokuskan pada satu alur terpenting: pengguna masuk, menjalankan fungsi inti, dan mendapatkan hasil. Fitur pendukung yang tidak menghambat alur ini ditunda agar rilis pertama cepat selesai dan segera diuji ke pengguna nyata.`,
        },
      ];

    case "outOfScope":
      return [
        {
          label: "Ringkas",
          teks: `Tidak termasuk dalam versi pertama ${P}: fitur di luar kebutuhan inti, integrasi dengan layanan pihak ketiga, dan kemampuan lanjutan lain yang belum terbukti dibutuhkan pengguna. Semuanya dipertimbangkan kembali untuk versi berikutnya berdasarkan umpan balik pengguna.`,
        },
        {
          label: "Formal",
          teks: `Di luar ruang lingkup versi ini: (1) kolaborasi banyak pengguna secara bersamaan (real-time), (2) aplikasi mobile native di Play Store/App Store, (3) pembayaran atau transaksi keuangan di dalam produk, (4) laporan analitik lanjutan, dan (5) dukungan bahasa selain Bahasa Indonesia. Item-item tersebut tidak menjadi kewajiban tim pada rilis ini.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `${P} versi pertama sengaja tidak menangani kebutuhan di luar kelompok pengguna utama yang disebut pada bagian Target Pengguna. Kebutuhan kelompok lain, alur khusus, dan pengecualian yang jarang terjadi ditangani di luar produk untuk sementara, sampai ada bukti kebutuhan yang cukup kuat.`,
        },
      ];

    case "nonFungsional":
      return [
        {
          label: "Ringkas",
          teks: `Bahasa antarmuka: Bahasa Indonesia penuh. Performa: halaman terbuka kurang dari 2 detik. Responsif: dapat dipakai dengan nyaman di HP dan desktop. Data pengguna tersimpan aman dan tidak dibagikan ke pihak lain.`,
        },
        {
          label: "Formal",
          teks: `Performa: waktu muat halaman utama < 2 detik pada koneksi standar dan respons interaksi < 300 ms. Ketersediaan: layanan dapat diakses setiap saat (uptime target ≥ 99%). Keamanan: akses dibatasi sesuai kewenangan pengguna; data tidak dipublikasikan tanpa persetujuan pemiliknya. Kegunaan: alur utama selesai tanpa panduan tambahan. Kompatibilitas: berfungsi pada browser modern (Chrome, Edge, Firefox, Safari) dan layar mulai 360px.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `${P} harus tetap nyaman dipakai oleh pengguna awam: teks mudah dibaca, tombol cukup besar untuk layar sentuh, pesan kesalahan ditulis dengan bahasa yang jelas beserta langkah perbaikannya, dan pekerjaan pengguna tidak hilang bila halaman tertutup atau koneksi terputus sesaat.`,
        },
      ];

    case "risiko":
      return [
        {
          label: "Ringkas",
          teks: `1. Risiko: kebutuhan pengguna berubah di tengah pengembangan. Mitigasi: kunci ruang lingkup pada PRD ini dan catat perubahan sebagai versi PRD baru.\n2. Risiko: jadwal mundur. Mitigasi: bangun fitur Must Have lebih dulu.`,
        },
        {
          label: "Formal",
          teks: `1. Risiko: ruang lingkup melebar (scope creep) karena permintaan tambahan di luar PRD. Mitigasi: setiap permintaan baru dicatat, dinilai dampaknya, dan hanya masuk lewat pembaruan versi PRD.\n2. Risiko: adopsi pengguna rendah. Mitigasi: uji ke pengguna sasaran sebelum rilis penuh dan sediakan panduan singkat.\n3. Risiko: ketergantungan pada layanan pihak ketiga (hosting/database). Mitigasi: pilih layanan yang stabil dan siapkan cadangan data berkala.\n4. Risiko: kehilangan data. Mitigasi: pencadangan rutin dan pembatasan hak akses.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `1. Risiko: pengguna merasa ${P} lebih rumit daripada cara lama sehingga kembali ke cara lama. Mitigasi: pertahankan alur utama sesederhana mungkin dan uji langsung ke pengguna awam.\n2. Risiko: pengguna salah memahami hasil yang ditampilkan. Mitigasi: gunakan istilah yang akrab bagi pengguna dan tampilkan ringkasan yang tegas sebelum hasil disimpan/dibagikan.`,
        },
      ];

    case "asumsi":
      return [
        {
          label: "Ringkas",
          teks: `1. Pengguna memiliki perangkat (HP/komputer) dan koneksi internet yang memadai untuk memakai ${P}.\n2. Kebutuhan yang tertulis di PRD ini mewakili kebutuhan mayoritas pengguna sasaran.`,
        },
        {
          label: "Formal",
          teks: `1. PRD ini adalah acuan tunggal yang disepakati; keputusan lisan di luar dokumen tidak mengubah ruang lingkup.\n2. Tim yang terlibat (Product Manager, desainer, engineer) tersedia selama masa pembangunan sesuai milestone.\n3. Tidak ada perubahan regulasi atau kebijakan yang memengaruhi ${P} selama periode pengembangan.\n4. Data awal yang dibutuhkan tersedia sebelum fase pembangunan dimulai.`,
        },
        {
          label: "Fokus Pengguna",
          teks: `1. Pengguna sasaran bersedia mencoba cara baru melalui ${P} bila terbukti lebih mudah dari cara lama.\n2. Istilah dan alur yang dipakai ${P} sesuai kebiasaan pengguna sasaran, sehingga tidak diperlukan pelatihan khusus.`,
        },
      ];
  }
}

/* ------------------------------------------------------------------ */
/* Paket untuk bagian daftar                                           */
/* ------------------------------------------------------------------ */

const konteksKalimat = (k: Konteks) =>
  k === "fitur_baru"
    ? "sebagai tambahan pada produk yang sudah berjalan"
    : k === "perbaikan"
      ? "untuk memperbaiki pengalaman yang sudah ada"
      : "sejak versi pertamanya";

export function paketFitur(prd: Prd): PaketDaftar<Fitur>[] {
  const P = namaProduk(prd);
  const k = konteksDokumen(prd);
  const buat = (
    label: string,
    daftar: Array<[string, string, Fitur["prioritas"]]>
  ): PaketDaftar<Fitur> => ({
    label,
    ringkasan: daftar.map((d) => d[0]),
    entri: daftar.map(([nama, deskripsi, prioritas]) => ({
      id: uid() + nama.length,
      nama,
      deskripsi,
      prioritas,
    })),
  });

  return [
    buat("Paket Inti", [
      [
        "Fungsi inti " + P,
        `Kemampuan utama ${P} yang menjawab kebutuhan terpenting pengguna ${konteksKalimat(k)}.`,
        "Must Have",
      ],
      [
        "Pengelolaan data pengguna",
        `Pengguna dapat membuat, melihat, mengubah, dan menghapus data utama di ${P} dengan aman.`,
        "Must Have",
      ],
      [
        "Pencarian & filter",
        "Pengguna dapat menemukan kembali data/hasil dengan cepat lewat pencarian kata kunci dan filter.",
        "Should Have",
      ],
    ]),
    buat("Paket Pengalaman Pengguna", [
      [
        "Panduan langkah pertama",
        `Tampilan pembuka yang memandu pengguna baru memakai ${P} tanpa pelatihan.`,
        "Should Have",
      ],
      [
        "Notifikasi & pengingat",
        `Pengingat otomatis di ${P} untuk hal penting yang tidak boleh terlewat pengguna.`,
        "Should Have",
      ],
      [
        "Ekspor / bagikan hasil",
        "Hasil pekerjaan di " +
          P +
          " dapat diunduh atau dibagikan ke pihak yang berkepentingan.",
        "Could Have",
      ],
    ]),
    buat("Paket Kepercayaan & Keamanan", [
      [
        "Hak akses berjenjang",
        `Pembagian peran (mis. pengelola dan pengguna biasa) di ${P} agar data hanya dapat diubah pihak yang berwenang.`,
        "Must Have",
      ],
      [
        "Riwayat perubahan",
        `Setiap perubahan penting di ${P} tercatat (siapa dan kapan) agar dapat ditelusuri kembali.`,
        "Should Have",
      ],
      [
        "Pencadangan data",
        `Data ${P} dicadangkan berkala agar dapat dipulihkan bila terjadi gangguan.`,
        "Should Have",
      ],
    ]),
  ];
}

export function paketStories(prd: Prd): PaketDaftar<UserStory>[] {
  const P = namaProduk(prd);
  const buat = (
    label: string,
    daftar: Array<[string, string, string, string]>
  ): PaketDaftar<UserStory> => ({
    label,
    ringkasan: daftar.map((d) => `Sebagai ${d[0]}, saya ingin ${d[1]}`),
    entri: daftar.map(([sebagai, ingin, agar, kriteria]) => ({
      id: uid() + sebagai.length,
      sebagai,
      ingin,
      agar,
      kriteria,
    })),
  });

  return [
    buat("Paket Pengguna Utama", [
      [
        "pengguna utama",
        `menyelesaikan pekerjaan utamanya lewat ${P} dalam beberapa langkah saja`,
        "pekerjaannya selesai lebih cepat dibanding cara lama",
        `Alur utama ${P} dapat diselesaikan pengguna awam tanpa bantuan, dan hasilnya tersimpan.`,
      ],
      [
        "pengguna utama",
        "melihat kembali hasil pekerjaan saya sebelumnya",
        "saya tidak perlu mengulang pekerjaan dari awal",
        "Daftar hasil sebelumnya tampil dan dapat dibuka kembali dengan isi yang sama seperti saat disimpan.",
      ],
    ]),
    buat("Paket Pengelola", [
      [
        "pengelola / penanggung jawab",
        `meninjau hasil yang dibuat pengguna di ${P}`,
        "saya dapat memastikan hasilnya benar sebelum digunakan lebih lanjut",
        "Halaman tinjauan menampilkan ringkasan lengkap dan status setiap hasil (menunggu / disetujui / ditolak).",
      ],
      [
        "pengelola / penanggung jawab",
        "memberikan persetujuan atau penolakan beserta catatan",
        "pengguna tahu persis apa yang harus diperbaiki",
        "Keputusan tersimpan, terlihat oleh pengguna terkait, dan tercatat waktunya.",
      ],
    ]),
    buat("Paket Pengguna Baru", [
      [
        "pengguna baru",
        `memahami cara memakai ${P} dari panduan singkat di dalam produk`,
        "saya berani mencoba tanpa takut salah",
        "Panduan tampil pada pemakaian pertama dan pengguna dapat menyelesaikan contoh tugas sampai selesai.",
      ],
      [
        "pengguna baru",
        "membatalkan atau memperbaiki kesalahan input",
        "kesalahan kecil tidak merusak hasil akhir saya",
        "Setiap data yang salah dapat diubah/dihapus oleh pemiliknya sebelum dinyatakan final.",
      ],
    ]),
  ];
}

export function paketMetrik(prd: Prd): PaketDaftar<Metrik>[] {
  const P = namaProduk(prd);
  const buat = (
    label: string,
    daftar: Array<[string, string, string]>
  ): PaketDaftar<Metrik> => ({
    label,
    ringkasan: daftar.map((d) => `${d[0]} — target ${d[1]}`),
    entri: daftar.map(([nama, target, deskripsi]) => ({
      id: uid() + nama.length,
      nama,
      target,
      deskripsi,
    })),
  });

  return [
    buat("Paket Adopsi", [
      [
        "Tingkat adopsi pengguna sasaran",
        "≥ 70% dalam 3 bulan pertama",
        `Persentase pengguna sasaran yang aktif memakai ${P}, diukur dari data pemakaian bulanan.`,
      ],
      [
        "Pengguna aktif bulanan",
        "Tumbuh ≥ 10% per bulan pada 6 bulan pertama",
        `Jumlah pengguna unik yang memakai ${P} minimal sekali dalam sebulan.`,
      ],
    ]),
    buat("Paket Efisiensi", [
      [
        "Waktu penyelesaian pekerjaan utama",
        "Turun ≥ 50% dibanding cara lama",
        `Rata-rata waktu pengguna menyelesaikan pekerjaan utama di ${P}, dibandingkan pengukuran cara lama sebelum rilis.`,
      ],
      [
        "Tingkat kesalahan input",
        "≤ 2% dari total transaksi/data",
        `Persentase data yang harus diperbaiki setelah disimpan di ${P}.`,
      ],
    ]),
    buat("Paket Kepuasan & Kualitas", [
      [
        "Kepuasan pengguna",
        "Skor ≥ 4 dari 5",
        `Survei singkat setelah pemakaian ${P}, ditanyakan berkala tiap rilis besar.`,
      ],
      [
        "Ketersediaan layanan",
        "Uptime ≥ 99%",
        `Persentase waktu ${P} dapat diakses tanpa gangguan, dari pemantauan layanan hosting.`,
      ],
    ]),
  ];
}

export function paketMilestone(prd: Prd): PaketDaftar<Milestone>[] {
  const P = namaProduk(prd);
  const buat = (
    label: string,
    daftar: Array<[string, string, string]>
  ): PaketDaftar<Milestone> => ({
    label,
    ringkasan: daftar.map((d) => d[0]),
    entri: daftar.map(([fase, waktu, deskripsi]) => ({
      id: uid() + fase.length,
      fase,
      waktu,
      deskripsi,
    })),
  });

  return [
    buat("Paket Bertahap Standar", [
      [
        "Fase 1 — Fondasi & fitur inti",
        "Minggu 1–2",
        `Membangun kerangka ${P} dan seluruh fitur Must Have sampai berfungsi end-to-end.`,
      ],
      [
        "Fase 2 — Penyempurnaan & uji pengguna",
        "Minggu 3",
        `Fitur Should Have, perbaikan dari uji internal, dan uji terbatas ke pengguna sasaran ${P}.`,
      ],
      [
        "Fase 3 — Rilis",
        "Minggu 4",
        `Perbaikan akhir, penyiapan panduan singkat, dan peluncuran ${P} ke seluruh pengguna sasaran.`,
      ],
    ]),
    buat("Paket Cepat (MVP)", [
      [
        "Fase 1 — MVP",
        "Minggu 1",
        `Satu alur terpenting ${P} selesai dan dapat dipakai, tanpa fitur pendukung.`,
      ],
      [
        "Fase 2 — Umpan balik & iterasi",
        "Minggu 2–3",
        "Mengumpulkan umpan balik pengguna pertama dan memperbaiki hambatan terbesar yang ditemukan.",
      ],
    ]),
    buat("Paket Rilis Besar", [
      [
        "Fase 1 — Desain & validasi",
        "Minggu 1–2",
        `Finalisasi desain ${P} dan validasi alur ke calon pengguna sebelum pembangunan.`,
      ],
      [
        "Fase 2 — Pembangunan",
        "Minggu 3–5",
        "Pembangunan seluruh fitur sesuai prioritas MoSCoW pada PRD ini.",
      ],
      [
        "Fase 3 — Uji penerimaan & rilis",
        "Minggu 6",
        "Uji penerimaan bersama stakeholder, perbaikan temuan, pelatihan singkat, dan rilis resmi.",
      ],
    ]),
  ];
}

export function paketStakeholder(prd: Prd): PaketDaftar<Stakeholder>[] {
  const P = namaProduk(prd);
  const buat = (
    label: string,
    daftar: Array<[string, string, string]>
  ): PaketDaftar<Stakeholder> => ({
    label,
    ringkasan: daftar.map((d) => `${d[1]} — ${d[0]}`),
    entri: daftar.map(([nama, peran, tanggungJawab]) => ({
      id: uid() + peran.length,
      nama,
      peran,
      tanggungJawab,
    })),
  });

  return [
    buat("Paket Tim Produk", [
      [
        "",
        "Product Owner",
        `Menentukan prioritas ${P} dan menyetujui PRD ini sebelum pembangunan dimulai.`,
      ],
      [
        "",
        "Product Manager",
        `Menyusun dan menjaga PRD ${P} sebagai acuan tunggal, termasuk memperbarui versinya bila keputusan berubah.`,
      ],
      [
        "",
        "Desainer UI/UX",
        "Menerjemahkan target pengguna dan user stories menjadi desain antarmuka " +
          P +
          ".",
      ],
      [
        "",
        "Engineer / Pengembang",
        "Membangun " +
          P +
          " sesuai fitur, prioritas MoSCoW, dan kriteria penerimaan pada PRD ini.",
      ],
    ]),
    buat("Paket Pihak Terdampak", [
      [
        "",
        "Perwakilan Pengguna",
        `Memberi umpan balik selama uji coba ${P} dan memastikan kebutuhan pengguna nyata terwakili.`,
      ],
      [
        "",
        "Pemberi Persetujuan / Sponsor",
        "Menyetujui ruang lingkup, jadwal, dan sumber daya yang dibutuhkan " + P + ".",
      ],
    ]),
    buat("Paket Pendukung", [
      [
        "",
        "Pengelola Operasional",
        `Menyiapkan data awal dan membantu pengguna saat ${P} mulai digunakan.`,
      ],
      [
        "",
        "Penjamin Mutu (QA)",
        "Menguji " +
          P +
          " terhadap kriteria penerimaan setiap user story sebelum rilis.",
      ],
    ]),
  ];
}
