## Prérequis

Node.js (version utilisée si jamais c'est pas compatible : 16.X LTS)

## Installation des outils de développement

Compatible `npm` et `yarn`

Pour installer les modules necéssaire : `npm install` ou `yarn`

## Lancer des outils de développement

#### Pour lancer le serveur web de la landing
`node index.js`

#### Pour convertir tous les fichiers .jsx dans le dossier ./landing/.jsx dans ./landing/script/Main.js

*(Le but est d'écrire les scripts Javascript dans des fichiers séparés, et aussi avoir la possibilité d'écrire du JSX pour le html.
En sortie, on aura que du pur Javascript directement implémenter dans le HTML, et dans un seul fichier avec du code minifier prêt pour un déploiement)*

- Sous Windows 

```
cd ./landing/
./compile.bat
```

- Sous Linux et MacOS (MacOs à tester)

```
cd ./landing/
./compile
```

Il se peut qu'il faut accroder les droits d'éxécution à ce fichier avant :

`chmod +x ./landing/compile.bat`

Il faut savoir qu'une fois le script `compile` lancer, les modifications dans les fichiers `.jsx` du dossier `./landing/.jsx` seront automatiquement "compiler" vers ./landing/Main.js