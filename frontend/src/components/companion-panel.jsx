import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function CompanionPanel({
  activePokemon,
  level,
  xpInCurrentLevel,
  xpNeededForNextLevel,
  xpProgress,
  nextLevel,
  maxLevel,
  isGrowthDataLoading,
  growthDataError,
  nextEvolution,
  canEvolve,
  onEvolve,
  streak,
  dailyXpEarned,
  availableTaskClaims,
  totalXp,
  pokedollars,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Companion</CardTitle>
          <Badge variant="blue">Partner</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Sprite + identity */}
        <div className="flex items-center gap-4">
          <div
            className="relative flex-shrink-0 w-28 h-28 border-[3px] border-[var(--window-border)] bg-white shadow-[inset_2px_2px_0_#f0f0f0,inset_-2px_-2px_0_#d0d0d0] flex items-center justify-center p-1"
            style={{ imageRendering: "pixelated" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePokemon.sprite}
              alt={activePokemon.label}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-pixel text-[13px] leading-relaxed tracking-wide text-[var(--text-dark)] truncate">
              {activePokemon.label}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="yellow">Lv.{level}</Badge>
              {level >= maxLevel && <Badge variant="red">MAX</Badge>}
            </div>
            <p className="font-pixel-body text-[16px] text-[var(--text-muted)] mt-2">
              Every quest grows your partner!
            </p>
          </div>
        </div>

        <Separator />

        {/* XP Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-[8px] tracking-widest uppercase text-[var(--text-muted)]">EXP Points</span>
            <span className="font-pixel-body text-[18px] text-[var(--text-muted)]">
              {level >= maxLevel
                ? "MAX LEVEL!"
                : `${xpInCurrentLevel} / ${xpNeededForNextLevel} → Lv.${nextLevel}`}
            </span>
          </div>
          <Progress value={xpProgress} indicatorClassName="bg-[var(--xp-blue)]" />
          {isGrowthDataLoading && (
            <p className="font-pixel-body text-[16px] text-[var(--text-muted)] mt-1">Loading…</p>
          )}
          {growthDataError && (
            <p className="font-pixel-body text-[16px] mt-1" style={{ color: "var(--poke-red)" }}>
              {growthDataError}
            </p>
          )}
        </div>

        {/* Evolution hint */}
        {nextEvolution && (
          <div className="border-[2px] border-[var(--poke-blue)] bg-[rgba(88,160,232,0.08)] p-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="font-pixel-body text-[18px] text-[var(--text-dark)]">
              → <strong>{nextEvolution.label}</strong>
              {nextEvolution.requiredShopItem
                ? ` (${nextEvolution.requiredShopItem.label})`
                : typeof nextEvolution.minLevel === "number"
                  ? ` at Lv.${nextEvolution.minLevel}`
                  : " (special)"}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={onEvolve}
              disabled={!canEvolve}
            >
              {nextEvolution.requiredShopItem && !canEvolve
                ? `Need ${nextEvolution.requiredShopItem.label}`
                : "Evolve!"}
            </Button>
          </div>
        )}

        <Separator />

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Streak",      value: streak === 0 ? "—" : `${streak}d` },
            { label: "Today XP",   value: dailyXpEarned > 0 ? `${dailyXpEarned}${dailyXpEarned > 300 ? " ↓" : ""}` : "—" },
            { label: "Total XP",   value: totalXp },
            { label: "Pokédollars", value: `₽${(pokedollars ?? 0).toLocaleString()}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-[var(--window-bg)] border-[2px] border-[var(--window-border)] shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)] p-2 text-center"
            >
              <p className="font-pixel text-[7px] tracking-widest uppercase text-[var(--text-muted)] mb-1">{label}</p>
              <p className="font-pixel text-[14px] text-[var(--text-dark)]">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
