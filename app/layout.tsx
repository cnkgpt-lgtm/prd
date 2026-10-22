import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aplikasi PRD — Product Requirements Document",
  description:
    "Aplikasi pembuat dan pengelola Product Requirements Document (Dokumen Persyaratan Produk) berbahasa Indonesia — acuan tunggal (single source of truth) pengembangan produk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
