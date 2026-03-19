"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function WildEncounterModal({
  wildPokemon,
  catchResult,
  partyFull,
  party = [],
  onAttemptCatch,
  onSetActive,
  onReplace,
  onDismiss,
}) {
  if (!wildPokemon) return null;

  const title =
    catchResult === "success"
      ? `Gotcha! ${wildPokemon.label} was caught!`
      : catchResult === "fail"
        ? `Oh no! ${wildPokemon.label} broke free!`
        : `A wild ${wildPokemon.label} appeared!`;

  const showReplacePicker = catchResult === "success" && partyFull;

  return (
    <Dialog open onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {!catchResult && partyFull ? (
            <DialogDescription>
              Your party is full. Catch it and choose who to swap out.
            </DialogDescription>
          ) : null}
          {showReplacePicker ? (
            <DialogDescription>
              Choose a Pokemon to release to make room.
            </DialogDescription>
          ) : null}
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
        </div>

        {/* Party picker — shown after a successful catch when party is full */}
        {showReplacePicker && (
          <div className="space-y-2">
            <p className="font-pixel text-[9px] tracking-widest uppercase text-[var(--text-dark)]">
              Release which Pokemon?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {party.map((p, i) => (
                <button
                  key={i}
                  onClick={() => onReplace(i)}
                  className="flex items-center gap-2 p-2 border-[2px] border-[var(--window-border)] bg-white hover:bg-[var(--window-bg)] transition-colors text-left"
                >
                  {p?.sprite && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.sprite}
                      alt={p.label}
                      className="w-8 h-8 object-contain flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                  <span className="font-pixel text-[8px] tracking-wide text-[var(--text-dark)] truncate">
                    {p?.label ?? "???"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {!catchResult && (
            <>
              <Button variant="primary" onClick={onAttemptCatch}>
                Throw Pokeball!
              </Button>
              <Button variant="ghost" onClick={onDismiss}>
                Run
              </Button>
            </>
          )}
          {catchResult === "success" && !partyFull && (
            <>
              <Button variant="primary" onClick={onSetActive}>
                Set as Active
              </Button>
              <Button variant="ghost" onClick={onDismiss}>
                Keep Current
              </Button>
            </>
          )}
          {showReplacePicker && (
            <Button variant="ghost" onClick={onDismiss}>
              Release {wildPokemon.label}
            </Button>
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
