"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, LogIn, LogOut, Moon, Sun, UserPlus, UserRound } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { clearGuestData } from "@/lib/guest-storage";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                  className="pokemon-nav-link"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-light)",
                  }}
                >
                  {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{dark ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
            </Tooltip>

            {!loading && (
              user ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/box"
                        className="pokemon-nav-link"
                        aria-label="Box"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Archive size={16} aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Box</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/account" className="pokemon-nav-link" aria-label="Account" style={{ display: "flex", alignItems: "center" }}>
                        <UserRound size={16} aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Account</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleSignOut}
                        aria-label="Sign out"
                        className="pokemon-nav-link"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                      >
                        <LogOut size={16} aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Sign out</TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/register" className="pokemon-nav-link" aria-label="Register" style={{ display: "flex", alignItems: "center" }}>
                        <UserPlus size={16} aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Register</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/login" className="pokemon-nav-link" aria-label="Login" style={{ display: "flex", alignItems: "center" }}>
                        <LogIn size={16} aria-hidden="true" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Login</TooltipContent>
                  </Tooltip>
                </>
              )
            )}
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
