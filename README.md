# BPI Control Center

Suite logicielle complète pour piloter une Banana Pi BPI‑F3 (SoC SpacemiT K1 – RISC‑V) depuis une interface web tactile. Le projet comprend :

- **Front-end** React/TypeScript (Vite + Tailwind CSS) alimenté par des données temps réel.
- **Back-end** Node.js/TypeScript (Express) exposant des API REST sécurisées par JWT.
- **Intégration matérielle** (Wi‑Fi, Bluetooth, capteurs I²C, GPIO) via NetworkManager, bluetoothctl, i2c-bus, onoff.
- **Base de données** SQLite gérée par Sequelize (ORM compatible RISC-V).

## 1. Prérequis matériels et logiciels

| Élément | Détails |
| --- | --- |
| Carte | Banana Pi BPI‑F3 (CPU SpacemiT K1, 16 Go RAM) |
| Stockage | eMMC 128 Go + SSD M.2 128 Go (optionnel pour la base de données) |
| OS | Bianbu 25.04 Desktop Lite (Ubuntu 25.04 riscv64) |
| Node.js | v18.x (préinstallé sur Bianbu) |
| Build tools | `build-essential`, `python3`, `pkg-config` pour compiler les modules natifs (i2c-bus) |
| Accès root | requis pour installer les dépendances système et configurer systemd |

### Dépendances système supplémentaires

```bash
sudo apt update
sudo apt install -y network-manager bluetooth bluez i2c-tools sqlite3 build-essential python3 pkg-config
```

Activez les interfaces matérielles nécessaires (I²C, Bluetooth) dans l’OS et ajoutez l’utilisateur d’exécution (`www-data` dans le service systemd fourni) aux groupes `netdev`, `bluetooth`, `gpio` si besoin.

## 2. Installation du projet

```bash
# Récupération du dépôt
cd /opt
sudo git clone https://github.com/<votre-compte>/BPI-ControlCenter.git
cd BPI-ControlCenter

# Configuration des variables d’environnement
cp .env.example .env
# Éditez .env pour définir les secrets JWT et le chemin SQLite (`DB_PATH`)
# - `GPIO_RELAY_PINS` accepte un tableau JSON (ex. `[17, 18]`) pour activer la gestion des relais/LED via GPIO

# Installation des dépendances
npm install
```

Les tables SQLite sont créées/ajustées automatiquement par Sequelize au premier démarrage (`sequelize.sync({ alter: true })`).

> 💡 Pour un déploiement automatisé sur Banana Pi, utilisez le script `setup_bpi_controlcenter.sh` (il installe les dépendances, construit le front/back et exécute `initDatabase` pour initialiser le fichier SQLite).

## 3. Démarrer les services

### Mode développement

```bash
# Démarre l’API avec rechargement à chaud
npm run dev:server

# Dans une autre console, lance l’interface Vite
npm run dev
```

### Mode production

```bash
# Construire front + back
npm run build
npm run build:server

# Lancer l’API en production
npm run start:server

# Prévisualiser l’UI statique
npm run preview
```

L’API écoute sur `http://localhost:4000/api` par défaut (configurable via `PORT` dans `.env`).

## 4. Authentification et comptes

La première connexion nécessite un utilisateur en base. Après le premier démarrage de l’API (qui crée les tables), vous pouvez insérer un compte administrateur via `sqlite3` :

```bash
# Génère un hachage bcrypt
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('MotDePasseFort',10).then(console.log);"
HASH="<collez-le-hash>"

# Insère l'utilisateur dans la base (par défaut ./data/database.sqlite)
sqlite3 ./data/database.sqlite <<'SQL'
INSERT INTO users (id, email, passwordHash, role, createdAt, updatedAt)
VALUES (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || '4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))),
       'admin@example.com', '$HASH', 'ADMIN', datetime('now'), datetime('now'))
ON CONFLICT(email) DO UPDATE SET passwordHash = excluded.passwordHash, role = excluded.role, updatedAt = excluded.updatedAt;
SQL
```

Adaptez l’adresse e-mail, le rôle (`ADMIN` ou `USER`) et le hachage en fonction de vos besoins.

## 5. API REST

