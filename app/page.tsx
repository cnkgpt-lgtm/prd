"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  STATUS_BADGE,
  STATUS_LABEL,
  DAFTAR_STATUS,
  type Prd,
  type StatusPrd,
} from "@/lib/types";
import { muatPrds, simpanPrds, hitungKelengkapan, formatTanggal } from "@/lib/store";
import { DAFTAR_TEMPLATE, buatDariTemplate, type KunciTemplate } from "@/lib/templates";

type Filter = "semua" | StatusPrd;

export default function Beranda() {
  const router = useRouter();
  const [prds, setPrds] = useState<Prd[]>([]);
  const [termuat, setTermuat] = useState(false);
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [modalBuat, setModalBuat] = useState(false);
  const [judulBaru, setJudulBaru] = useState("");
  const [produkBaru, setProdukBaru] = useState("");
  const [template, setTemplate] = useState<KunciTemplate>("new_product");

  useEffect(() => {
    setPrds(muatPrds());
    setTermuat(true);
  }, []);

  useEffect(() => {
    if (termuat) simpanPrds(prds);
  }, [prds, termuat]);

  const statistik = useMemo(() => {
    const per: Record<StatusPrd, number> = {
      draft: 0,
      in_review: 0,
      approved: 0,
      archived: 0,
    };
    prds.forEach((p) => {
      per[p.status] += 1;
    });
    return { total: prds.length, per };
  }, [prds]);

  const tampil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return prds
      .filter((p) => (filter === "semua" ? true : p.status === filter))
      .filter((p) =>
        kata
          ? (p.judul + " " + p.produk).toLowerCase().includes(kata)
          : true
      )
      .sort((a, b) => (a.diubahPada < b.diubahPada ? 1 : -1));
  }, [prds, cari, filter]);

  function buatPrd() {
    const judul = judulBaru.trim();
    if (!judul) return;
    const prd = buatDariTemplate(template, judul, produkBaru.trim());
    setPrds((lama) => [prd, ...lama]);
    setModalBuat(false);
    setJudulBaru("");
    setProdukBaru("");
    router.push(`/prd/${prd.id}`);
  }

  function duplikat(prd: Prd) {
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
    setPrds((lama) => [salinan, ...lama]);
  }

  function hapus(prd: Prd) {
    if (
      window.confirm(
        `Hapus PRD "${prd.judul}"? Tindakan ini tidak bisa dibatalkan.`
      )
    ) {
      setPrds((lama) => lama.filter((p) => p.id !== prd.id));
    }
  }

  const kartuStatistik: { label: string; nilai: number; aksen: string }[] = [
    { label: "Total PRD", nilai: statistik.total, aksen: "text-slate-900" },
    { label: "Draft", nilai: statistik.per.draft, aksen: "text-slate-600" },
    { label: "In Review", nilai: statistik.per.in_review, aksen: "text-amber-600" },
    { label: "Approved", nilai: statistik.per.approved, aksen: "text-emerald-600" },
    { label: "Arsip", nilai: statistik.per.archived, aksen: "text-zinc-500" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Kepala */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Aplikasi PRD
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            <strong>PRD</strong> adalah kepanjangan dari{" "}
            <em>Product Requirements Document</em> (Dokumen Persyaratan
            Produk): dokumen panduan atau cetak biru (<em>blueprint</em>) yang
            merinci tujuan, fitur, fungsionalitas, serta persyaratan teknis dan
            bisnis suatu produk — acuan tunggal (<em>single source of truth</em>)
            bagi Product Manager, desainer, engineer, dan stakeholder.
          </p>
        </div>
        <button
          onClick={() => setModalBuat(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          + Buat PRD Baru
        </button>
      </header>

      {/* Statistik */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {kartuStatistik.map((k) => (
          <div
            key={k.label}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <div className={`text-2xl font-bold ${k.aksen}`}>{k.nilai}</div>
            <div className="mt-0.5 text-xs font-medium text-slate-500">
              {k.label}
            </div>
          </div>
        ))}
      </section>

      {/* Pencarian & filter */}
      <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari judul atau nama produk…"
          className="w-full rounded-lg bg-white px-3.5 py-2.5 text-sm shadow-sm ring-1 ring-slate-200 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("semua")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${
              filter === "semua"
                ? "bg-indigo-600 text-white ring-indigo-600"
                : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            Semua
          </button>
          {DAFTAR_STATUS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${
                filter === s
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </section>

      {/* Daftar PRD */}
      <section className="mt-6">
        {!termuat ? (
          <p className="text-sm text-slate-500">Memuat daftar PRD…</p>
        ) : tampil.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <p className="font-medium text-slate-700">
              {prds.length === 0
                ? "Belum ada PRD. Buat PRD pertama Anda."
                : "Tidak ada PRD yang cocok dengan pencarian/filter ini."}
            </p>
            <button
              onClick={() => setModalBuat(true)}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              + Buat PRD Baru
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {tampil.map((prd) => {
              const lengkap = hitungKelengkapan(prd);
              return (
                <li
                  key={prd.id}
                  className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold leading-snug text-slate-900">
                        {prd.judul}
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {prd.produk || "—"} · v{prd.versi} · diubah{" "}
                        {formatTanggal(prd.diubahPada)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_BADGE[prd.status]}`}
                    >
                      {STATUS_LABEL[prd.status]}
                    </span>
                  </div>

                  {prd.contoh && (
                    <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-800">
                      Dokumen contoh bawaan — sama dengan dokumen resmi{" "}
                      <em>PRD-Aplikasi-PRD.md</em> di repo GitHub.
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Kelengkapan dokumen</span>
                      <span>{lengkap}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          lengkap >= 90
                            ? "bg-emerald-500"
                            : lengkap >= 50
                              ? "bg-amber-500"
                              : "bg-slate-400"
                        }`}
                        style={{ width: `${lengkap}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {prd.fitur.length} fitur · {prd.stories.length} user
                      stories · {prd.metrik.length} metrik
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => router.push(`/prd/${prd.id}`)}
                      className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Buka Editor
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/prd/${prd.id}?mode=pratinjau`)
                      }
                      className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Pratinjau
                    </button>
                    <button
                      onClick={() => duplikat(prd)}
                      className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Duplikat
                    </button>
                    <button
                      onClick={() => hapus(prd)}
                      className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Data PRD tersimpan otomatis di penyimpanan lokal browser ini
        (localStorage) — tanpa login, dan tidak terkirim ke server.
      </footer>

      {/* Modal buat PRD */}
      {modalBuat && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Buat PRD Baru</h2>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Judul PRD
              <input
                value={judulBaru}
                onChange={(e) => setJudulBaru(e.target.value)}
                placeholder="cth. PRD Aplikasi Kasir Toko"
                className="mt-1 w-full rounded-lg px-3.5 py-2.5 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Nama Produk
              <input
                value={produkBaru}
                onChange={(e) => setProdukBaru(e.target.value)}
                placeholder="cth. KasirKu"
                className="mt-1 w-full rounded-lg px-3.5 py-2.5 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-slate-700">
                Pilih Template
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {DAFTAR_TEMPLATE.map((t) => (
                  <button
                    key={t.kunci}
                    type="button"
                    onClick={() => setTemplate(t.kunci)}
                    className={`rounded-lg p-3 text-left ring-1 transition ${
                      template === t.kunci
                        ? "bg-indigo-50 ring-2 ring-indigo-600"
                        : "bg-white ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      {t.nama}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {t.deskripsi}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalBuat(false)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={buatPrd}
                disabled={!judulBaru.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buat &amp; Buka Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
