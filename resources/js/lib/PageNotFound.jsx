import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-heading text-7xl font-extrabold text-arena-border">404</h1>
      <h2 className="mt-3 font-heading text-2xl font-bold">Halaman Tidak Ditemukan</h2>
      <p className="meta mt-2 text-arena-muted">
        Halaman <span className="font-semibold text-arena-text">"{pageName}"</span> tidak ada di ArenaHub.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg transition-all duration-300 hover:scale-105"
      >
        Kembali ke Home
      </Link>
    </div>
  );
}
