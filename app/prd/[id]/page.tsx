"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  STATUS_LABEL,
  DAFTAR_STATUS,
  DAFTAR_PRIORITAS,
  PRIORITAS_BADGE,
  type Prd,
} from "@/lib/types";
import {
  muatPrds,
  simpanPrds,
  hitungKelengkapan,
  formatTanggal,
} from "@/lib/store";
import {
  CATATAN_SARAN,
  pilihanTeks,
  paketFitur,
  paketStories,
  paketMetrik,
  paketMilestone,
  paketStakeholder,
  type PilihanTeks,
  type PaketDaftar,
} from "@/lib/saran";

type Mode = "editor" | "pratinjau";

const inputKelas =
  "w-full rounded-lg bg-white px-3.5 py-2.5 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-indigo-500";
const labelKelas = "block text-sm font-semibold text-slate-800";
const petunjukKelas = "mt-0.5 text-xs text-slate-500";

function Bagian({
  nomor,
  judul,
  petunjuk,
  children,
}: {
  nomor: number;
  judul: string;
  petunjuk?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-base font-bold text-slate-900">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {nomor}
        </span>
        {judul}
      </h2>
      {petunjuk && <p className="mt-1 text-xs text-slate-500">{petunjuk}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

const tombolSaranKelas =
  "rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500";

function AreaTeks({
  label,
  nilai,
  ubah,
  baris = 4,
  placeholder,
  pilihan,
}: {
  label?: string;
  nilai: string;
  ubah: (v: string) => void;
  baris?: number;
  placeholder?: string;
  /** Pilihan jawaban siap pakai (Pilihan AI) untuk kolom ini. */
  pilihan?: PilihanTeks[];
}) {
  const [buka, setBuka] = useState(false);
  const adaIsi = nilai.trim().length > 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <span className={labelKelas}>{label}</span>
        ) : (
          <span />
        )}
        {pilihan && (
          <button
            type="button"
            onClick={() => setBuka((b) => !b)}
            className={tombolSaranKelas}
            aria-expanded={buka}
          >
            ✨ Pilihan AI
          </button>
        )}
      </div>
      <textarea
        value={nilai}
        onChange={(e) => ubah(e.target.value)}
        rows={baris}
        placeholder={placeholder}
        className={`${inputKelas} mt-1`}
      />
      {buka && pilihan && (
        <div className="mt-2 rounded-lg bg-violet-50 p-3 ring-1 ring-violet-200">
          <p className="text-xs font-semibold text-violet-900">
            ✨ Pilihan AI — pilih satu jawaban siap pakai untuk kolom ini
          </p>
          <p className="mt-0.5 text-[11px] italic text-violet-700">
            {CATATAN_SARAN}
          </p>
          <div className="mt-2.5 space-y-2">
            {pilihan.map((p, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white p-3 ring-1 ring-violet-100"
              >
                <p className="text-xs font-bold text-violet-700">{p.label}</p>
                <p className="mt-1 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                  {p.teks}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        adaIsi &&
                        !window.confirm(
                          "Kolom ini sudah berisi teks. Ganti seluruh isinya dengan pilihan ini?"
                        )
                      ) {
                        return;
                      }
                      ubah(p.teks);
                      setBuka(false);
                    }}
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
                  >
                    {adaIsi ? "Ganti Isi dengan Pilihan Ini" : "Gunakan Pilihan Ini"}
                  </button>
                  {adaIsi && (
                    <button
                      type="button"
                      onClick={() => {
                        ubah(nilai.replace(/\s+$/, "") + "\n" + p.teks);
                        setBuka(false);
                      }}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-300 hover:bg-violet-100"
                    >
                      Tambahkan di Bawahnya
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Tombol + panel "✨ Pilihan AI" untuk bagian daftar (Fitur, User Stories,
 * Metrik, Milestone, Stakeholder): menawarkan paket entri siap pakai yang
 * DITAMBAHKAN ke daftar (tidak pernah mengganti entri yang sudah ada).
 */
function SaranDaftar<T>({
  paket,
  tambah,
}: {
  paket: PaketDaftar<T>[];
  tambah: (entri: T[]) => void;
}) {
  const [buka, setBuka] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setBuka((b) => !b)}
        className={tombolSaranKelas}
        aria-expanded={buka}
      >
        ✨ Pilihan AI — Paket Siap Pakai
      </button>
      {buka && (
        <div className="mt-2 rounded-lg bg-violet-50 p-3 ring-1 ring-violet-200">
          <p className="text-xs font-semibold text-violet-900">
            ✨ Pilihan AI — paket entri siap pakai, ditambahkan ke daftar Anda
            (entri yang sudah ada tidak diubah)
          </p>
          <p className="mt-0.5 text-[11px] italic text-violet-700">
            {CATATAN_SARAN}
          </p>
          <div className="mt-2.5 space-y-2">
            {paket.map((p, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white p-3 ring-1 ring-violet-100"
              >
                <p className="text-xs font-bold text-violet-700">{p.label}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-slate-600">
                  {p.ringkasan.map((r, ri) => (
                    <li key={ri}>{r}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    tambah(p.entri);
                    setBuka(false);
                  }}
                  className="mt-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
                >
                  Tambahkan Paket Ini ({p.entri.length} entri)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HalamanPrd() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("editor");
  const [semua, setSemua] = useState<Prd[]>([]);
  const [termuat, setTermuat] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "pratinjau") {
      setMode("pratinjau");
    }
    setSemua(muatPrds());
    setTermuat(true);
  }, []);

  const prd = useMemo(
    () => semua.find((p) => p.id === params.id) ?? null,
    [semua, params.id]
  );

  const lengkap = useMemo(
    () => (prd ? hitungKelengkapan(prd) : 0),
    [prd]
  );

  function ubah(patch: Partial<Prd>) {
    setSemua((lama) => {
      const baru = lama.map((p) =>
        p.id === params.id
          ? { ...p, ...patch, diubahPada: new Date().toISOString() }
          : p
      );
      simpanPrds(baru);
      return baru;
    });
  }

  function duplikat() {
    if (!prd) return;
    const sekarang = new Date().toISOString();
    const salinan: Prd = {
      ...JSON.parse(JSON.stringify(prd)),
      id:
        "prd-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 8),
      judul: prd.judul + " (Salinan)",
      status: "draft",
      contoh: false,
      dibuatPada: sekarang,
      diubahPada: sekarang,
    };
    const baru = [salinan, ...semua];
    setSemua(baru);
    simpanPrds(baru);
    router.push(`/prd/${salinan.id}`);
  }

  function hapus() {
    if (!prd) return;
    if (window.confirm(`Hapus PRD "${prd.judul}"?`)) {
      const baru = semua.filter((p) => p.id !== prd.id);
      simpanPrds(baru);
      router.push("/");
    }
  }

  if (!termuat) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">
        Memuat dokumen…
      </main>
    );
  }

  if (!prd) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="font-medium text-slate-700">
          PRD tidak ditemukan di browser ini.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          ← Kembali ke Daftar
        </button>
      </main>
    );
  }

  const rid = () => Math.random().toString(36).slice(2, 9);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      {/* Bilah alat */}
      <div className="no-print flex flex-wrap items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          ← Daftar PRD
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-200">
            <button
              onClick={() => setMode("editor")}
              className={`px-3.5 py-2 text-sm font-medium ${
                mode === "editor"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMode("pratinjau")}
              className={`px-3.5 py-2 text-sm font-medium ${
                mode === "pratinjau"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Pratinjau
            </button>
          </div>
          {mode === "pratinjau" && (
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Cetak / Simpan PDF
            </button>
          )}
          <button
            onClick={duplikat}
            className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Duplikat
          </button>
          <button
            onClick={hapus}
            className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
          >
            Hapus
          </button>
        </div>
      </div>

      {/* Kelengkapan */}
      <div className="no-print mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>Kelengkapan dokumen (tersimpan otomatis)</span>
          <span className="font-bold text-slate-900">{lengkap}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${
              lengkap >= 90
                ? "bg-emerald-500"
                : lengkap >= 50
                  ? "bg-amber-500"
                  : "bg-slate-400"
            }`}
            style={{ width: `${lengkap}%` }}
          />
        </div>
        {prd.contoh && (
          <p className="mt-2 text-xs font-medium text-indigo-700">
            Dokumen contoh bawaan dari dokumen resmi PRD-Aplikasi-PRD.md —
            silakan duplikat sebelum mengubahnya.
          </p>
        )}
      </div>

      {mode === "pratinjau" ? (
        <Pratinjau prd={prd} />
      ) : (
        <div className="mt-6 space-y-5">
          {/* Identitas dokumen */}
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelKelas}>Judul PRD</span>
                <input
                  value={prd.judul}
                  onChange={(e) => ubah({ judul: e.target.value })}
                  className={`${inputKelas} mt-1`}
                />
              </label>
              <label className="block">
                <span className={labelKelas}>Nama Produk</span>
                <input
                  value={prd.produk}
                  onChange={(e) => ubah({ produk: e.target.value })}
                  className={`${inputKelas} mt-1`}
                />
              </label>
              <label className="block">
                <span className={labelKelas}>Pemilik / Penyusun (PM)</span>
                <input
                  value={prd.pemilik}
                  onChange={(e) => ubah({ pemilik: e.target.value })}
                  placeholder="cth. Bapak (Product Owner)"
                  className={`${inputKelas} mt-1`}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelKelas}>Versi</span>
                  <input
                    value={prd.versi}
                    onChange={(e) => ubah({ versi: e.target.value })}
                    className={`${inputKelas} mt-1`}
                  />
                </label>
                <label className="block">
                  <span className={labelKelas}>Status</span>
                  <select
                    value={prd.status}
                    onChange={(e) =>
                      ubah({ status: e.target.value as Prd["status"] })
                    }
                    className={`${inputKelas} mt-1`}
                  >
                    {DAFTAR_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Dibuat {formatTanggal(prd.dibuatPada)} · terakhir diubah{" "}
              {formatTanggal(prd.diubahPada)}
            </p>
          </section>

          <Bagian nomor={1} judul="Overview" petunjuk="Ringkasan produk: apa, untuk siapa, dan nilai utamanya.">
            <AreaTeks nilai={prd.overview} ubah={(v) => ubah({ overview: v })} baris={5} pilihan={pilihanTeks("overview", prd)} />
          </Bagian>

          <Bagian nomor={2} judul="Masalah" petunjuk="Masalah pengguna saat ini dan dampaknya bila tidak diselesaikan.">
            <AreaTeks nilai={prd.masalah} ubah={(v) => ubah({ masalah: v })} baris={5} pilihan={pilihanTeks("masalah", prd)} />
          </Bagian>

          <Bagian nomor={3} judul="Tujuan" petunjuk="Hasil yang ingin dicapai produk ini, ditulis bernomor.">
            <AreaTeks nilai={prd.tujuan} ubah={(v) => ubah({ tujuan: v })} baris={5} pilihan={pilihanTeks("tujuan", prd)} />
          </Bagian>

          <Bagian nomor={4} judul="Target Pengguna" petunjuk="Pengguna utama dan sekunder, beserta kebutuhannya.">
            <AreaTeks nilai={prd.targetPengguna} ubah={(v) => ubah({ targetPengguna: v })} baris={4} pilihan={pilihanTeks("targetPengguna", prd)} />
          </Bagian>

          <Bagian nomor={5} judul="Scope & Out of Scope" petunjuk="Batas yang jelas mencegah ruang lingkup melebar (scope creep).">
            <AreaTeks label="Termasuk (Scope)" nilai={prd.scope} ubah={(v) => ubah({ scope: v })} baris={4} pilihan={pilihanTeks("scope", prd)} />
            <AreaTeks label="Tidak Termasuk (Out of Scope)" nilai={prd.outOfScope} ubah={(v) => ubah({ outOfScope: v })} baris={4} pilihan={pilihanTeks("outOfScope", prd)} />
          </Bagian>

          <Bagian nomor={6} judul="Fitur & Prioritas (MoSCoW)" petunjuk="Must Have = wajib ada; Should Have = penting; Could Have = bila sempat; Won't Have = sengaja tidak dibuat.">
            {prd.fitur.map((f, i) => (
              <div key={f.id} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex gap-2">
                  <input
                    value={f.nama}
                    onChange={(e) =>
                      ubah({
                        fitur: prd.fitur.map((x, xi) =>
                          xi === i ? { ...x, nama: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Nama fitur"
                    className={`${inputKelas} flex-1`}
                  />
                  <select
                    value={f.prioritas}
                    onChange={(e) =>
                      ubah({
                        fitur: prd.fitur.map((x, xi) =>
                          xi === i
                            ? { ...x, prioritas: e.target.value as typeof x.prioritas }
                            : x
                        ),
                      })
                    }
                    className="w-36 rounded-lg bg-white px-2.5 py-2.5 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DAFTAR_PRIORITAS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => ubah({ fitur: prd.fitur.filter((_, xi) => xi !== i) })}
                    className="rounded-lg px-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    aria-label="Hapus fitur"
                  >
                    Hapus
                  </button>
                </div>
                <textarea
                  value={f.deskripsi}
                  onChange={(e) =>
                    ubah({
                      fitur: prd.fitur.map((x, xi) =>
                        xi === i ? { ...x, deskripsi: e.target.value } : x
                      ),
                    })
                  }
                  rows={2}
                  placeholder="Deskripsi fitur"
                  className={`${inputKelas} mt-2`}
                />
              </div>
            ))}
            <SaranDaftar
              paket={paketFitur(prd)}
              tambah={(entri) => ubah({ fitur: [...prd.fitur, ...entri] })}
            />
            <button
              onClick={() =>
                ubah({
                  fitur: [...prd.fitur, { id: rid(), nama: "", deskripsi: "", prioritas: "Must Have" }],
                })
              }
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
            >
              + Tambah Fitur
            </button>
          </Bagian>

          <Bagian nomor={7} judul="User Stories" petunjuk="Format: Sebagai [pengguna], saya ingin [kebutuhan], agar [manfaat] — lengkap dengan kriteria penerimaan.">
            {prd.stories.map((s, i) => (
              <div key={s.id} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    value={s.sebagai}
                    onChange={(e) =>
                      ubah({
                        stories: prd.stories.map((x, xi) =>
                          xi === i ? { ...x, sebagai: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Sebagai…"
                    className={inputKelas}
                  />
                  <input
                    value={s.ingin}
                    onChange={(e) =>
                      ubah({
                        stories: prd.stories.map((x, xi) =>
                          xi === i ? { ...x, ingin: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Saya ingin…"
                    className={inputKelas}
                  />
                  <input
                    value={s.agar}
                    onChange={(e) =>
                      ubah({
                        stories: prd.stories.map((x, xi) =>
                          xi === i ? { ...x, agar: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Agar…"
                    className={inputKelas}
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  <textarea
                    value={s.kriteria}
                    onChange={(e) =>
                      ubah({
                        stories: prd.stories.map((x, xi) =>
                          xi === i ? { ...x, kriteria: e.target.value } : x
                        ),
                      })
                    }
                    rows={2}
                    placeholder="Kriteria penerimaan (acceptance criteria)"
                    className={`${inputKelas} flex-1`}
                  />
                  <button
                    onClick={() => ubah({ stories: prd.stories.filter((_, xi) => xi !== i) })}
                    className="self-start rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <SaranDaftar
              paket={paketStories(prd)}
              tambah={(entri) => ubah({ stories: [...prd.stories, ...entri] })}
            />
            <button
              onClick={() =>
                ubah({
                  stories: [...prd.stories, { id: rid(), sebagai: "", ingin: "", agar: "", kriteria: "" }],
                })
              }
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
            >
              + Tambah User Story
            </button>
          </Bagian>

          <Bagian nomor={8} judul="Metrik Keberhasilan (KPI)" petunjuk="Ukuran terukur untuk menilai produk berhasil atau tidak.">
            {prd.metrik.map((m, i) => (
              <div key={m.id} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex gap-2">
                  <input
                    value={m.nama}
                    onChange={(e) =>
                      ubah({
                        metrik: prd.metrik.map((x, xi) =>
                          xi === i ? { ...x, nama: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Nama metrik"
                    className={`${inputKelas} flex-1`}
                  />
                  <input
                    value={m.target}
                    onChange={(e) =>
                      ubah({
                        metrik: prd.metrik.map((x, xi) =>
                          xi === i ? { ...x, target: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Target"
                    className={`${inputKelas} flex-1`}
                  />
                  <button
                    onClick={() => ubah({ metrik: prd.metrik.filter((_, xi) => xi !== i) })}
                    className="rounded-lg px-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
                <textarea
                  value={m.deskripsi}
                  onChange={(e) =>
                    ubah({
                      metrik: prd.metrik.map((x, xi) =>
                        xi === i ? { ...x, deskripsi: e.target.value } : x
                      ),
                    })
                  }
                  rows={2}
                  placeholder="Deskripsi / cara mengukur"
                  className={`${inputKelas} mt-2`}
                />
              </div>
            ))}
            <SaranDaftar
              paket={paketMetrik(prd)}
              tambah={(entri) => ubah({ metrik: [...prd.metrik, ...entri] })}
            />
            <button
              onClick={() =>
                ubah({
                  metrik: [...prd.metrik, { id: rid(), nama: "", target: "", deskripsi: "" }],
                })
              }
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
            >
              + Tambah Metrik
            </button>
          </Bagian>

          <Bagian nomor={9} judul="Timeline / Milestone" petunjuk="Tahapan pembangunan dan target waktunya.">
            {prd.milestones.map((m, i) => (
              <div key={m.id} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex gap-2">
                  <input
                    value={m.fase}
                    onChange={(e) =>
                      ubah({
                        milestones: prd.milestones.map((x, xi) =>
                          xi === i ? { ...x, fase: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Fase / milestone"
                    className={`${inputKelas} flex-1`}
                  />
                  <input
                    value={m.waktu}
                    onChange={(e) =>
                      ubah({
                        milestones: prd.milestones.map((x, xi) =>
                          xi === i ? { ...x, waktu: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Waktu"
                    className={`${inputKelas} flex-1`}
                  />
                  <button
                    onClick={() => ubah({ milestones: prd.milestones.filter((_, xi) => xi !== i) })}
                    className="rounded-lg px-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
                <textarea
                  value={m.deskripsi}
                  onChange={(e) =>
                    ubah({
                      milestones: prd.milestones.map((x, xi) =>
                        xi === i ? { ...x, deskripsi: e.target.value } : x
                      ),
                    })
                  }
                  rows={2}
                  placeholder="Deskripsi fase"
                  className={`${inputKelas} mt-2`}
                />
              </div>
            ))}
            <SaranDaftar
              paket={paketMilestone(prd)}
              tambah={(entri) => ubah({ milestones: [...prd.milestones, ...entri] })}
            />
            <button
              onClick={() =>
                ubah({
                  milestones: [...prd.milestones, { id: rid(), fase: "", waktu: "", deskripsi: "" }],
                })
              }
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
            >
              + Tambah Milestone
            </button>
          </Bagian>

          <Bagian nomor={10} judul="Persyaratan Non-Fungsional" petunjuk="Bahasa, performa, keamanan, ketersediaan, dan kegunaan.">
            <AreaTeks nilai={prd.nonFungsional} ubah={(v) => ubah({ nonFungsional: v })} baris={5} pilihan={pilihanTeks("nonFungsional", prd)} />
          </Bagian>

          <Bagian nomor={11} judul="Risiko & Asumsi" petunjuk="Risiko beserta mitigasinya, dan asumsi yang dipakai dokumen ini.">
            <AreaTeks label="Risiko & Mitigasi" nilai={prd.risiko} ubah={(v) => ubah({ risiko: v })} baris={5} pilihan={pilihanTeks("risiko", prd)} />
            <AreaTeks label="Asumsi" nilai={prd.asumsi} ubah={(v) => ubah({ asumsi: v })} baris={4} pilihan={pilihanTeks("asumsi", prd)} />
          </Bagian>

          <Bagian nomor={12} judul="Stakeholder" petunjuk="Pihak yang terlibat: Product Manager, desainer, engineer, dan pemangku kepentingan lain.">
            {prd.stakeholders.map((s, i) => (
              <div key={s.id} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex gap-2">
                  <input
                    value={s.nama}
                    onChange={(e) =>
                      ubah({
                        stakeholders: prd.stakeholders.map((x, xi) =>
                          xi === i ? { ...x, nama: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Nama"
                    className={`${inputKelas} flex-1`}
                  />
                  <input
                    value={s.peran}
                    onChange={(e) =>
                      ubah({
                        stakeholders: prd.stakeholders.map((x, xi) =>
                          xi === i ? { ...x, peran: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Peran"
                    className={`${inputKelas} flex-1`}
                  />
                  <button
                    onClick={() => ubah({ stakeholders: prd.stakeholders.filter((_, xi) => xi !== i) })}
                    className="rounded-lg px-2.5 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
                <textarea
                  value={s.tanggungJawab}
                  onChange={(e) =>
                    ubah({
                      stakeholders: prd.stakeholders.map((x, xi) =>
                        xi === i ? { ...x, tanggungJawab: e.target.value } : x
                      ),
                    })
                  }
                  rows={2}
                  placeholder="Tanggung jawab"
                  className={`${inputKelas} mt-2`}
                />
              </div>
            ))}
            <SaranDaftar
              paket={paketStakeholder(prd)}
              tambah={(entri) => ubah({ stakeholders: [...prd.stakeholders, ...entri] })}
            />
            <button
              onClick={() =>
                ubah({
                  stakeholders: [...prd.stakeholders, { id: rid(), nama: "", peran: "", tanggungJawab: "" }],
                })
              }
              className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
            >
              + Tambah Stakeholder
            </button>
          </Bagian>
        </div>
      )}
    </main>
  );
}

function Paragraf({ teks }: { teks: string }) {
  if (!teks || !teks.trim()) {
    return <p className="text-sm italic text-slate-400">Belum diisi.</p>;
  }
  return (
    <div className="space-y-1.5">
      {teks.split("\n").map((baris, i) => (
        <p key={i} className="text-sm leading-relaxed text-slate-700">
          {baris}
        </p>
      ))}
    </div>
  );
}

function JudulBagian({ nomor, teks }: { nomor: number; teks: string }) {
  return (
    <h2 className="mt-8 border-b border-slate-200 pb-2 text-base font-bold text-slate-900 first:mt-0">
      {nomor}. {teks}
    </h2>
  );
}

function Pratinjau({ prd }: { prd: Prd }) {
  return (
    <article
      id="dokumen-resmi"
      className="mx-auto mt-6 w-full max-w-3xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10"
    >
      <header className="border-b-2 border-slate-900 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Product Requirements Document
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900">
          {prd.judul}
        </h1>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Produk</dt>
            <dd className="font-medium text-slate-800">{prd.produk || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Versi</dt>
            <dd className="font-medium text-slate-800">{prd.versi}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Status</dt>
            <dd className="font-medium text-slate-800">{STATUS_LABEL[prd.status]}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Pemilik</dt>
            <dd className="font-medium text-slate-800">{prd.pemilik || "—"}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-slate-400">
          Kelengkapan dokumen: {hitungKelengkapan(prd)}% · Terakhir diubah{" "}
          {formatTanggal(prd.diubahPada)}
        </p>
      </header>

      <JudulBagian nomor={1} teks="Overview" />
      <div className="mt-3"><Paragraf teks={prd.overview} /></div>

      <JudulBagian nomor={2} teks="Masalah" />
      <div className="mt-3"><Paragraf teks={prd.masalah} /></div>

      <JudulBagian nomor={3} teks="Tujuan" />
      <div className="mt-3"><Paragraf teks={prd.tujuan} /></div>

      <JudulBagian nomor={4} teks="Target Pengguna" />
      <div className="mt-3"><Paragraf teks={prd.targetPengguna} /></div>

      <JudulBagian nomor={5} teks="Ruang Lingkup (Scope)" />
      <div className="mt-3"><Paragraf teks={prd.scope} /></div>
      <h3 className="mt-4 text-sm font-bold text-slate-900">Di Luar Ruang Lingkup (Out of Scope)</h3>
      <div className="mt-2"><Paragraf teks={prd.outOfScope} /></div>

      <JudulBagian nomor={6} teks="Fitur & Prioritas (MoSCoW)" />
      {prd.fitur.length === 0 ? (
        <div className="mt-3"><Paragraf teks="" /></div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border border-slate-200 px-3 py-2 font-semibold">#</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Fitur</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Prioritas</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {prd.fitur.map((f, i) => (
                <tr key={f.id}>
                  <td className="border border-slate-200 px-3 py-2 text-slate-500">{i + 1}</td>
                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{f.nama}</td>
                  <td className="border border-slate-200 px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${PRIORITAS_BADGE[f.prioritas]}`}>
                      {f.prioritas}
                    </span>
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{f.deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JudulBagian nomor={7} teks="User Stories" />
      {prd.stories.length === 0 ? (
        <div className="mt-3"><Paragraf teks="" /></div>
      ) : (
        <ul className="mt-3 space-y-4">
          {prd.stories.map((s, i) => (
            <li key={s.id} className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm leading-relaxed text-slate-800">
                <strong>S{i + 1}.</strong> Sebagai <strong>{s.sebagai}</strong>, saya
                ingin <strong>{s.ingin}</strong>, agar {s.agar}.
              </p>
              <p className="mt-1.5 text-sm text-slate-600">
                <span className="font-semibold">Kriteria penerimaan:</span> {s.kriteria}
              </p>
            </li>
          ))}
        </ul>
      )}

      <JudulBagian nomor={8} teks="Metrik Keberhasilan (KPI)" />
      {prd.metrik.length === 0 ? (
        <div className="mt-3"><Paragraf teks="" /></div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border border-slate-200 px-3 py-2 font-semibold">Metrik</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Target</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {prd.metrik.map((m) => (
                <tr key={m.id}>
                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{m.nama}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{m.target}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{m.deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JudulBagian nomor={9} teks="Timeline / Milestone" />
      {prd.milestones.length === 0 ? (
        <div className="mt-3"><Paragraf teks="" /></div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border border-slate-200 px-3 py-2 font-semibold">Fase</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Waktu</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {prd.milestones.map((m) => (
                <tr key={m.id}>
                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{m.fase}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{m.waktu}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{m.deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JudulBagian nomor={10} teks="Persyaratan Non-Fungsional" />
      <div className="mt-3"><Paragraf teks={prd.nonFungsional} /></div>

      <JudulBagian nomor={11} teks="Risiko & Asumsi" />
      <h3 className="mt-3 text-sm font-bold text-slate-900">Risiko & Mitigasi</h3>
      <div className="mt-2"><Paragraf teks={prd.risiko} /></div>
      <h3 className="mt-4 text-sm font-bold text-slate-900">Asumsi</h3>
      <div className="mt-2"><Paragraf teks={prd.asumsi} /></div>

      <JudulBagian nomor={12} teks="Stakeholder" />
      {prd.stakeholders.length === 0 ? (
        <div className="mt-3"><Paragraf teks="" /></div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border border-slate-200 px-3 py-2 font-semibold">Nama</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Peran</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Tanggung Jawab</th>
              </tr>
            </thead>
            <tbody>
              {prd.stakeholders.map((s) => (
                <tr key={s.id}>
                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{s.nama}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{s.peran}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">{s.tanggungJawab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Dokumen ini dibuat dengan Aplikasi PRD — acuan tunggal (single source of
        truth) pengembangan {prd.produk || "produk"}.
      </footer>
    </article>
  );
}
