# Aurora — Générateur de citations IA

Un site Next.js qui génère 3 citations originales à partir d'un thème,
via l'API OpenAI. Design sombre, glassmorphism, halos animés.

## Structure du projet

```
app/
  page.js                     → page principale (formulaire, résultats, historique)
  layout.js                   → polices + métadonnées
  globals.css                 → tout le design (tokens, animations, composants)
  api/generate-quotes/route.js → route serveur qui appelle l'IA
components/
  QuoteCard.js                → carte de citation + bouton copier
  Loader.js                   → loader animé pendant la génération
  Toast.js                    → notification "Copié !"
  icons.js                    → icônes SVG
lib/
  openai.js                   → SEUL fichier qui parle à l'API OpenAI (clé lue via env)
```

## 1. Installation

```bash
npm install
```

## 2. Ajouter ta clé API

Copie le fichier d'exemple puis colle ta clé OpenAI dedans :

```bash
cp .env.local.example .env.local
```

Ouvre `.env.local` et remplace la valeur :

```
OPENAI_API_KEY=sk-ta-vraie-cle
```

Ce fichier n'est jamais commité (voir `.gitignore`) et la clé n'est utilisée
que côté serveur, dans `lib/openai.js` — jamais exposée au navigateur.

## 3. Lancer en local

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## 4. Déployer sur Vercel

1. Pousse le projet sur GitHub.
2. Sur [vercel.com](https://vercel.com), clique sur "New Project" et importe le repo.
3. Dans les paramètres du projet Vercel → **Environment Variables**, ajoute :
   - `OPENAI_API_KEY` = ta clé OpenAI
4. Clique sur "Deploy". C'est tout.

## Fonctionnalités incluses

- Génération de 3 citations via l'API OpenAI (`gpt-4o-mini`)
- Bouton "Copier" sur chaque citation avec confirmation animée
- Touche Entrée pour lancer la génération
- Bouton désactivé si le champ est vide
- Compteur du nombre de générations (localStorage)
- Historique des 5 derniers thèmes recherchés (localStorage), cliquables
- Bouton "Régénérer" sans retaper le thème
- Loader animé sur mesure + gestion d'erreur avec bouton "Réessayer"
- Fond animé (halos qui dérivent lentement), responsive sur mobile

## Changer de modèle IA

Le modèle utilisé est défini dans `lib/openai.js` (`model: "gpt-4o-mini"`).
Tu peux le remplacer par n'importe quel autre modèle de chat OpenAI compatible
avec `response_format: { type: "json_object" }`.
