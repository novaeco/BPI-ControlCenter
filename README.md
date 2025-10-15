# BPI Control Center

Suite logicielle complète pour piloter une Banana Pi BPI‑F3 (SoC SpacemiT K1 – RISC‑V) depuis une interface web tactile. Le projet est désormais 100 % compatible riscv64 sans module natif Node.js grâce à :

- **Front-end** React/TypeScript (Vite + Tailwind CSS).
- **Back-end** Node.js/TypeScript (Express + Sequelize) avec prise en charge de PostgreSQL ou d’un moteur SQLite WebAssembly (`sql.js`).
- **Accès matériel** par commandes système (NetworkManager `nmcli`, `bluetoothctl`, `gpioset/gpioget`, `i2cset/i2cget`, `stty`, `tee`, …) encapsulées dans `server/src/lib/hardware.ts`.
- **Journalisation** pino, sécurisation JWT, partage de types front/back via `shared/`.

## 1. Matériel et prérequis logiciels

| Élément | Détails |
| --- | --- |
| Carte | Banana Pi BPI‑F3 (CPU SpacemiT K1, 16 Go RAM) |
| OS | Bianbu 25.04 Desktop Lite (Ubuntu 25.04 riscv64) |
| Node.js | ≥ 18 (préinstallé sur Bianbu) |
| Base de données | PostgreSQL 15+ (recommandé) ou stockage fichier `sql.js` |

### Dépendances système

```bash
sudo apt update
sudo apt install -y \
  network-manager \
  postgresql postgresql-contrib \
  bluez bluetooth \
  gpiod \
  i2c-tools \
  socat \
  stow jq
```

> ℹ️ Si vous choisissez l’option `sql.js`, le service PostgreSQL peut être désactivé. Les dépendances matérielles (`gpiod`, `i2c-tools`, `socat`) restent requises pour piloter GPIO/I²C/série via la CLI.

Activez les bus nécessaires (I²C, Bluetooth) dans l’OS et ajoutez l’utilisateur système d’exécution (`nov` dans le service systemd fourni) aux groupes `netdev`, `gpio`, `dialout`, `bluetooth` si besoin.

## 2. Installation du projet

```bash
# Récupération du dépôt
sudo mkdir -p /opt
cd /opt
sudo git clone https://github.com/<votre-compte>/BPI-ControlCenter.git
sudo chown -R $USER:$USER BPI-ControlCenter
cd BPI-ControlCenter

# Installation des dépendances Node
npm install

# Copie de l’exemple d’environnement
cp .env.example .env
```

Editez `.env` pour définir :

