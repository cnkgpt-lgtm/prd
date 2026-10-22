# PRD Aplikasi PRD — Pembuat Dokumen Persyaratan Produk

**Produk:** Aplikasi PRD
**Versi:** 1.0
**Status:** In Review
**Pemilik:** Bapak (Product Owner) — disusun oleh Muse
**Kelengkapan dokumen:** 100%

---

## 1. Overview

Aplikasi PRD adalah aplikasi web berbahasa Indonesia untuk membuat, mengelola, dan menyimpan Product Requirements Document (Dokumen Persyaratan Produk). PRD adalah dokumen panduan atau cetak biru (blueprint) yang merinci tujuan, fitur, fungsionalitas, serta persyaratan teknis dan bisnis dari suatu produk yang akan dikembangkan. Aplikasi ini menjadi acuan tunggal (single source of truth) agar seluruh tim — Product Manager, desainer, engineer, dan stakeholder — memiliki pemahaman yang sama mengenai apa yang sedang dibangun dan mengapa produk tersebut dibuat.

## 2. Masalah

Persyaratan produk selama ini tersebar di chat, catatan, dan ingatan masing-masing orang. Akibatnya: (1) tim sering berbeda pemahaman tentang fitur yang harus dibangun, (2) keputusan produk sulit ditelusuri kembali, (3) ruang lingkup melebar tanpa disadari (scope creep), dan (4) setiap aplikasi baru dimulai dari nol tanpa template yang konsisten. Dibutuhkan satu tempat resmi untuk menulis PRD secara terstruktur sebelum pengembangan dimulai.

## 3. Tujuan

1. Menyediakan template PRD terstruktur yang konsisten untuk setiap produk baru, fitur baru, dan improvement.
2. Mempercepat penyusunan PRD dari berjam-jam menjadi hitungan menit dengan template siap isi.
3. Menjadi single source of truth: satu dokumen resmi per produk yang bisa dirujuk seluruh tim.
4. Memastikan tidak ada bagian penting yang terlewat lewat indikator kelengkapan dokumen real-time.
5. Menghasilkan dokumen final yang rapi dan siap dibagikan/dicetak sebagai PDF untuk stakeholder.

## 4. Target Pengguna

Utama: Product Manager / Product Owner yang menyusun PRD (dalam hal ini Bapak sebagai pemilik produk). Sekunder: desainer UI/UX, engineer/pengembang yang membaca PRD sebagai acuan pembangunan, dan stakeholder lain (bendahara, pengurus, klien) yang memberikan persetujuan. Pengguna umumnya bekerja dalam Bahasa Indonesia dan membutuhkan alur yang sederhana tanpa pelatihan.

## 5. Ruang Lingkup (Scope)

Termasuk dalam ruang lingkup v1.0: daftar PRD dengan pencarian, filter status, dan statistik; pembuatan PRD dari 4 template (Kosong, Produk Baru, Fitur Baru, Improvement); editor terstruktur 11 bagian; prioritas fitur MoSCoW; user stories dengan kriteria penerimaan; metrik KPI; timeline/milestone; indikator kelengkapan real-time; mode pratinjau dokumen resmi siap cetak/PDF; duplikasi dan hapus PRD; penyimpanan otomatis di server aplikasi.

### Di Luar Ruang Lingkup (Out of Scope)

Tidak termasuk dalam v1.0: kolaborasi multi-user real-time (beberapa orang mengedit bersamaan), komentar dan @mention di dalam dokumen, riwayat versi/revisi per perubahan, integrasi langsung ke GitHub/Vercel/Jira, tanda tangan persetujuan digital, dan notifikasi otomatis ke stakeholder. Fitur-fitur ini dapat dipertimbangkan untuk v2.0.

## 6. Fitur & Prioritas (MoSCoW)

