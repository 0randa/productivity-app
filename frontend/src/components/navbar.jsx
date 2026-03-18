"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { clearGuestData } from "@/lib/guest-storage";
import { useTheme } from "@/hooks/use-theme";

export function NavbarComp() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    clearGuestData();
    router.push("/");
  };

  return (
    <nav className="pokemon-navbar">
      <div className="poke-container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="pokeball-dot" />
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="pokemon-nav-title">PomoPet</span>
            <span className="pokemon-nav-subtitle">Your daily training arc</span>
          </Link>
        </div>
        <div className="pokemon-nav-links">
          <button
            onClick={toggle}
            className="pokemon-nav-link"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? "☀" : "☾"}
          </button>
          {!loading && (
            user ? (
              <>
                <Link href="/account" className="pokemon-nav-link">Account</Link>
                <button
                  onClick={handleSignOut}
                  className="pokemon-nav-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="pokemon-nav-link">Register</Link>
                <Link href="/login" className="pokemon-nav-link">Login</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
