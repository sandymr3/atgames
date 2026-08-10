"use client";

import { useEffect } from "react";

/**
 * Flips the whole shell into the game's register — colder black, blood accent,
 * heavier grain — for as long as this route is mounted, and puts it back on
 * the way out. The transition itself is a CSS transition on <html>, so leaving
 * the page fades the room back up rather than snapping.
 */
export default function HorrorTheme() {
  useEffect(() => {
    document.documentElement.dataset.theme = "horror";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, []);
  return null;
}
