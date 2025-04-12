#!/bin/bash

# Dossier de destination
PROMPTS_DIR="./prompts"
mkdir -p "$PROMPTS_DIR"

# Tableau : chaque ligne contient nom_fichier:nom_constante
PROMPT_ENTRIES=(
  "visual-identity-synthesizer:VISUAL_IDENTITY_SYNTHESIZER_PROMPT"
  "brand-identity-section:BRAND_IDENTITY_SECTION_PROMPT"
  "color-palette-section:COLOR_PALETTE_SECTION_PROMPT"
  "typography-section:TYPOGRAPHY_SECTION_PROMPT"
  "logo-generation:LOGO_GENERATION_PROMPT"
  "usage-guidelines-section:USAGE_GUIDELINES_SECTION_PROMPT"
  "visual-examples-section:VISUAL_EXAMPLES_SECTION_PROMPT"
)

echo "📦 Génération des fichiers de prompts (contenu vide) dans '$PROMPTS_DIR'..."

for ENTRY in "${PROMPT_ENTRIES[@]}"; do
  FILENAME="${ENTRY%%:*}"         # extrait la partie avant :
  CONST_NAME="${ENTRY##*:}"       # extrait la partie après :
  FILE_PATH="${PROMPTS_DIR}/${FILENAME}.prompt.ts"

  echo "📝 Création : $FILE_PATH"
  echo "export const $CONST_NAME = \`\`;" > "$FILE_PATH"
done

echo "✅ Tous les fichiers de prompt ont été générés avec succès !"
