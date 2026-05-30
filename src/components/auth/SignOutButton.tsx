"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  const [isSigningOut, setIsSigningOut] = useState(false);

  function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    startTransition(() => {
      void signOut({ callbackUrl: "/login" });
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending || isSigningOut}
      className="text-xs font-semibold text-[#6B6B63] transition-colors hover:text-[#C84B31] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending || isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}