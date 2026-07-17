// app/api/generate-quotes/route.js
//
// Route API (serverless) : reçoit un thème depuis le front-end,
// appelle l'IA via lib/openai.js, et renvoie les citations en JSON.
// C'est la seule route que le client appelle : la clé API ne quitte jamais le serveur.

import { NextResponse } from "next/server";
import { generateQuotes } from "@/lib/openai";

export async function POST(request) {
  try {
    const body = await request.json();
    const theme = (body?.theme ?? "").trim();

    if (!theme) {
      return NextResponse.json(
        { error: "Le thème est requis." },
        { status: 400 }
      );
    }

    if (theme.length > 80) {
      return NextResponse.json(
        { error: "Le thème est trop long (80 caractères max)." },
        { status: 400 }
      );
    }

    const quotes = await generateQuotes(theme);

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Erreur /api/generate-quotes :", error);
    return NextResponse.json(
      { error: "Impossible de générer des citations." },
      { status: 500 }
    );
  }
}
