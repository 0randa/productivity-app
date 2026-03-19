"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { loadUserProgress } from "@/lib/user-progress";
import StudyShell from "@/components/study-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BoxPage() {
  const { user, loading } = useAuth();
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadUserProgress().then(({ activePokemon: ap, caughtPokemon: caught }) => {
      setActivePokemon(ap);
      setCaughtPokemon(caught ?? []);
    });
  }, [user]);

  const { partyPokemon, boxedPokemon } = useMemo(() => {
    const all = Array.isArray(caughtPokemon) ? caughtPokemon : [];
    return {
      partyPokemon: all.slice(0, 6),
      boxedPokemon: all.slice(6),
    };
  }, [caughtPokemon]);

  if (loading) {
    return (
      <StudyShell>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-5">
              <p className="font-pixel-body text-[20px] text-[var(--text-muted)]">Loading…</p>
            </CardContent>
          </Card>
        </div>
      </StudyShell>
    );
  }

  if (!user) {
    return (
      <StudyShell>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-5">
              <p className="font-pixel text-[11px] text-[var(--text-dark)]">Not logged in</p>
              <p className="font-pixel-body text-[20px] text-[var(--text-muted)] mt-3">
                Please{" "}
                <Link href="/login" className="text-[var(--poke-blue)] hover:underline">
                  log in
                </Link>{" "}
                to view your Box.
              </p>
            </CardContent>
          </Card>
        </div>
      </StudyShell>
    );
  }

  return (
    <StudyShell>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Box</Badge>
            <p className="font-pixel-body text-[18px] text-[var(--text-muted)]">
              Extra Pokémon beyond your party of 6 live here.
            </p>
          </div>
          <Link href="/account" className="text-[var(--poke-blue)] hover:underline font-pixel text-[10px]">
            Back to Account
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stored Pokémon</CardTitle>
              <Badge variant="outline">{boxedPokemon.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {boxedPokemon.length === 0 ? (
              <p className="font-pixel-body text-[20px] text-[var(--text-muted)]">
                Your Box is empty. Catch more Pokémon to store extras here.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {boxedPokemon.map((pokemon, i) => {
                  const isActive = activePokemon?.speciesName === pokemon.speciesName;
                  return (
                    <div
                      key={`${pokemon.speciesName ?? pokemon.key ?? "p"}-${i}`}
                      className={[
                        "flex flex-col items-center p-3 text-center",
                        "border-[2px] shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)]",
                        isActive
                          ? "border-[var(--poke-blue)] bg-[rgba(56,104,176,0.06)]"
                          : "border-[var(--window-border)] bg-[var(--window-bg)]",
                      ].join(" ")}
                    >
                      {isActive && (
                        <Badge variant="blue" className="mb-2 text-[7px]">
                          Active
                        </Badge>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pokemon.sprite}
                        alt={pokemon.label}
                        className="w-16 h-16 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <p className="font-pixel-body text-[18px] text-[var(--text-dark)] mt-1">
                        {pokemon.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3">
              <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">
                Party: {partyPokemon.length}/6 · Box: {boxedPokemon.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudyShell>
  );
}

