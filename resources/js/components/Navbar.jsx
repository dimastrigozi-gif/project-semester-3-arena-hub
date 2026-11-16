import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Trophy, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const pesertaLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/cari-turnamen", label: "Cari Turnamen" },
  { to: "/turnamen-saya", label: "Turnamen Saya" },
  { to: "/jadwal", label: "Jadwal" },
];

const organizerLinks = [
  { to: "/organizer/dashboard", label: "Dashboard" },
  { to: "/organizer/turnamen-saya", label: "Turnamen Saya" },
  { to: "/organizer/buat-turnamen", label: "Buat Turnamen" },
];

const publicLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/cari-turnamen", label: "Cari Turnamen" },
  { to: "/tentang", label: "Tentang" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-arena-cyan text-arena-bg">
        <Trophy className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="font-heading text-lg font-extrabold tracking-tight">
        Arena<span className="text-arena-cyan">Hub</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = !isAuthenticated
    ? publicLinks
    : user.role === "organizer"
    ? organizerLinks
    : pesertaLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    cn(
      "meta font-semibold transition px-1 py-1.5",
      isActive ? "text-arena-cyan" : "text-arena-muted hover:text-arena-text"
    );

  return (
    <header className="sticky top-0 z-40 border-b border-arena-border bg-arena-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/signin"
                className="meta font-semibold text-arena-muted hover:text-arena-text"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="meta rounded-md bg-arena-cyan px-4 py-2 font-semibold text-arena-bg transition hover:brightness-110"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-arena-border px-2.5 py-1.5 hover:border-arena-cyan"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-arena-purple text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="meta font-semibold">{user.name?.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-arena-muted" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-52 rounded-lg border border-arena-border bg-arena-card p-2 shadow-xl">
                    <div className="border-b border-arena-border px-3 py-2">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="meta text-arena-muted capitalize">{user.role}</p>
                    </div>
                    <Link
                      to="/profil"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-md px-3 py-2 meta font-medium hover:bg-arena-bg"
                    >
                      Profil
                    </Link>
                    {user.role === "organizer" && (
                      <Link
                        to="/organizer/buat-turnamen"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-2 meta font-medium hover:bg-arena-bg"
                      >
                        Buat Turnamen
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-md px-3 py-2 text-left meta font-medium text-arena-danger hover:bg-arena-bg"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-arena-border bg-arena-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-arena-border pt-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-arena-border px-4 py-2 text-center meta font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-arena-cyan px-4 py-2 text-center meta font-semibold text-arena-bg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profil"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-arena-border px-4 py-2 text-center meta font-semibold"
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="rounded-md border border-arena-danger/40 px-4 py-2 text-center meta font-semibold text-arena-danger"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}