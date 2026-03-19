import { supabase } from "./supabase";
import { getPokemonAssets } from "./pokemon";

export async function loadUserProgress() {
  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("*").single(),
    supabase.from("progress").select("*").single(),
  ]);

  const activePokemon = profile
    ? {
        key: profile.starter_key,
        speciesName: profile.starter_key,
        pokemonId: profile.starter_pokemon_id,
        label: profile.starter_label,
        ...getPokemonAssets(profile.starter_pokemon_id),
      }
    : null;

  const { data: caughtRows } = await supabase
    .from("caught_pokemon")
    .select("*")
    .order("caught_at", { ascending: true });

  const caughtPokemon = (caughtRows ?? []).map((row) => ({
    key: row.species_name,
    speciesName: row.species_name,
    pokemonId: row.pokemon_id,
    label: row.label,
    ...getPokemonAssets(row.pokemon_id),
  }));

  // Ensure the starter (activePokemon) appears in the party list for UI/account display,
  // even if it hasn't been inserted into `caught_pokemon` yet.
  const caughtWithStarter = activePokemon
    ? (
        caughtPokemon.some((p) => p?.speciesName === activePokemon.speciesName)
          ? caughtPokemon
          : [activePokemon, ...caughtPokemon]
      )
    : caughtPokemon;

  return {
    activePokemon,
    totalXp: progress?.total_xp ?? 0,
    pomodorosCompleted: progress?.pomodoros_completed ?? 0,
    caughtPokemon: caughtWithStarter,
  };
}

export async function addCaughtPokemon(pokemon) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("caught_pokemon").insert({
    user_id: user.id,
    pokemon_id: pokemon.pokemonId,
    species_name: pokemon.speciesName,
    label: pokemon.label,
  });
}

export async function saveUserProgress({ activePokemon, totalXp, pomodorosCompleted }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const promises = [];

  if (activePokemon) {
    promises.push(
      supabase.from("profiles").upsert({
        id: user.id,
        starter_key: activePokemon.key,
        starter_pokemon_id: activePokemon.pokemonId,
        starter_label: activePokemon.label,
        starter_sprite: activePokemon.sprite,
      })
    );
  }

  promises.push(
    supabase.from("progress").upsert({
      id: user.id,
      total_xp: totalXp,
      pomodoros_completed: pomodorosCompleted,
      updated_at: new Date().toISOString(),
    })
  );

  await Promise.all(promises);
}
