import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Step A: pick a region
function RegionGrid({ regions, onSelectRegion }) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Choose Your Region!</CardTitle>
          <Badge variant="blue">First Session Setup</Badge>
        </div>
        <CardDescription>
          Your region determines which Pokémon you can catch and the art style used.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {regions.map((region) => (
            <button
              key={region.regionId}
              type="button"
              onClick={() => onSelectRegion(region.regionId)}
              className={[
                "w-full text-left p-4 border-[3px] transition-all duration-100 cursor-pointer",
                "shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),3px_3px_0_rgba(0,0,0,0.12)]",
                "border-[var(--window-border)] bg-white hover:-translate-x-0.5 hover:-translate-y-0.5",
                "hover:shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),5px_5px_0_rgba(0,0,0,0.18)]",
              ].join(" ")}
            >
              <p className="font-pixel text-[10px] tracking-wide text-[var(--text-dark)]">
                {region.label}
              </p>
              <p className="font-pixel-body text-[14px] text-[var(--text-muted)] mt-1">
                {region.starters.map((s) => s.label).join(" · ")}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Step B: pick a starter within the chosen region
function StarterGrid({
  starters,
  previewStarterKey,
  playingStarterKey,
  onPreviewStarter,
  onBeginSession,
  previewStarterLabel,
  onBack,
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

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="shrink-0"
          >
            ← Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onBeginSession}
            className="w-full"
          >
            Start with {previewStarterLabel}!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StarterSelection({
  regions,
  selectedRegion,
  onSelectRegion,
  onClearRegion,
  starters,
  previewStarterKey,
  playingStarterKey,
  onPreviewStarter,
  onBeginSession,
  previewStarterLabel,
}) {
  if (!selectedRegion) {
    return <RegionGrid regions={regions} onSelectRegion={onSelectRegion} />;
  }

  return (
    <StarterGrid
      starters={starters}
      previewStarterKey={previewStarterKey}
      playingStarterKey={playingStarterKey}
      onPreviewStarter={onPreviewStarter}
      onBeginSession={onBeginSession}
      previewStarterLabel={previewStarterLabel}
      onBack={onClearRegion}
    />
  );
}
