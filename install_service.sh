#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR=${PROJECT_DIR:-/opt/bpi-controlcenter}
SERVICE_USER=${SERVICE_USER:-nov}
SERVICE_GROUP=${SERVICE_GROUP:-nov}
SERVICE_FILE="server/systemd/bpi-controlcenter.service"
SYSTEMD_DEST="/etc/systemd/system/bpi-controlcenter.service"
ENV_FILE=${ENV_FILE:-/etc/bpi-controlcenter.env}

if [[ $EUID -ne 0 ]]; then
  echo "[ERREUR] Ce script doit être exécuté en tant que root." >&2
  exit 1
fi

if [[ ! -d $PROJECT_DIR ]]; then
  echo "[INFO] Copie du projet vers $PROJECT_DIR" >&2
  install -d "$PROJECT_DIR"
  rsync -a --delete "$(pwd)/" "$PROJECT_DIR/"
fi

cd "$PROJECT_DIR"

apt-get update
apt-get install -y network-manager postgresql postgresql-contrib bluez bluetooth gpiod i2c-tools socat rsync

npm install --omit=dev
npm run build
npm run build:server

node --input-type=module -e "import('./dist/server/src/models/index.js').then((m) => m.initDatabase()).catch(() => process.exit(1))"

install -m 644 "$SERVICE_FILE" "$SYSTEMD_DEST"
sed -i "s|^User=.*|User=$SERVICE_USER|" "$SYSTEMD_DEST"
sed -i "s|^Group=.*|Group=$SERVICE_GROUP|" "$SYSTEMD_DEST"
systemctl daemon-reload
systemctl enable bpi-controlcenter.service
systemctl restart bpi-controlcenter.service

cat <<SCRIPT
[OK] Service installé.
- Binaire : /usr/bin/node
- WorkingDirectory : $PROJECT_DIR
- Service : $SYSTEMD_DEST
- Fichier d'environnement : $ENV_FILE (création manuelle si nécessaire)
SCRIPT
