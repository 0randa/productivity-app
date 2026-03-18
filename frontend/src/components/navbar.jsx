"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Moon, Sun, UserPlus, UserRound } from "lucide-react";
import { Tooltip } from "@chakra-ui/react";
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
          <Tooltip label={dark ? "Switch to light mode" : "Switch to dark mode"} placement="bottom" hasArrow>
            <button
              onClick={toggle}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "6px",
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </Tooltip>
          {!loading && (
            user ? (
              <>
                <Tooltip label="Account" placement="bottom" hasArrow>
                  <Link href="/account" className="pokemon-nav-link" style={{ display: "flex", alignItems: "center" }}>
                    <UserRound size={16} />
                  </Link>
                </Tooltip>
                <Tooltip label="Sign out" placement="bottom" hasArrow>
                  <button
                    onClick={handleSignOut}
                    className="pokemon-nav-link"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                  >
                    <LogOut size={16} />
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip label="Register" placement="bottom" hasArrow>
                  <Link href="/register" className="pokemon-nav-link" style={{ display: "flex", alignItems: "center" }}>
                    <UserPlus size={16} />
                  </Link>
                </Tooltip>
                <Tooltip label="Login" placement="bottom" hasArrow>
                  <Link href="/login" className="pokemon-nav-link" style={{ display: "flex", alignItems: "center" }}>
                    <LogIn size={16} />
                  </Link>
                </Tooltip>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
