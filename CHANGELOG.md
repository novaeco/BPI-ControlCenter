# Changelog

## [Unreleased]
### Ajouté
- Script `setup_bpi_controlcenter.sh` pour automatiser l'installation sur Banana Pi (build natif des modules et initialisation de la base SQLite).

### Modifié
- Remplacement de Prisma par Sequelize + sqlite3 afin de garantir la compatibilité riscv64.
- Adaptation des services d'authentification, terrariums, capteurs et paramètres pour utiliser les modèles Sequelize.
- Mise à jour de la configuration d'environnement (`DB_PATH`) et de la documentation d'installation.
