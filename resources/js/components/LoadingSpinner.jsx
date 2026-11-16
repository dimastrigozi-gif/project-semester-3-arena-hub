import React from "react";

// Spinner sederhana pakai Tailwind, dipakai waktu nunggu data dari Laravel
export default function LoadingSpinner({ text = "Memuat data turnamen..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-arena-border border-t-arena-cyan" />
      <p className="meta text-arena-muted">{text}</p>
    </div>
  );
}
