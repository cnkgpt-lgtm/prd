import type {
  Prd,
  Fitur,
  UserStory,
  Metrik,
  Milestone,
  Stakeholder,
} from "./types";
import type { PilihanTeks, PaketDaftar } from "./saran";

/**
 * Klien untuk route server /api/ai (Gemini). Semua fungsi mengembalikan
 * null bila AI tidak terjangkau (key belum dipasang, ditolak, kuota,
 * timeout) — pemanggil kemudian memakai pustaka saran lokal sebagai
 * fallback. Key Gemini tidak pernah ada di sisi klien.
 */

const BATAS_WAKTU_MS = 35_000;

function uid(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}

function konteksDari(prd: Prd): Record<string, string> {
  return {
    overview: prd.overview,
    masalah: prd.masalah,
    tujuan: prd.tujuan,
    targetPengguna: prd.targetPengguna,
    scope: prd.scope,
  };
}

type JenisDaftar = "fitur" | "stories" | "metrik" | "milestones" | "stakeholders";

async function panggilAi(
  jenis: JenisDaftar | "teks",
  pertanyaan: string,
  prd: Prd
): Promise<Record<string, unknown> | null> {
  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), BATAS_WAKTU_MS);
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jenis,
        pertanyaan,
        produk: prd.produk,
        judul: prd.judul,
        konteks: konteksDari(prd),
      }),
      signal: kontrol.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return data.sumber === "gemini" ? data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function mintaPilihanTeks(
  pertanyaan: string,
  prd: Prd
): Promise<PilihanTeks[] | null> {
  const data = await panggilAi("teks", pertanyaan, prd);
  if (!data || !Array.isArray(data.pilihan)) return null;
  const pilihan = (data.pilihan as Array<{ label?: string; teks?: string }>)
    .filter((p) => typeof p?.teks === "string" && p.teks.trim())
    .slice(0, 3)
    .map((p, i) => ({
      label:
        typeof p.label === "string" && p.label.trim()
          ? p.label
          : ["Ringkas", "Formal", "Fokus Pengguna"][i] || `Pilihan ${i + 1}`,
      teks: p.teks as string,
    }));
  return pilihan.length > 0 ? pilihan : null;
}

interface EntriMentah {
  [k: string]: unknown;
}

function kemasPaket<T>(
  data: Record<string, unknown> | null,
  buat: (e: EntriMentah) => T | null
): PaketDaftar<T>[] | null {
  if (!data || !Array.isArray(data.paket)) return null;
  const paket: PaketDaftar<T>[] = [];
  for (const p of data.paket as Array<{ label?: string; entri?: EntriMentah[] }>) {
    if (!Array.isArray(p?.entri)) continue;
    const entri = p.entri.map(buat).filter((e): e is T => e !== null);
    if (entri.length === 0) continue;
    paket.push({
      label:
        typeof p.label === "string" && p.label.trim()
          ? p.label
          : "Paket dari AI Gemini",
      ringkasan: entri.map((e) => ringkasEntri(e)),
      entri,
    });
  }
  return paket.length > 0 ? paket.slice(0, 3) : null;
}

function ringkasEntri(e: unknown): string {
  const o = e as Record<string, unknown>;
  const utama =
    (typeof o.nama === "string" && o.nama) ||
    (typeof o.fase === "string" && o.fase) ||
    (typeof o.sebagai === "string" && `Sebagai ${o.sebagai}`) ||
    (typeof o.peran === "string" && o.peran) ||
    "Entri";
  return String(utama);
}

const teks = (v: unknown) => (typeof v === "string" ? v : "");
const PRIORITAS_VALID = ["Must Have", "Should Have", "Could Have", "Won't Have"];

export function mintaPaketFitur(prd: Prd) {
  return panggilAi("fitur", "Daftar fitur & prioritas (MoSCoW)", prd).then(
    (data) =>
      kemasPaket<Fitur>(data, (e) => {
        const nama = teks(e.nama);
        if (!nama) return null;
        return {
          id: uid(),
          nama,
          deskripsi: teks(e.deskripsi),
          prioritas: (PRIORITAS_VALID.includes(teks(e.prioritas))
            ? teks(e.prioritas)
            : "Should Have") as Fitur["prioritas"],
        };
      })
  );
}

export function mintaPaketStories(prd: Prd) {
  return panggilAi("stories", "User stories", prd).then((data) =>
    kemasPaket<UserStory>(data, (e) => {
      const sebagai = teks(e.sebagai);
      const ingin = teks(e.ingin);
      if (!sebagai && !ingin) return null;
      return {
        id: uid(),
        sebagai,
        ingin,
        agar: teks(e.agar),
        kriteria: teks(e.kriteria),
      };
    })
  );
}

export function mintaPaketMetrik(prd: Prd) {
  return panggilAi("metrik", "Metrik keberhasilan (KPI)", prd).then((data) =>
    kemasPaket<Metrik>(data, (e) => {
      const nama = teks(e.nama);
      if (!nama) return null;
      return {
        id: uid(),
        nama,
        target: teks(e.target),
        deskripsi: teks(e.deskripsi),
      };
    })
  );
}

export function mintaPaketMilestone(prd: Prd) {
  return panggilAi("milestones", "Timeline / milestone", prd).then((data) =>
    kemasPaket<Milestone>(data, (e) => {
      const fase = teks(e.fase);
      if (!fase) return null;
      return {
        id: uid(),
        fase,
        waktu: teks(e.waktu),
        deskripsi: teks(e.deskripsi),
      };
    })
  );
}

export function mintaPaketStakeholder(prd: Prd) {
  return panggilAi("stakeholders", "Stakeholder", prd).then((data) =>
    kemasPaket<Stakeholder>(data, (e) => {
      const peran = teks(e.peran);
      if (!peran) return null;
      return {
        id: uid(),
        nama: teks(e.nama),
        peran,
        tanggungJawab: teks(e.tanggungJawab),
      };
    })
  );
}
