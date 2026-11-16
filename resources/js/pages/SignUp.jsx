import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Trophy, Gamepad2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("peserta");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    const u = login({
      name: form.name,
      username: form.username,
      email: form.email,
      role,
    });
    navigate(role === "organizer" ? "/organizer/dashboard" : "/");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-arena-cyan text-arena-bg">
          <Trophy className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h1 className="h1">Sign Up</h1>
        <p className="meta mt-2 text-arena-muted">Buat akun untuk mulai bertanding atau mengelola turnamen.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("peserta")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 transition",
            role === "peserta" ? "border-arena-cyan bg-arena-cyan/10" : "border-arena-border bg-arena-card"
          )}
        >
          <Gamepad2 className="h-6 w-6 text-arena-cyan" />
          <span className="font-heading text-sm font-bold">Peserta</span>
          <span className="meta text-arena-muted">Ikut turnamen</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("organizer")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 transition",
            role === "organizer" ? "border-arena-purple bg-arena-purple/10" : "border-arena-border bg-arena-card"
          )}
        >
          <Building2 className="h-6 w-6 text-arena-purple" />
          <span className="font-heading text-sm font-bold">Organizer</span>
          <span className="meta text-arena-muted">Buat turnamen</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field icon={User} label="Nama" value={form.name} onChange={set("name")} placeholder="Nama lengkap" />
        <Field icon={User} label="Username" value={form.username} onChange={set("username")} placeholder="username" />
        <Field icon={Mail} label="Email" type="email" value={form.email} onChange={set("email")} placeholder="email@arenahub.id" />
        <Field icon={Lock} label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
        <Field icon={Lock} label="Konfirmasi Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
        {form.password !== form.confirm && form.confirm && (
          <p className="meta text-arena-danger">Konfirmasi password tidak cocok.</p>
        )}
        <button
          type="submit"
          className={cn(
            "mt-2 rounded-md px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110",
            role === "organizer" ? "bg-arena-purple text-white" : "bg-arena-cyan"
          )}
        >
          Create Account
        </button>
      </form>

      <p className="meta mt-6 text-center text-arena-muted">
        Sudah punya akun?{" "}
        <Link to="/signin" className="font-semibold text-arena-cyan hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="meta font-semibold">{label}</span>
      <div className="flex items-center gap-2 rounded-md border border-arena-border bg-arena-card px-3 focus-within:border-arena-cyan">
        <Icon className="h-4 w-4 text-arena-muted" />
        <input
          {...props}
          required
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-arena-muted"
        />
      </div>
    </label>
  );
}