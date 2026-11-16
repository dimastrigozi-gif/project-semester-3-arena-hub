import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Mail, User as UserIcon, Shield } from "lucide-react";

export default function Profil() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-arena-muted">Kamu belum login.</p>
        <Link to="/signin" className="mt-4 inline-block rounded-md bg-arena-cyan px-5 py-2.5 font-semibold text-arena-bg">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="h1 mb-8">Profil</h1>
      <div className="flex items-center gap-4 rounded-lg border border-arena-border bg-arena-card p-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-arena-purple text-xl font-bold text-white">
          {user.name?.[0]?.toUpperCase() || "U"}
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold">{user.name}</h2>
          <p className="meta text-arena-muted capitalize flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> {user.role}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-arena-border bg-arena-card p-5">
        <Row icon={UserIcon} label="Username" value={user.username} />
        <Row icon={Mail} label="Email" value={user.email} />
      </div>

      {user.role === "organizer" ? (
        <Link
          to="/organizer/buat-turnamen"
          className="mt-4 block rounded-md bg-arena-purple px-4 py-3 text-center font-semibold text-white"
        >
          Buat Turnamen Baru
        </Link>
      ) : (
        <Link
          to="/cari-turnamen"
          className="mt-4 block rounded-md bg-arena-cyan px-4 py-3 text-center font-semibold text-arena-bg"
        >
          Cari Turnamen
        </Link>
      )}

      <button
        onClick={logout}
        className="mt-3 w-full rounded-md border border-arena-danger/40 px-4 py-3 font-semibold text-arena-danger"
      >
        Logout
      </button>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-arena-border py-2 last:border-0">
      <Icon className="h-4 w-4 text-arena-muted" />
      <span className="meta w-24 text-arena-muted">{label}</span>
      <span className="meta font-semibold">{value}</span>
    </div>
  );
}