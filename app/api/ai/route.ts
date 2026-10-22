import { NextRequest, NextResponse } from "next/server";

/**
 * Route server "Pilihan AI" — memanggil Google Gemini memakai
 * GEMINI_API_KEY yang hanya ada di environment server (Vercel).
 * Key TIDAK pernah dikirim ke klien; route ini hanya mengembalikan
 * pilihan jawaban terstruktur. Bila key tidak ada / Gemini menolak /
 * timeout, route mengembalikan error agar klien memakai pustaka saran
 * bawaan aplikasi (fallback lokal).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_UTAMA = "gemini-2.5-flash";
const MODEL_CADANGAN = "gemini-2.0-flash";
const BATAS_WAKTU_MS = 25_000;

type Jenis =
  | "teks"
  | "fitur"
  | "stories"
  | "metrik"
  | "milestones"
  | "stakeholders";

interface MintaBody {
  jenis: Jenis;
  pertanyaan?: string;
  produk?: string;
  judul?: string;
  konteks?: Record<string, string>;
}

const SKEMA: Record<Jenis, string> = {
  teks: `{"pilihan":[{"label":"Ringkas","teks":"..."},{"label":"Formal","teks":"..."},{"label":"Fokus Pengguna","teks":"..."}]} — tepat 3 pilihan, label persis seperti contoh, teks adalah jawaban lengkap siap ditempel ke kolom PRD.`,
  fitur: `{"paket":[{"label":"nama paket singkat","entri":[{"nama":"nama fitur","deskripsi":"deskripsi fitur","prioritas":"Must Have|Should Have|Could Have|Won't Have"}]}]} — tepat 3 paket, masing-masing 2-3 entri fitur.`,
  stories: `{"paket":[{"label":"nama paket singkat","entri":[{"sebagai":"...","ingin":"...","agar":"...","kriteria":"kriteria penerimaan"}]}]} — tepat 3 paket, masing-masing 2 entri user story.`,
  metrik: `{"paket":[{"label":"nama paket singkat","entri":[{"nama":"nama metrik","target":"target terukur","deskripsi":"cara mengukur"}]}]} — tepat 3 paket, masing-masing 2 entri metrik KPI.`,
  milestones: `{"paket":[{"label":"nama paket singkat","entri":[{"fase":"nama fase","waktu":"rentang waktu","deskripsi":"deskripsi fase"}]}]} — tepat 3 paket, masing-masing 2-3 entri milestone berurutan.`,
  stakeholders: `{"paket":[{"label":"nama paket singkat","entri":[{"nama":"","peran":"peran stakeholder","tanggungJawab":"tanggung jawabnya"}]}]} — tepat 3 paket, masing-masing 2-4 entri stakeholder. Nama orang boleh string kosong.`,
};

function buatPrompt(body: MintaBody): string {
  const produk = (body.produk || "").trim() || "produk ini";
  const judul = (body.judul || "").trim();
  const konteks = Object.entries(body.konteks || {})
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `- ${k}: ${v.slice(0, 500)}`)
    .join("\n");

  const sasaran =
    body.jenis === "teks"
      ? `bagian/pertanyaan PRD: "${body.pertanyaan || "bagian ini"}"`
      : `daftar entri PRD jenis "${body.jenis}"`;

  return [
    `Kamu adalah Product Manager berpengalaman yang membantu menyusun Product Requirements Document (PRD) berbahasa Indonesia.`,
    `Produk: ${produk}${judul ? ` — judul PRD: "${judul}"` : ""}.`,
    `Tugas: buat pilihan jawaban siap pakai untuk ${sasaran}.`,
    konteks
      ? `Konteks isi PRD yang sudah terisi (pakai untuk mempersonalisasi jawaban, jangan menyalin persis):\n${konteks}`
      : `Belum ada konteks isi lain; buat jawaban umum yang tetap terasa spesifik untuk produk bernama "${produk}".`,
    `Syarat: berbahasa Indonesia, konkret, tidak generik, menyebut nama produk bila wajar, siap ditempel langsung ke dokumen.`,
    `Balas HANYA dengan JSON valid tanpa markdown, mengikuti skema: ${SKEMA[body.jenis]}`,
  ].join("\n\n");
}

async function panggilGemini(
  model: string,
  prompt: string,
  apiKey: string
): Promise<{ ok: true; data: unknown } | { ok: false; status: number }> {
  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), BATAS_WAKTU_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
          },
        }),
        signal: kontrol.signal,
      }
    );
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const teks = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!teks) return { ok: false, status: 502 };
    const bersih = teks.replace(/```json|```/g, "").trim();
    return { ok: true, data: JSON.parse(bersih) };
  } catch {
    return { ok: false, status: 504 };
  } finally {
    clearTimeout(timer);
  }
}

function validasi(jenis: Jenis, data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (jenis === "teks") {
    return (
      Array.isArray(d.pilihan) &&
      d.pilihan.length >= 1 &&
      d.pilihan.every(
        (p) =>
          p &&
          typeof p === "object" &&
          typeof (p as { teks?: unknown }).teks === "string"
      )
    );
  }
  return (
    Array.isArray(d.paket) &&
    d.paket.length >= 1 &&
    d.paket.every(
      (p) =>
        p &&
        typeof p === "object" &&
        Array.isArray((p as { entri?: unknown }).entri)
    )
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "gemini_belum_dikonfigurasi" },
      { status: 503 }
    );
  }

  let body: MintaBody;
  try {
    body = (await req.json()) as MintaBody;
  } catch {
    return NextResponse.json({ error: "permintaan_tidak_valid" }, { status: 400 });
  }
  const jenis = (body.jenis || "teks") as Jenis;
  if (!SKEMA[jenis]) {
    return NextResponse.json({ error: "jenis_tidak_dikenal" }, { status: 400 });
  }

  const prompt = buatPrompt({ ...body, jenis });

  let hasil = await panggilGemini(MODEL_UTAMA, prompt, apiKey);
  let model = MODEL_UTAMA;
  if (!hasil.ok && (hasil.status === 404 || hasil.status === 400)) {
    // Model utama tidak tersedia untuk key ini — coba model cadangan sekali.
    const cadangan = await panggilGemini(MODEL_CADANGAN, prompt, apiKey);
    if (cadangan.ok) {
      hasil = cadangan;
      model = MODEL_CADANGAN;
    }
  }

  if (!hasil.ok) {
    return NextResponse.json(
      { error: "gemini_tidak_tersedia", statusGemini: hasil.status },
      { status: 502 }
    );
  }
  if (!validasi(jenis, hasil.data)) {
    return NextResponse.json(
      { error: "format_jawaban_tidak_valid" },
      { status: 502 }
    );
  }

  return NextResponse.json({ sumber: "gemini", model, ...(hasil.data as object) });
}
