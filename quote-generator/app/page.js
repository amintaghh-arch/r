"use client";

import { useEffect, useRef, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import Loader from "@/components/Loader";
import Toast from "@/components/Toast";
import { IconAlert, IconRefresh, IconSparkle } from "@/components/icons";

const COUNT_KEY = "aurora_generation_count";
const HISTORY_KEY = "aurora_history";
const MAX_HISTORY = 5;

// Les 3 statuts possibles de l'écran de résultat.
// "idle" -> rien encore | "loading" -> requête en cours
// "success" -> citations affichées | "error" -> message d'erreur
export default function Home() {
  const [theme, setTheme] = useState("");
  const [status, setStatus] = useState("idle");
  const [quotes, setQuotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeout = useRef(null);
  const lastThemeRef = useRef("");

  // Au chargement, on récupère le compteur et l'historique déjà stockés en local.
  useEffect(() => {
    try {
      const storedCount = Number(localStorage.getItem(COUNT_KEY) ?? "0");
      const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
      setCount(Number.isFinite(storedCount) ? storedCount : 0);
      setHistory(Array.isArray(storedHistory) ? storedHistory : []);
    } catch (err) {
      // localStorage indisponible (mode privé, etc.) — on continue sans historique.
    }
  }, []);

  function pushHistory(newTheme) {
    setHistory((prev) => {
      const withoutDuplicate = prev.filter(
        (t) => t.toLowerCase() !== newTheme.toLowerCase()
      );
      const next = [newTheme, ...withoutDuplicate].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch (err) {
        // ignore
      }
      return next;
    });
  }

  function bumpCount() {
    setCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(COUNT_KEY, String(next));
      } catch (err) {
        // ignore
      }
      return next;
    });
  }

  async function runGeneration(themeToUse) {
    const trimmed = themeToUse.trim();
    if (!trimmed) return;

    lastThemeRef.current = trimmed;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Impossible de générer des citations.");
      }

      setQuotes(data.quotes);
      setStatus("success");
      bumpCount();
      pushHistory(trimmed);
    } catch (err) {
      setErrorMessage(err.message || "Impossible de générer des citations.");
      setStatus("error");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runGeneration(theme);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && theme.trim() && status !== "loading") {
      runGeneration(theme);
    }
  }

  function handleRetry() {
    runGeneration(lastThemeRef.current || theme);
  }

  function handleRegenerate() {
    runGeneration(lastThemeRef.current || theme);
  }

  function handleHistoryClick(t) {
    setTheme(t);
    runGeneration(t);
  }

  function handleCopied() {
    setToastVisible(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastVisible(false), 1800);
  }

  const isLoading = status === "loading";

  return (
    <>
      {/* Fond animé */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
        <div className="aurora-grain" />
      </div>

      <main className="page">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span className="eyebrow">
              <span className="dot" />
              Propulsé par l&apos;intelligence artificielle
            </span>
          </div>

          <section className="hero">
            <h1>
              Trouvez l&apos;inspiration grâce à{" "}
              <span className="accent">l&apos;intelligence artificielle</span>.
            </h1>
            <p className="subtitle">
              Entrez simplement un thème et laissez l&apos;IA créer des citations
              uniques en quelques secondes.
            </p>
          </section>

          {/* Formulaire */}
          <form className="generator" onSubmit={handleSubmit}>
            <div className={`halo-frame ${isLoading ? "active" : ""}`}>
              <div className="generator-inner">
                <input
                  className="theme-input"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Exemple : Motivation"
                  maxLength={80}
                  disabled={isLoading}
                  aria-label="Thème pour la génération de citations"
                />
                <button
                  type="submit"
                  className={`generate-btn ${isLoading ? "loading" : ""}`}
                  disabled={!theme.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <IconSparkle width={16} height={16} />
                      Générer
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="hint-row">
              Appuyez sur <span className="kbd">Entrée</span> pour générer
            </div>
          </form>

          {/* Résultats / chargement / erreur */}
          {status === "loading" && <Loader />}

          {status === "error" && (
            <div className="error-card">
              <div className="error-icon">
                <IconAlert width={20} height={20} />
              </div>
              <p>{errorMessage || "Impossible de générer des citations."}</p>
              <button className="retry-btn" onClick={handleRetry}>
                <IconRefresh width={14} height={14} />
                Réessayer
              </button>
            </div>
          )}

          {status === "success" && quotes.length > 0 && (
            <>
              <div className="results">
                {quotes.map((q, i) => (
                  <QuoteCard key={i} quote={q} index={i} onCopy={handleCopied} />
                ))}
              </div>
              <div className="results-actions">
                <button className="regen-btn" onClick={handleRegenerate} disabled={isLoading}>
                  <IconRefresh />
                  Régénérer sur le même thème
                </button>
              </div>
            </>
          )}

          {/* Compteur + historique */}
          {(count > 0 || history.length > 0) && (
            <>
              <div className="meta-row">
                <span className="meta-chip">
                  <b>{count}</b> génération{count > 1 ? "s" : ""} au total
                </span>
              </div>

              {history.length > 0 && (
                <div className="history">
                  {history.map((t) => (
                    <button
                      key={t}
                      className="history-pill"
                      onClick={() => handleHistoryClick(t)}
                      disabled={isLoading}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <footer className="site-footer">
          Créé avec <span className="heart">❤️</span> et l&apos;IA
        </footer>
      </main>

      <Toast show={toastVisible} message="Copié dans le presse-papiers !" />
    </>
  );
}
