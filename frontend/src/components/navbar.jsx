"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  Flame,
  Home,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Shield,
  ShoppingBag,
  Sun,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { clearGuestData } from "@/lib/guest-storage";
import { useTheme } from "@/hooks/use-theme";
import { useCheckin } from "@/context/checkin-context";
import { Button } from "@/components/ui/button";

export function NavbarComp() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { dark, toggle } = useTheme();

  const { streak, shieldsAvailable, canUseShield, activateShield } = useCheckin();
  const [showShieldPopover, setShowShieldPopover] = useState(false);
  const shieldPopoverRef = useRef(null);

  useEffect(() => {
    if (!showShieldPopover) return;
    const onClickOutside = (e) => {
      if (shieldPopoverRef.current && !shieldPopoverRef.current.contains(e.target)) {
        setShowShieldPopover(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showShieldPopover]);

  const [menuState, setMenuState] = useState("closed"); // "closed" | "open" | "closing"
  const [selectedIndex, setSelectedIndex] = useState(0);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const handleSignOut = async () => {
    setMenuState("closed");
    await signOut();
    clearGuestData();
    router.push("/");
  };

  /* ── Menu items ──────────────────────────────────────────────── */
  const menuItems = [
    { icon: Home, label: "Study", href: "/" },
    { icon: ShoppingBag, label: "PokéMart", href: "/shop" },
    { icon: Archive, label: "Box", href: "/box" },
    ...(loading
      ? []
      : user
        ? [
            { icon: UserRound, label: "Account", href: "/account" },
            { icon: LogOut, label: "Sign Out", action: handleSignOut },
          ]
        : [
            { icon: UserPlus, label: "Register", href: "/register" },
            { icon: LogIn, label: "Login", href: "/login" },
          ]),
    { icon: X, label: "Close", action: () => closeMenu() },
  ];

  /* ── Open / Close ────────────────────────────────────────────── */
  const openMenu = () => {
    setSelectedIndex(0);
    setMenuState("open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    setMenuState("closing");
    document.body.style.overflow = "";
  };

  const onAnimationEnd = () => {
    if (menuState === "closing") {
      setMenuState("closed");
      triggerRef.current?.focus();
    }
  };

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
      closeMenu();
    }
  };

  /* ── Restore scroll on unmount (page nav while menu open) ───── */
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Keyboard navigation ─────────────────────────────────────── */
  useEffect(() => {
    if (menuState !== "open") return;

    const onKey = (e) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, menuItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          handleItemClick(menuItems[selectedIndex]);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuState, selectedIndex, menuItems.length]);

  /* ── Focus first item on open ────────────────────────────────── */
  useEffect(() => {
    if (menuState === "open" && panelRef.current) {
      const firstItem = panelRef.current.querySelector("[data-menu-item]");
      firstItem?.focus();
    }
  }, [menuState]);

  return (
    <>
      {/* ── Slim top bar ──────────────────────────────────────── */}
      <nav className="pokemon-navbar">
        <div className="poke-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="pokeball-dot" />
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span className="pokemon-nav-title">PomoPet</span>
              <span className="pokemon-nav-subtitle">
                Your daily training arc
              </span>
            </Link>
          </div>

          <div className="pokemon-nav-links">
            {/* Streak counter — only shown for authenticated users with an active streak */}
            {user && streak > 0 && (
              <div role="group" aria-label={`${streak}-day streak`} style={{ position: "relative" }} ref={shieldPopoverRef}>
                <div
                  className="pokemon-nav-link"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--text-light)",
                  }}
                >
                  <Flame size={14} aria-hidden="true" className="text-orange-500" />
                  <span className="font-pixel text-[9px]">{streak}</span>

                  {shieldsAvailable > 0 && (
                    <button
                      onClick={() => setShowShieldPopover((v) => !v)}
                      aria-label="Use streak shield"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        paddingLeft: "4px",
                        color: "var(--text-light)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Shield size={12} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {showShieldPopover && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "var(--window-bg)",
                      border: "2px solid var(--window-border)",
                      padding: "10px 12px",
                      zIndex: 100, // above nav content, below modals
                      minWidth: "220px",
                      boxShadow: "2px 2px 0 var(--window-shadow)",
                    }}
                  >
                    <p className="font-pixel-body text-[16px] text-[var(--text-dark)] mb-3">
                      {canUseShield
                        ? "Use your streak shield? This protects your streak for one missed day."
                        : "Shield can only be used after missing exactly one day."}
                    </p>
                    <div className="flex gap-2">
                      {canUseShield && (
                        <Button
                          size="sm"
                          onClick={() => {
                            activateShield();
                            setShowShieldPopover(false);
                          }}
                        >
                          Use Shield
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowShieldPopover(false)}
                      >
                        {canUseShield ? "Cancel" : "Close"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark / Light toggle — always accessible */}
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
              {dark ? (
                <Sun size={16} aria-hidden="true" />
              ) : (
                <Moon size={16} aria-hidden="true" />
              )}
            </button>

            {/* Menu trigger */}
            <button
              ref={triggerRef}
              onClick={menuState === "open" ? closeMenu : openMenu}
              aria-label="Open menu"
              aria-expanded={menuState === "open"}
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
              <Menu size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Start menu overlay ────────────────────────────────── */}
      {menuState !== "closed" && (
        <>
          {/* Backdrop */}
          <div
            className="start-menu-backdrop"
            data-state={menuState}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Panel */}
          <nav
            ref={panelRef}
            className="start-menu-panel"
            data-state={menuState}
            onAnimationEnd={onAnimationEnd}
            role="menu"
            aria-label="Game menu"
          >
            {/* Header */}
            <div className="start-menu-header">
              <span className="font-pixel text-[11px] tracking-wider text-[var(--text-dark)] uppercase">
                Menu
              </span>
            </div>

            {/* Items */}
            <ul className="flex-1 py-1" style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const sel = selectedIndex === i;

                return (
                  <li key={item.label} role="none">
                    <button
                      data-menu-item
                      role="menuitem"
                      data-selected={sel || undefined}
                      tabIndex={sel ? 0 : -1}
                      className="start-menu-item"
                      onClick={() => handleItemClick(item)}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
