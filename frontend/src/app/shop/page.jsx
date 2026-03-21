"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { loadGuestData, saveGuestData } from "@/lib/guest-storage";
import { loadUserProgress, saveUserProgress, loadInventory, saveInventoryItem } from "@/lib/user-progress";
import { SHOP_ITEMS } from "@/lib/shop";
import StudyShell from "@/components/study-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopPage() {
  const { user, loading } = useAuth();
  const [pokedollars, setPokedollars] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [totalXp, setTotalXp] = useState(0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [activePokemon, setActivePokemon] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      Promise.all([loadUserProgress(), loadInventory()]).then(
        ([progress, inv]) => {
          setPokedollars(progress.pokedollars ?? 0);
          setTotalXp(progress.totalXp ?? 0);
          setPomodorosCompleted(progress.pomodorosCompleted ?? 0);
          setActivePokemon(progress.activePokemon);
          setRegionId(progress.regionId);
          setInventory(inv ?? []);
          setDataLoaded(true);
        },
      );
    } else {
      const saved = loadGuestData();
      setPokedollars(saved?.pokedollars ?? 0);
      setTotalXp(saved?.totalXp ?? 0);
      setPomodorosCompleted(saved?.pomodorosCompleted ?? 0);
      setActivePokemon(saved?.activePokemon ?? null);
      setRegionId(saved?.regionId ?? null);
      setInventory(saved?.inventory ?? []);
      setDataLoaded(true);
    }
  }, [user, loading]);

  const getOwnedQuantity = (itemId) => {
    const entry = inventory.find((i) => i.itemId === itemId);
    return entry?.quantity ?? 0;
  };

  const handleBuy = async (shopItem) => {
    if (pokedollars < shopItem.price) return;
    setBuying(shopItem.id);

    const newBalance = pokedollars - shopItem.price;
    setPokedollars(newBalance);

    const existing = inventory.find((i) => i.itemId === shopItem.id);
    const newQuantity = (existing?.quantity ?? 0) + 1;
    const newInventory = existing
      ? inventory.map((i) => i.itemId === shopItem.id ? { ...i, quantity: newQuantity } : i)
      : [...inventory, { itemId: shopItem.id, quantity: 1 }];
    setInventory(newInventory);

    if (user) {
      await Promise.all([
        saveUserProgress({ activePokemon, totalXp, pomodorosCompleted, pokedollars: newBalance, regionId }),
        saveInventoryItem(shopItem.id, newQuantity),
      ]);
    } else {
      const saved = loadGuestData() ?? {};
      saveGuestData({ ...saved, pokedollars: newBalance, inventory: newInventory });
    }

    setBuying(null);
  };

  if (loading || !dataLoaded) {
    return (
      <StudyShell>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-5">
              <p className="font-pixel-body text-[20px] text-[var(--text-muted)]">Loading…</p>
            </CardContent>
          </Card>
        </div>
      </StudyShell>
    );
  }

  return (
    <StudyShell>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge variant="blue">PokéMart</Badge>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[11px] tracking-wide text-[var(--text-dark)]">
              ₽{pokedollars.toLocaleString()}
            </span>
          </div>
        </div>

        {pokedollars === 0 && inventory.length === 0 && (
          <Card>
            <CardContent className="pt-5">
              <p className="font-pixel-body text-[20px] text-[var(--text-muted)]">
                Complete pomodoros to earn Pokédollars! You get ₽100 per session.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Evolution Stones */}
        <Card>
          <CardHeader>
            <CardTitle>Evolution Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHOP_ITEMS.map((item) => {
                const owned = getOwnedQuantity(item.id);
                const canAfford = pokedollars >= item.price;
                const isBuying = buying === item.id;

                return (
                  <div
                    key={item.id}
                    className={[
                      "flex items-start gap-3 p-3",
                      "border-[2px] border-[var(--window-border)] bg-[var(--window-bg)]",
                      "shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)]",
                    ].join(" ")}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-pixel text-[10px] tracking-wide text-[var(--text-dark)]">
                          {item.label}
                        </span>
                        {owned > 0 && (
                          <Badge variant="outline" className="text-[7px]">
                            ×{owned}
                          </Badge>
                        )}
                      </div>
                      <p className="font-pixel-body text-[16px] text-[var(--text-muted)] leading-snug">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="font-pixel text-[9px] tracking-wide text-[var(--text-dark)]">
                        ₽{item.price}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!canAfford || isBuying}
                        onClick={() => handleBuy(item)}
                      >
                        {isBuying ? "…" : "Buy"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Inventory summary */}
        {inventory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Bag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {inventory.filter((i) => i.quantity > 0).map((entry) => {
                  const item = SHOP_ITEMS.find((s) => s.id === entry.itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={entry.itemId}
                      className="flex items-center gap-1.5 px-2 py-1 border-[2px] border-[var(--window-border)] bg-[var(--window-bg)]"
                    >
                      <span className="font-pixel text-[8px] tracking-wide text-[var(--text-dark)]">
                        {item.label}
                      </span>
                      <Badge variant="outline" className="text-[7px]">
                        ×{entry.quantity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StudyShell>
  );
}
