import { useEffect, useMemo, useRef, useState } from "react";

export function useStarterSelection(starters) {
  const [previewStarter, setPreviewStarter] = useState(starters[0]?.key ?? "");
  const [playingStarter, setPlayingStarter] = useState("");

  // Reset selection whenever the starters list changes (e.g. region switch).
  const firstKey = starters[0]?.key ?? "";
  useEffect(() => {
    setPreviewStarter(firstKey);
    setPlayingStarter("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstKey]);
  const audioRef = useRef(null);

  const previewStarterData = useMemo(
    () => starters.find((starter) => starter.key === previewStarter) ?? starters[0],
    [previewStarter, starters],
  );

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playStarterCry = async (starterChoice) => {
    setPreviewStarter(starterChoice.key);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const cryAudio = new Audio(starterChoice.cry);
    cryAudio.volume = 0.75;
    audioRef.current = cryAudio;

    cryAudio.onended = () => {
      setPlayingStarter((current) =>
        current === starterChoice.key ? "" : current,
      );
    };

    try {
      await cryAudio.play();
      setPlayingStarter(starterChoice.key);
    } catch (error) {
      setPlayingStarter("");
      console.error("Could not play starter cry:", error);
    }
  };

  return {
    previewStarter,
    previewStarterData,
    playingStarter,
    playStarterCry,
  };
}
