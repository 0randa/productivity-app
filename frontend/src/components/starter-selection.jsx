import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StarterSelection({
  starters,
  previewStarterKey,
  playingStarterKey,
  onPreviewStarter,
  onBeginSession,
  previewStarterLabel,
}) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Choose Your Starter!</CardTitle>
          <Badge variant="blue">First Session Setup</Badge>
        </div>
        <CardDescription>
          Your progress is saved locally. Sign up to sync across devices.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="starters-grid">
          {starters.map((starter) => {
            const isSelected = starter.key === previewStarterKey;
            const isPlaying  = starter.key === playingStarterKey;

            return (
              <button
                key={starter.key}
                type="button"
                onClick={() => onPreviewStarter(starter)}
                className={[
                  "w-full text-left p-4 border-[3px] transition-all duration-100 cursor-pointer",
                  "shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),3px_3px_0_rgba(0,0,0,0.12)]",
                  isSelected
                    ? "border-[var(--poke-red)] bg-[#fff8f0] shadow-[inset_2px_2px_0_#fff0e0,inset_-2px_-2px_0_#e8d8c8,5px_5px_0_rgba(224,64,56,0.25)] -translate-x-0.5 -translate-y-0.5"
                    : "border-[var(--window-border)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),5px_5px_0_rgba(0,0,0,0.18)]",
                ].join(" ")}
              >
                {/* Sprite area */}
                <div
                  className={[
                    "w-full h-24 border-[2px] flex items-center justify-center mb-3",
                    isSelected
                      ? "bg-[#f8e0d0] border-[var(--poke-red)]"
                      : "bg-[#e8e8e8] border-[var(--window-border)]",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={starter.sprite}
                    alt={starter.label}
                    className="max-h-[88px] object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>

                <p className="font-pixel text-[9px] tracking-wide text-[var(--text-dark)] mb-1">
                  {starter.label}
                </p>
                <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">
                  {isPlaying ? "Playing cry..." : "Click to hear cry"}
                </p>
              </button>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onBeginSession}
          className="w-full"
        >
          Start with {previewStarterLabel}!
        </Button>
      </CardContent>
    </Card>
  );
}