| # | Fitur | Prioritas | Deskripsi |
|---|-------|-----------|-----------|
| 1 | Daftar & Dashboard PRD | Must Have | Halaman utama berisi semua PRD dengan pencarian berdasarkan judul/nama produk, filter status (Draft, In Review, Approved, Arsip), dan statistik jumlah dokumen per status. |
| 2 | Buat PRD dari Template | Must Have | Membuat PRD baru dari 4 template: Kosong, Produk Baru, Fitur Baru, dan Improvement. Template terisi struktur dan arahan awal agar penyusunan lebih cepat. |
| 3 | Editor PRD 11 Bagian | Must Have | Editor terstruktur: Overview, Masalah, Tujuan, Target Pengguna, Scope & Out of Scope, Fitur, User Stories, Metrik KPI, Timeline/Milestone, Non-fungsional, Risiko, dan Stakeholder. |
| 4 | Fitur dengan Prioritas MoSCoW | Must Have | Setiap fitur diberi prioritas Must Have, Should Have, Could Have, atau Won't Have agar urutan pembangunan jelas dan scope creep terkendali. |
| 5 | User Stories & Kriteria Penerimaan | Must Have | User story dalam format "Sebagai [pengguna], saya ingin [kebutuhan], agar [manfaat]" dilengkapi acceptance criteria sebagai syarat fitur dianggap selesai. |
| 6 | Indikator Kelengkapan Dokumen | Should Have | Persentase kelengkapan dihitung real-time dari bagian yang sudah terisi, tampil di editor agar penyusun tahu dokumen sudah layak direview atau belum. |
| 7 | Pratinjau & Cetak/PDF | Must Have | Mode pratinjau merender PRD sebagai dokumen resmi terstruktur (termasuk tabel metrik) yang siap dicetak atau disimpan sebagai PDF untuk dibagikan ke stakeholder. |
| 8 | Duplikasi & Hapus PRD | Should Have | PRD yang sudah ada dapat diduplikasi sebagai titik awal produk serupa, dan dihapus bila sudah tidak diperlukan. |

## 7. User Stories

### S1
- **Sebagai** Product Owner, **saya ingin** membuat PRD baru dari template Produk Baru, **agar** saya tidak perlu menyusun struktur dokumen dari nol setiap ada ide aplikasi.
- **Kriteria penerimaan:** PRD baru terbuat dengan 11 bagian terstruktur, tersimpan di daftar, dan langsung terbuka di editor.

### S2
- **Sebagai** Product Owner, **saya ingin** melihat persentase kelengkapan PRD saat mengisi, **agar** saya tahu bagian mana yang belum terisi sebelum dokumen saya serahkan untuk direview.
- **Kriteria penerimaan:** Persentase berubah real-time setiap ada bagian yang diisi atau dikosongkan.

### S3
- **Sebagai** Engineer / Pengembang, **saya ingin** membaca PRD dalam mode pratinjau yang rapi, **agar** saya memahami apa yang harus dibangun, prioritasnya, dan kriteria selesai tanpa bertanya berulang kali.
- **Kriteria penerimaan:** Pratinjau menampilkan seluruh bagian termasuk fitur MoSCoW, user stories, dan tabel metrik, dan dapat dicetak ke PDF.

### S4
- **Sebagai** Stakeholder, **saya ingin** melihat status PRD (Draft / In Review / Approved), **agar** saya tahu dokumen mana yang masih rancangan dan mana yang sudah disetujui untuk dibangun.
- **Kriteria penerimaan:** Status tampil jelas di daftar PRD dan dapat difilter.

### S5
- **Sebagai** Product Owner, **saya ingin** menduplikasi PRD produk sebelumnya, **agar** produk baru yang mirip dapat dimulai dari dokumen yang sudah terbukti.
- **Kriteria penerimaan:** Hasil duplikasi muncul sebagai PRD baru berstatus Draft dengan isi sama seperti sumbernya.

## 8. Metrik Keberhasilan (KPI)

| Metrik | Target | Deskripsi |
|--------|--------|-----------|
| Waktu penyusunan PRD | ≤ 30 menit per PRD | Waktu dari membuat PRD baru sampai status In Review, diukur untuk PRD produk baru dengan template. |
| Kelengkapan dokumen saat review | ≥ 90% | Rata-rata indikator kelengkapan PRD pada saat pertama kali diajukan untuk review. |
| PRD yang berlanjut ke pembangunan | ≥ 80% PRD Approved dibangun | Persentase PRD berstatus Approved yang benar-benar dilanjutkan menjadi aplikasi/fitur. |
| Pertanyaan klarifikasi dari pengembang | Turun dibanding tanpa PRD | Jumlah pertanyaan pengulangan/klarifikasi selama pembangunan untuk produk yang diawali PRD dibanding yang tidak. |

