import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-arena-bg">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-arena-border px-4 py-8">
        <div className="mx-auto max-w-6xl text-center meta text-arena-muted">
          ArenaHub — Platform Turnamen Esport · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}