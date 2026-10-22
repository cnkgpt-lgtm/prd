# Aplikasi PRD — Product Requirements Document

Aplikasi web untuk membuat, mengelola, dan menyimpan **Product Requirements Document (PRD)** — dibangun dengan Next.js 15 + Tailwind CSS, Bahasa Indonesia penuh.

🔗 **Dokumen persyaratan produk ini:** [PRD-Aplikasi-PRD.md](PRD-Aplikasi-PRD.md) — PRD v1.0 Aplikasi PRD yang terisi penuh (kelengkapan 100%) dan menjadi acuan pembangunan aplikasi ini.

## Pengertian Singkat

- **Definisi:** PRD adalah dokumen panduan atau cetak biru (*blueprint*) yang merinci tujuan, fitur, fungsionalitas, serta persyaratan teknis dan bisnis dari suatu produk yang akan dikembangkan.
- **Pembuat:** Ditulis oleh seorang Product Manager (PM), sering kali bekerja sama dengan tim desainer, engineer (pengembang), dan pemangku kepentingan (stakeholder) lain.
- **Fungsi Utama:** Menjadi acuan tunggal (*single source of truth*) agar seluruh tim memiliki pemahaman yang sama mengenai apa yang sedang dibangun dan mengapa produk tersebut dibuat.

## Fitur

- Daftar PRD dengan pencarian, filter status (Draft / In Review / Approved / Arsip), dan statistik
- Buat PRD dari 4 template: Kosong, Produk Baru, Fitur Baru, Improvement
- Editor 11 bagian: Overview, Masalah, Tujuan, Target Pengguna, Scope & Out of Scope, Fitur MoSCoW, User Stories + kriteria penerimaan, Metrik KPI, Timeline/Milestone, Non-fungsional, Risiko & Asumsi, Stakeholder
- **✨ Pilihan AI** di setiap pertanyaan editor: 3 pilihan jawaban siap pakai per kolom teks dan paket entri siap pakai untuk Fitur, User Stories, Metrik, Milestone, dan Stakeholder — dipersonalisasi dengan nama produk. Pilihan diganti hanya setelah konfirmasi, atau ditambahkan di bawah isi yang ada; paket daftar selalu ditambahkan tanpa mengubah entri lama. Catatan kejujuran: pilihan ini berasal dari pustaka jawaban terkurasi di sisi klien, **bukan** panggilan model AI live (aplikasi tidak memakai API key eksternal), dan keterangan itu ditampilkan juga di UI.
- Indikator kelengkapan dokumen real-time
- Pratinjau dokumen resmi + cetak / simpan PDF
- Duplikasi & hapus PRD
- Dokumen contoh bawaan: PRD Aplikasi PRD v1.0 yang sudah terisi penuh (sama dengan [PRD-Aplikasi-PRD.md](PRD-Aplikasi-PRD.md))

## Penyimpanan Data

Data tersimpan di **localStorage browser** (tanpa login, tanpa database server). Konsekuensinya: data hanya ada di browser/perangkat yang sama, tidak tersinkron antarperangkat, dan hilang bila data browser dibersihkan. Dokumen resmi yang menjadi acuan tetap tersimpan permanen sebagai [PRD-Aplikasi-PRD.md](PRD-Aplikasi-PRD.md) di repo ini.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.
