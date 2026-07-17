"use client";

import { IconCheck } from "./icons";

/**
 * Petite notification en bas de l'écran, affichée après une copie réussie.
 * @param {{ show: boolean, message: string }} props
 */
export default function Toast({ show, message }) {
  return (
    <div className={`toast ${show ? "show" : ""}`} role="status" aria-live="polite">
      <IconCheck />
      {message}
    </div>
  );
}
