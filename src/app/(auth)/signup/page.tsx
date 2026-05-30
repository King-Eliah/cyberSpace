"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COLLEGES = [
  { value: "COE", label: "College of Engineering (COE)" },
  { value: "COS", label: "College of Science (COS)" },
  { value: "KSB", label: "KNUST School of Business (KSB)" },
  { value: "COHS", label: "College of Health Sciences (COHS)" },
  { value: "COA", label: "College of Architecture (COA)" },
  { value: "COAS", label: "College of Art & Social Sciences (COAS)" },
  { value: "IDL", label: "Institute of Distance Learning (IDL)" },
  { value: "OTHER", label: "Other" },
];

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    college: "",
    program: "",
    yearOfStudy: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        yearOfStudy: form.yearOfStudy ? parseInt(form.yearOfStudy) : undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // Auto sign in after signup
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign-in failed. Please sign in.");
      router.push("/login");
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
          <h1 className="text-3xl font-bold text-[#0F0F0E] mb-2">
            Create account
          </h1>
          <p className="text-[#6B6B63] text-sm mb-8">
            KNUST students only. Use your @knust.edu.gh or @st.knust.edu.gh
            email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: "name", label: "Full name", type: "text", placeholder: "Kwame Mensah" },
              { field: "username", label: "Username", type: "text", placeholder: "kwame_m" },
              { field: "email", label: "KNUST email", type: "email", placeholder: "kwame@st.knust.edu.gh" },
              { field: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                College
              </label>
              <select
                value={form.college}
                onChange={(e) => update("college", e.target.value)}
                required
                className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
              >
                <option value="">Select your college</option>
                {COLLEGES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                Program{" "}
                <span className="text-[#6B6B63] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                placeholder="e.g. Computer Engineering"
                className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F0F0E] mb-1.5">
                Year of study{" "}
                <span className="text-[#6B6B63] font-normal">(optional)</span>
              </label>
              <select
                value={form.yearOfStudy}
                onChange={(e) => update("yearOfStudy", e.target.value)}
                className="w-full border border-[#E8E8E3] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0F0F0E] bg-white"
              >
                <option value="">Select year</option>
                {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-[#C84B31] leading-snug">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F0F0E] text-white py-3 text-sm font-semibold hover:bg-[#C84B31] transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-[#6B6B63] mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#0F0F0E] font-medium hover:text-[#C84B31] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
