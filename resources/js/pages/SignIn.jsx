import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = email.includes("organizer") ? "organizer" : "peserta";
    const u = login({ email, name: role === "organizer" ? "Organizer Demo" : "Peserta Demo", role });
    if (redirect) {
      navigate(redirect);
    } else if (role === "organizer") {
      navigate("/organizer/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-arena-cyan text-arena-bg">
          <Trophy className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h1 className="h1">Sign In</h1>
        <p className="meta mt-2 text-arena-muted">Masuk untuk mengikuti dan mengelola turnamen.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="meta font-semibold">Email / Username</span>
          <div className="flex items-center gap-2 rounded-md border border-arena-border bg-arena-card px-3 focus-within:border-arena-cyan">
            <Mail className="h-4 w-4 text-arena-muted" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@arenahub.id"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-arena-muted"
            />
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="meta font-semibold">Password</span>
          <div className="flex items-center gap-2 rounded-md border border-arena-border bg-arena-card px-3 focus-within:border-arena-cyan">
            <Lock className="h-4 w-4 text-arena-muted" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-arena-muted"
            />
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 rounded-md bg-arena-cyan px-4 py-3 font-semibold text-arena-bg transition hover:brightness-110"
        >
          Sign In
        </button>
      </form>

      <p className="meta mt-6 text-center text-arena-muted">
        Belum punya akun?{" "}
        <Link to="/signup" className="font-semibold text-arena-cyan hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="meta mt-4 rounded-md border border-arena-border bg-arena-card p-3 text-center text-arena-muted">
        Prototype: gunakan email apa pun. Gunakan email mengandung kata "organizer" untuk login sebagai organizer.
      </p>
    </div>
  );
}