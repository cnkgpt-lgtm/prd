import type { Prd } from "./types";
import { seedPrds } from "./seed";

const KUNCI = "aplikasi-prd-data-v1";

/** Muat semua PRD dari localStorage. Pada kunjungan pertama, diisi dokumen contoh bawaan. */
export function muatPrds(): Prd[] {
  if (typeof window === "undefined") return [];
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) {
      window.localStorage.setItem(KUNCI, JSON.stringify(seedPrds));
      return [...seedPrds];
    }
    const data = JSON.parse(mentah);
    return Array.isArray(data) ? (data as Prd[]) : [...seedPrds];
  } catch {
    return [...seedPrds];
  }
}

export function simpanPrds(prds: Prd[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(prds));
  } catch {
    // Penyimpanan penuh / ditolak browser: abaikan, data tetap tampil selama sesi.
  }
}

export function idBaru(): string {
  return (
    "prd-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

/**
 * Kelengkapan dokumen dihitung dari 13 unsur isi:
 * overview, masalah, tujuan, target pengguna, scope, out of scope, fitur,
 * user stories, metrik, milestone, non-fungsional, risiko & asumsi, stakeholder.
 */
export function hitungKelengkapan(prd: Prd): number {
  const teks = (s: string) => (s && s.trim().length > 0 ? 1 : 0);
  const unsur = [
    teks(prd.overview),
    teks(prd.masalah),
    teks(prd.tujuan),
    teks(prd.targetPengguna),
    teks(prd.scope),
    teks(prd.outOfScope),
    prd.fitur.length > 0 ? 1 : 0,
    prd.stories.length > 0 ? 1 : 0,
    prd.metrik.length > 0 ? 1 : 0,
    prd.milestones.length > 0 ? 1 : 0,
    teks(prd.nonFungsional),
    teks(prd.risiko) || teks(prd.asumsi) ? 1 : 0,
    prd.stakeholders.length > 0 ? 1 : 0,
  ];
  const terisi = unsur.reduce((a, b) => a + b, 0);
  return Math.round((terisi / unsur.length) * 100);
}

export function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
