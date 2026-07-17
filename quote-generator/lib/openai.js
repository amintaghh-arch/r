// lib/openai.js
//
// Ce fichier est le SEUL endroit du projet qui communique avec l'API OpenAI.
// La clé API n'est jamais écrite en dur : elle est lue depuis la variable
// d'environnement OPENAI_API_KEY (définie dans .env.local, voir .env.local.example).
//
// Ce fichier ne s'exécute que côté serveur (il est importé uniquement par
// app/api/generate-quotes/route.js), donc la clé n'est jamais exposée au navigateur.

import OpenAI from "openai";

// Le client est instancié une seule fois et réutilisé entre les requêtes.
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Construit le prompt envoyé au modèle à partir du thème choisi par l'utilisateur.
 * @param {string} theme
 * @returns {string}
 */
function buildPrompt(theme) {
  return `Génère exactement trois citations originales sur le thème suivant : "${theme}".
Les citations doivent être inspirantes, courtes (1 à 3 phrases), écrites en français et clairement séparées.

Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact suivant :
{"quotes": ["citation 1", "citation 2", "citation 3"]}`;
}

/**
 * Demande 3 citations originales à l'IA sur un thème donné.
 * @param {string} theme - Le thème saisi par l'utilisateur (ex: "motivation").
 * @returns {Promise<string[]>} Un tableau de 3 citations.
 */
export async function generateQuotes(theme) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "Clé API manquante. Ajoute OPENAI_API_KEY dans un fichier .env.local (voir .env.local.example)."
    );
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    max_tokens: 400,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Tu es un générateur de citations inspirantes. Tu réponds toujours en français, uniquement au format JSON demandé, sans commentaire additionnel.",
      },
      {
        role: "user",
        content: buildPrompt(theme),
      },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content ?? "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("Réponse de l'IA illisible (JSON invalide).");
  }

  const quotes = Array.isArray(parsed.quotes) ? parsed.quotes : [];

  if (quotes.length === 0) {
    throw new Error("Aucune citation reçue.");
  }

  // On garde toujours 3 citations maximum, même si le modèle en renvoie plus.
  return quotes.slice(0, 3);
}
