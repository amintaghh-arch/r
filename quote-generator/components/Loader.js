"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "L'IA cherche les bons mots...",
  "Composition des citations...",
  "Ajustement du ton...",
  "Presque prêt...",
];

/**
 * Loader élégant à trois anneaux, avec un message qui change pendant l'attente.
 */
export default function Loader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % MESSAGES.length);
    }, 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loader-panel">
      <div className="orb-loader">
        <span />
        <span />
        <span />
      </div>
      <p>{MESSAGES[step]}</p>
    </div>
  );
}
