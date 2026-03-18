"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function WildEncounterModal({
  wildPokemon,
  catchResult,
  partyFull,
  onAttemptCatch,
  onSetActive,
  onDismiss,
}) {
  if (!wildPokemon) return null;

  const title = catchResult === "success"
    ? `Gotcha! ${wildPokemon.label} was caught!`
    : catchResult === "fail"
    ? `Oh no! ${wildPokemon.label} broke free!`
    : `A wild ${wildPokemon.label} appeared!`;

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Pokemon sprite */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="w-28 h-28 border-[3px] border-[var(--window-border)] bg-white shadow-[inset_2px_2px_0_#f0f0f0,inset_-2px_-2px_0_#d0d0d0] flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wildPokemon.sprite}
              alt={wildPokemon.label}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <p className="font-pixel text-[11px] tracking-wide text-[var(--text-dark)]">
            {wildPokemon.label}
          </p>

          {!catchResult && partyFull && (
            <p className="font-pixel-body text-[18px] text-[var(--text-muted)] text-center">
              Your party is full (6/6). Release a Pokémon to catch more.
            </p>
          )}
        </div>

        <DialogFooter>
          {!catchResult && (
            <>
              <Button variant="primary" onClick={onAttemptCatch} disabled={partyFull}>
                Throw Pokéball!
              </Button>
              <Button variant="ghost" onClick={onDismiss}>
                Run
              </Button>
            </>
          )}
          {catchResult === "success" && (
            <>
              <Button variant="primary" onClick={onSetActive}>
                Set as Active
              </Button>
              <Button variant="ghost" onClick={onDismiss}>
                Keep Current
              </Button>
            </>
          )}
          {catchResult === "fail" && (
            <Button variant="secondary" onClick={onDismiss}>
              Continue Studying
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
