export type StatusPrd = "draft" | "in_review" | "approved" | "archived";

export type Prioritas = "Must Have" | "Should Have" | "Could Have" | "Won't Have";

export interface Fitur {
  id: string;
  nama: string;
  deskripsi: string;
  prioritas: Prioritas;
}

export interface UserStory {
  id: string;
  sebagai: string;
  ingin: string;
  agar: string;
  kriteria: string;
}

export interface Metrik {
  id: string;
  nama: string;
  target: string;
  deskripsi: string;
}

export interface Milestone {
  id: string;
  fase: string;
  waktu: string;
  deskripsi: string;
}

export interface Stakeholder {
  id: string;
  nama: string;
  peran: string;
  tanggungJawab: string;
}

export interface Prd {
  id: string;
  judul: string;
  produk: string;
  pemilik: string;
  versi: string;
  status: StatusPrd;
  overview: string;
  masalah: string;
  tujuan: string;
  targetPengguna: string;
  scope: string;
  outOfScope: string;
  nonFungsional: string;
  risiko: string;
  asumsi: string;
  fitur: Fitur[];
  stories: UserStory[];
  metrik: Metrik[];
  milestones: Milestone[];
  stakeholders: Stakeholder[];
  dibuatPada: string;
  diubahPada: string;
  /** true bila dokumen ini adalah contoh bawaan dari dokumen resmi */
  contoh?: boolean;
}

export const STATUS_LABEL: Record<StatusPrd, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  archived: "Arsip",
};

export const STATUS_BADGE: Record<StatusPrd, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-600/20",
  in_review: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

export const PRIORITAS_BADGE: Record<Prioritas, string> = {
  "Must Have": "bg-red-50 text-red-700 ring-red-600/20",
  "Should Have": "bg-orange-50 text-orange-700 ring-orange-600/20",
  "Could Have": "bg-sky-50 text-sky-700 ring-sky-600/20",
  "Won't Have": "bg-zinc-100 text-zinc-500 ring-zinc-500/20",
};

export const DAFTAR_PRIORITAS: Prioritas[] = [
  "Must Have",
  "Should Have",
  "Could Have",
  "Won't Have",
];

export const DAFTAR_STATUS: StatusPrd[] = [
  "draft",
  "in_review",
  "approved",
  "archived",
];