- les secrets JWT (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`) ;
- la pile base de données (`DB_ENGINE=postgres` avec `PG_*` ou `DB_ENGINE=sqljs` avec `SQLJS_PERSISTENCE_PATH`) ;
- la configuration matérielle (`GPIO_RELAY_PINS`, `GPIO_CHIP`, adresses I²C, `COMMAND_TIMEOUT_MS`).

### 2.1. Configuration PostgreSQL (recommandée)

```bash
sudo -u postgres createuser --pwprompt bpi_control
sudo -u postgres createdb -O bpi_control bpi_control
```

Puis mettez à jour `.env` :

```ini
DB_ENGINE=postgres
PG_HOST=127.0.0.1
PG_PORT=5432
PG_DATABASE=bpi_control
PG_USER=bpi_control
PG_PASSWORD=<mot_de_passe>
PG_SSL=false
```

Les tables sont créées et migrées automatiquement via `sequelize.sync()` lors du démarrage (`initDatabase`).

### 2.2. Option hors‑ligne `sql.js`

Définissez :

```ini
DB_ENGINE=sqljs
SQLJS_PERSISTENCE_PATH=./data/database.sqlite
SQLJS_PATH=/opt/bpi-controlcenter/sql-wasm.wasm   # chemin optionnel si la WASM est déplacée
```

Vous pouvez initialiser ou manipuler le fichier en TypeScript via `server/src/database.ts` :

```ts
import { createSqlJsDatabase, runSqlJsMigrations } from './server/src/database';

const { db, persist } = await createSqlJsDatabase();
runSqlJsMigrations(db);
// … exécuter des requêtes db.exec/db.prepare …
await persist();
```

## 3. Construction et exécution

### Mode développement

```bash
npm run dev:server   # API Express (tsx + rechargement)
npm run dev          # Interface React/Vite
```

### Mode production

```bash
npm run build        # Front-end
npm run build:server # Back-end (transpile vers dist/server/src)
NODE_ENV=production npm run start:server
```

Le script `start:server` démarre Node avec la résolution ESM (`--experimental-specifier-resolution=node`) et charge `dist/server/src/index.js`.

## 4. Base de données et comptes

Créez un administrateur via `psql` (PostgreSQL) :

```bash
psql postgresql://bpi_control:<mot_de_passe>@localhost:5432/bpi_control <<'SQL'
INSERT INTO users (id, email, "passwordHash", role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin@example.com', '<hash-bcrypt>', 'ADMIN', now(), now())
ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", role = EXCLUDED.role, "updatedAt" = now();
SQL
```

Pour générer un hash :

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('MotDePasseFort',10).then(console.log);"
```

Avec `sql.js`, utilisez les helpers de `database.ts` pour exécuter des requêtes SQL équivalentes.

## 5. Accès matériel sans add-on natif

Le module `server/src/lib/hardware.ts` encapsule :

- GPIO : `gpioset` / `gpioget` (`gpiod`),
- I²C : `i2cset` / `i2cget` (`i2c-tools`) pour BME280 & BH1750,
- Série : `stty` + `tee`/`cat`,
- Wi‑Fi/Ethernet : `nmcli`,
- Bluetooth : `bluetoothctl`.

Chaque appel est exécuté via `execFile` avec timeouts configurables (`COMMAND_TIMEOUT_MS`). Aucune chaîne n’est concaténée pour éviter les injections. Les tests `server/tests/hardware.test.ts` vérifient les paramètres transmis.

## 6. API REST

La spécification OpenAPI 3.1 est maintenue dans `server/openapi.yaml`. Principaux endpoints :

- `POST /api/auth/login` & `POST /api/auth/refresh` – Authentification JWT.
- `GET /api/wifi/status`, `POST /api/wifi/toggle`, `POST /api/wifi/connect`, `GET /api/wifi/networks` – Gestion Wi‑Fi via `nmcli`.
- `GET/POST /api/bluetooth/*` – Gestion Bluetooth via `bluetoothctl`.
- `GET /api/sensors` – Capteurs BME280 (température/humidité), BH1750 (luminosité) et états relais GPIO.
- `CRUD /api/terrariums` & `GET/POST /api/settings` – Gestion métier.

Toutes les routes (hors `/auth/*`) nécessitent `Authorization: Bearer <token>`.

## 7. Tests

Tests unitaires/integration Vitest + Supertest :

```bash
npm test
```

Le mode test force PostgreSQL en mémoire (`pg-mem`) et simule les commandes système.

## 8. Déploiement systemd

Un service non-root est fourni (`server/systemd/bpi-controlcenter.service`) :

```ini
[Service]
User=nov
Group=nov
WorkingDirectory=/opt/bpi-controlcenter
EnvironmentFile=-/etc/bpi-controlcenter.env
ExecStart=/usr/bin/node --experimental-specifier-resolution=node /opt/bpi-controlcenter/dist/server/src/index.js
Restart=on-failure
```

Utilisez le script `install_service.sh` pour copier le service, installer les dépendances système et activer/démarrer l’unité :

```bash
sudo ./install_service.sh
```

Le fichier `/etc/bpi-controlcenter.env` doit contenir les variables d’environnement (.env) nécessaires, notamment les paramètres PostgreSQL ou `sql.js`.

## 9. Structure des répertoires

```
BPI-ControlCenter/
├── public/                 # Assets statiques
├── server/
│   ├── src/
│   │   ├── app.ts          # Composition Express
│   │   ├── database.ts     # Helpers sql.js
│   │   ├── lib/            # Abstractions matériel & drivers
│   │   └── models/         # Modèles Sequelize + initDatabase
│   ├── tests/              # Tests Vitest
│   └── systemd/            # Service systemd & scripts
├── shared/                 # Types partagés front/back
├── src/                    # Front-end React/TypeScript
└── server/openapi.yaml     # Documentation OpenAPI 3.1
```

## 10. Variables d’environnement clés

| Variable | Description |
| --- | --- |
| `DB_ENGINE` | `postgres` (défaut) ou `sqljs` |
| `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` | Paramètres PostgreSQL |
| `PG_SSL`, `PG_SSL_REJECT_UNAUTHORIZED` | Activation SSL PostgreSQL |
| `SQLJS_PERSISTENCE_PATH`, `SQLJS_PATH` | Chemins pour la base `sql.js` et la WASM |
| `COMMAND_TIMEOUT_MS` | Timeout global des commandes shell (ms) |
| `GPIO_CHIP`, `GPIO_RELAY_PINS` | Configuration GPIO (`gpioset/gpioget`) |
| `I2C_BUS`, `BME280_I2C_ADDRESS`, `BH1750_I2C_ADDRESS` | Paramètres I²C |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Secrets JWT |
| `PORT` | Port HTTP de l’API (défaut 4000) |

## 11. Contribution

- Respectez le mode strict TypeScript (aucun `any`).
- Mettez à jour `openapi.yaml`, la documentation et les tests pour tout nouvel endpoint ou capteur.
- Les contributions doivent conserver l’exécution sans module natif et privilégier les commandes CLI sécurisées.

Bon déploiement sur Banana Pi !
