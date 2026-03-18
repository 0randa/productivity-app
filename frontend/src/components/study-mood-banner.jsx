import { Badge } from "@/components/ui/badge";

export default function StudyMoodBanner({
  greetingLabel,
  activePokemonLabel,
  currentLevel,
  openTasks,
  availableTaskClaims,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-5 py-4 bg-[var(--window-bg)] border-[3px] border-[var(--window-border)] shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),5px_5px_0_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant="red">{greetingLabel}</Badge>
        <span className="font-pixel-body text-[22px] text-[var(--text-dark)]">
          Training with{" "}
          <span className="text-[var(--poke-blue)] font-bold">{activePokemonLabel}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline">Lv.{currentLevel}</Badge>
        <Badge variant="outline">{openTasks} Quests</Badge>
        <Badge variant={availableTaskClaims > 0 ? "green" : "outline"}>
          {availableTaskClaims} Claims
        </Badge>
      </div>
    </div>
  );
}
