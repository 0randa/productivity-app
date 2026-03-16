"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/login", label: "Login" },
];

export function NavbarComp() {
  return (
    <nav className="pokemon-navbar">
      <div className="poke-container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="pokeball-dot" />
          <span className="pokemon-nav-title">PomoPet</span>
          <span className="pokemon-nav-subtitle">
            Your daily training arc
          </span>
        </div>
        <div className="pokemon-nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="pokemon-nav-link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
