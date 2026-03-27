"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHECKIN_XP, CHECKIN_POKEDOLLARS } from "@/lib/checkin";

function milestoneMessage(streak) {
  if (streak === 30) return "30-day streak! You're a true Pokémon Master.";
  if (streak === 14) return "Two weeks strong! Keep training!";
  if (streak === 7)  return "One week streak! You're on fire!";
  return null;
}

export function CheckinModal({ streak, onClaim }) {
  const milestone = milestoneMessage(streak);

  return (
    <Dialog open>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" aria-hidden="true" />
            Daily Check-in
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 pt-1">
              {streak > 0 && (
                <p className="font-pixel-body text-[18px]">
                  🔥 {streak}-day streak!
                </p>
              )}
              {milestone && (
                <p className="font-pixel-body text-[16px] text-[var(--poke-blue)]">
                  {milestone}
                </p>
              )}
              <p className="font-pixel-body text-[18px]">
                Today's reward: <strong>+{CHECKIN_XP} XP</strong> and{" "}
                <strong>+{CHECKIN_POKEDOLLARS} Pokédollars</strong>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClaim}>Claim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