## 9. Timeline / Milestone

| Fase | Waktu | Deskripsi |
|------|-------|-----------|
| Fase 1 — Fondasi | Selesai — 22 Okt 2026 | Daftar PRD, pencarian, filter status, statistik, dan pembuatan PRD dari 4 template. |
| Fase 2 — Editor Lengkap | Selesai — 22 Okt 2026 | Editor 11 bagian dengan fitur MoSCoW, user stories, metrik, milestone, stakeholder, dan indikator kelengkapan real-time. |
| Fase 3 — Keluaran Dokumen | Selesai — 22 Okt 2026 | Mode pratinjau dokumen resmi, cetak/PDF, duplikasi, dan hapus PRD. Versi 1.0 siap dipakai dan PRD pertama (dokumen ini) terisi penuh. |
| Fase 4 — Rencana v2.0 | Belum dijadwalkan | Evaluasi kebutuhan kolaborasi, riwayat versi, dan komentar stakeholder berdasarkan pemakaian v1.0. |

## 10. Persyaratan Non-Fungsional

Bahasa antarmuka: Bahasa Indonesia penuh. Performa: daftar dan editor terbuka < 2 detik. Ketersediaan: data tersimpan di server aplikasi (tidak hilang saat browser ditutup). Keamanan: akses hanya oleh pemilik akun; dokumen tidak dibagikan ke publik kecuali pemilik memilih mencetak/mengekspor sendiri. Responsif: dapat dipakai di HP dan desktop, termasuk untuk membaca pratinjau. Kegunaan: alur buat → isi → pratinjau → cetak dapat diselesaikan tanpa panduan tambahan.

## 11. Risiko & Mitigasi

1. **Risiko:** pengguna mengisi PRD terlalu singkat sehingga dokumen tidak cukup menjadi acuan. **Mitigasi:** template berisi contoh arah pengisian dan indikator kelengkapan mendorong pengisian lengkap.
2. **Risiko:** PRD tidak diperbarui setelah keputusan berubah. **Mitigasi:** status dokumen (Draft/In Review/Approved/Arsip) dan nomor versi membuat status dokumen selalu jelas.
3. **Risiko:** kehilangan data. **Mitigasi:** penyimpanan di server aplikasi, bukan hanya di browser.

## 12. Asumsi

1. Satu pemilik akun mengelola seluruh PRD pada tahap awal; kolaborasi tim dilakukan dengan membagikan hasil cetak/PDF.
2. Pengguna memahami konsep dasar PRD sesuai definisi pada dokumen ini.
3. Format 11 bagian dianggap cukup mewakili kebutuhan PRD untuk aplikasi web dan mobile yang selama ini dibangun (RTKu, SISTER, DojoKu, Barcode Studio, dan sejenisnya).

## 13. Stakeholder

| Nama | Peran | Tanggung Jawab |
|------|-------|----------------|
| Bapak | Product Owner | Menentukan produk yang dibuatkan PRD, mereview isi dokumen, dan menyetujui PRD (Approved) sebelum pembangunan dimulai. |
| Product Manager (Penyusun) | Product Manager | Menyusun dan menjaga PRD sebagai single source of truth, termasuk memperbarui versi bila keputusan berubah. |
| Desainer UI/UX | Desainer | Menerjemahkan target pengguna, scope, dan user stories menjadi desain antarmuka. |
| Engineer / Pengembang | Engineer | Membangun produk sesuai fitur, prioritas MoSCoW, persyaratan non-fungsional, dan kriteria penerimaan di PRD. |

---

*Dokumen ini dibuat dan diisi di Aplikasi PRD pada 22 Oktober 2026, lalu disimpan ke repo ini atas permintaan pemilik produk.*
