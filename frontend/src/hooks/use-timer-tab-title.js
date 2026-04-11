import { useCallback, useEffect, useRef, useState } from "react";

function canPersistAttentionTitle() {
  if (typeof document === "undefined") return false;
  const hasFocus = typeof document.hasFocus === "function" ? document.hasFocus() : true;
  return document.visibilityState === "hidden" || !hasFocus;
}

export function useTimerTabTitle(activeTitle) {
  const originalTitle = useRef(null);
  const [completionTitle, setCompletionTitle] = useState(null);

  const rememberOriginalTitle = useCallback(() => {
    if (typeof document === "undefined") return;
    if (originalTitle.current == null) {
      originalTitle.current = document.title;
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (activeTitle) {
      rememberOriginalTitle();
      document.title = activeTitle;
      return undefined;
    }

    if (completionTitle) {
      rememberOriginalTitle();
      document.title = completionTitle;
      return undefined;
    }

    if (originalTitle.current != null) {
      document.title = originalTitle.current;
      originalTitle.current = null;
    }

    return undefined;
  }, [activeTitle, completionTitle, rememberOriginalTitle]);

  useEffect(() => {
    if (!completionTitle || typeof document === "undefined" || typeof window === "undefined") {
      return undefined;
    }

    const clearIfActive = () => {
      if (!canPersistAttentionTitle()) {
        setCompletionTitle(null);
      }
    };

    window.addEventListener("focus", clearIfActive);
    document.addEventListener("visibilitychange", clearIfActive);

    return () => {
      window.removeEventListener("focus", clearIfActive);
      document.removeEventListener("visibilitychange", clearIfActive);
    };
  }, [completionTitle]);

  useEffect(() => () => {
    if (typeof document !== "undefined" && originalTitle.current != null) {
      document.title = originalTitle.current;
    }
  }, []);

  const showCompletionTitle = useCallback((title) => {
    if (!title || !canPersistAttentionTitle()) return;
    rememberOriginalTitle();
    setCompletionTitle(title);
  }, [rememberOriginalTitle]);

  return { showCompletionTitle };
}
