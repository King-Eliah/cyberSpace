"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <nav className="border-b border-[#E8E8E3] px-6 py-4">
        <Link href="/" className="flex items-center gap-0">
          <span className="font-black tracking-tight text-[#0F0F0E]">cyber</span>
          <span className="font-black tracking-tight text-[#C84B31]">Space</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[#0F0F0E] mb-2">Sign in</h1>
          <p className="text-[#6B6B63] text-sm mb-8">
            Use your KNUST email to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@st.knust.edu.gh"
                required
                className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
              />
            </div>

            {error && (
              <p className="text-sm text-[#C84B31]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F0F0E] text-white py-3 text-sm font-semibold hover:bg-[#C84B31] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-[#6B6B63] mt-6 text-center">
            No account?{" "}
            <Link
              href="/signup"
              className="text-[#0F0F0E] font-medium hover:text-[#C84B31] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
