#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/bpi-controlcenter}"
DB_PATH="${DB_PATH:-$PROJECT_DIR/data/database.sqlite}"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "[ERREUR] Le répertoire du projet ($PROJECT_DIR) est introuvable." >&2
  exit 1
fi

if ! command -v node >/dev/null; then
  echo "[ERREUR] Node.js >=18 est requis." >&2
  exit 1
fi

sudo apt-get update
sudo apt-get install -y build-essential python3 pkg-config sqlite3

# Compilation des modules natifs (sqlite3, i2c-bus) directement sur RISC-V.
export npm_config_build_from_source=1

cd "$PROJECT_DIR"

mkdir -p "$(dirname "$DB_PATH")"

npm install --omit=dev
npm run build
npm run build:server

# Pré-crée le schéma SQLite sans lancer l'API complète.
if [[ -f "dist/server/models/index.js" ]]; then
  node --input-type=module -e "import('./dist/server/models/index.js').then(m => m.initDatabase()).then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });"
fi

echo "Installation terminée. Base SQLite initialisée dans $DB_PATH"
