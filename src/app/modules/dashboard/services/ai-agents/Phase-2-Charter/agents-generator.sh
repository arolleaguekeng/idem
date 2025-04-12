#!/bin/bash


TARGET_DIR="./"




SERVICES=(
  "visual-identity-synthesizer"
  "brand-identity-section"
  "color-palette-section"
  "typography-section"
  "logo-generation"
  "usage-guidelines-section"
  "visual-examples-section"
  graphic-charter-orchestrator
)

echo "📦 Generating AI agent services in '$TARGET_DIR'..."


for SERVICE in "${SERVICES[@]}"; do
  echo "⚙️  Creating service: $SERVICE"
  ng generate service "$TARGET_DIR/$SERVICE" --skip-tests
done

echo "✅ All AI agent services generated successfully!"
