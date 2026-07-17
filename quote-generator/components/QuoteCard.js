"use client";

import { useState } from "react";
import { IconQuote, IconCopy, IconCheck } from "./icons";

/**
 * Affiche une citation générée avec un bouton pour la copier dans le presse-papiers.
 * @param {{ quote: string, index: number, onCopy: () => void }} props
 */
export default function QuoteCard({ quote, index, onCopy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      // Le presse-papiers peut être bloqué (permissions) — on échoue silencieusement.
      console.error("Copie impossible :", err);
    }
  }

  return (
    <div className="quote-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="quote-icon">
        <IconQuote width={18} height={18} />
      </div>

      <p className="quote-text">{quote}</p>

      <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
        {copied ? <IconCheck /> : <IconCopy />}
        {copied ? "Copié !" : "Copier"}
      </button>
    </div>
  );
}