La documentation OpenAPI est disponible dans `server/openapi.yaml`. Principaux endpoints :

- `POST /api/auth/login` / `POST /api/auth/refresh` – Authentification JWT.
- `GET/POST /api/wifi/*` – État, activation et scan Wi‑Fi via `nmcli`.
- `GET/POST /api/bluetooth/*` – Gestion Bluetooth via `bluetoothctl`.
- `GET /api/system/info` – Informations noyau, charge CPU, mémoire, disques, température.
- `GET /api/sensors` – Lecture capteurs BME280 (température/humidité), BH1750 (luminosité) et états des relais GPIO (via onoff) + fallback DB.
- `CRUD /api/terrariums` – Gestion des enclos, mesures, statut.
- `GET/POST /api/settings` – Préférences globales.

Toutes les routes (hors `/auth/*`) exigent un header `Authorization: Bearer <token>`.

## 6. Tests

Les tests d’intégration basés sur Vitest + Supertest se lancent avec :

```bash
npm test
```

Les tests isolent la logique en simulant l’accès matériel/DB.

## 7. Déploiement systemd

1. Copiez le service :
   ```bash
   sudo cp server/systemd/bpi-controlcenter.service /etc/systemd/system/
   ```
2. Créez un fichier `/etc/bpi-controlcenter.env` contenant les variables d’environnement (`DB_PATH`, `JWT_ACCESS_SECRET`, etc.).
3. Déployez l’application dans `/opt/bpi-controlcenter` (ou ajustez `WorkingDirectory`).
4. Activez puis démarrez le service :
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable bpi-controlcenter.service
   sudo systemctl start bpi-controlcenter.service
   sudo systemctl status bpi-controlcenter.service
   ```

## 8. Surveillance et journalisation

- Les logs applicatifs sont produits par **pino** (JSON, format lisible en dev via pino-pretty).
- `journalctl -u bpi-controlcenter -f` pour suivre l’API sous systemd.
- Les capteurs se connectent automatiquement ; en cas d’échec, les dernières valeurs persistées sont renvoyées.

## 9. Bonnes pratiques & sécurité

- Changer immédiatement les secrets `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET`.
- Restreindre l’accès réseau au port 4000 derrière un reverse proxy HTTPS (nginx, Caddy).
- Sauvegarder régulièrement le fichier SQLite (snapshot `sqlite3` ou backup volume).
- Utiliser un utilisateur système dédié avec accès minimal aux bus I²C/Bluetooth.
- Les commandes shell sont exécutées via `execFile` pour éviter l’injection ; ne pas modifier en `exec`.

## 10. Structure des répertoires

```
BPI-ControlCenter/
├── public/                 # Assets statiques
├── server/
│   ├── src/                # Code TypeScript du back-end
│   │   └── models/         # Modèles Sequelize + initialisation
│   ├── tests/              # Tests Vitest/Supertest
│   └── systemd/            # Service systemd prêt à l'emploi
├── src/                    # Front-end React/TypeScript
│   ├── api/                # Client REST + hooks React Query
│   ├── components/         # UI
│   └── providers/          # AuthProvider
└── server/openapi.yaml     # Spécification OpenAPI 3.1
```

## 11. Variables d’environnement principales

| Variable | Description |
| --- | --- |
| `DB_PATH` | Chemin du fichier SQLite (ex. `./data/database.sqlite`) |
| `JWT_ACCESS_SECRET` | Secret JWT accès (≥32 caractères recommandés) |
| `JWT_REFRESH_SECRET` | Secret JWT refresh |
| `PORT` | Port HTTP de l’API (défaut 4000) |
| `BME280_I2C_ADDRESS` | Adresse I²C du capteur BME280 (0x76 ou 0x77) |
| `BH1750_I2C_ADDRESS` | Adresse I²C du capteur BH1750 |
| `GPIO_RELAY_PINS` | Tableau JSON des GPIO utilisés pour relais/LED |

## 12. Support et contributions

- Ouvrez un ticket GitHub pour toute anomalie ou suggestion.
- Respectez le style TypeScript strict (pas de `any`) et privilégiez les hooks React Query pour la gestion d’état distante.
- Documentez tout nouveau capteur dans `README` et `openapi.yaml`.

Bonne intégration !
