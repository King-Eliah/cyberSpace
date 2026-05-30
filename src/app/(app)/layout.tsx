import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <nav className="border-b border-[#E8E8E3] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/feed"
              className="text-sm font-semibold tracking-tight hover:text-[#C84B31] transition-colors flex items-center gap-0"
            >
              <span className="text-[#0F0F0E] font-black">cyber</span>
              <span className="text-[#C84B31] font-black">Space</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-[#6B6B63] hover:text-[#0F0F0E] transition-colors">
                Dashboard
              </Link>
              <Link href="/feed" className="text-sm text-[#6B6B63] hover:text-[#0F0F0E] transition-colors">
                Events
              </Link>
              <Link href="/internships" className="text-sm text-[#6B6B63] hover:text-[#0F0F0E] transition-colors">
                Internships
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-[#6B6B63] hover:text-[#0F0F0E] transition-colors"
            >
              {session.user.name?.split(" ")[0] ?? "Profile"}
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs text-[#6B6B63] hover:text-[#C84B31] transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
