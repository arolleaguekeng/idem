#!/bin/bash

TARGET_DIR="./"

PROMPTS=(
  "use-case-diagram"
  "class-diagram"
  "er-diagram"
  "sequence-diagram"
  "architecture-diagram"
)

echo "📦 Generating diagram prompt files in '$TARGET_DIR'..."

for PROMPT in "${PROMPTS[@]}"; do
  PROMPT_FILE="$TARGET_DIR/prompts/${PROMPT}.prompt.ts"
  PROMPT_CONST_NAME="$(echo "$PROMPT" | tr '-' '_' | awk '{print toupper($0)}')_PROMPT"

  echo "⚙️  Creating prompt file: $PROMPT_FILE with const: $PROMPT_CONST_NAME"

  cat <<EOL > "$PROMPT_FILE"
export const $PROMPT_CONST_NAME = \`
# Instructions
Décris et génère le diagramme correspondant pour le projet suivant.
Respecte bien les formats demandés.

# Format de sortie
- description : un texte expliquant le diagramme.
- code : le code du diagramme en syntaxe PlantUML adaptée.

# Projet :
\`;
EOL

  echo "✅ Prompt file created: $PROMPT_FILE"
done

echo "🎯 All diagram prompt files generated successfully!"
