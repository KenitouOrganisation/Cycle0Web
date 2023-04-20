# Prérequis

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



## Push sur server JAVA

<Copie/colle .jar>
Step 2 and 3 can be done with an FTP client (with windows instead of script cmd)

1. On local machine build the new jar:
mvn clean install && cd ./target

2. Then copy .jar from ./target folder to /home/apps/cycle0-core (from local folder to remote folder) :
scp core-0.0.1-SNAPSHOT.jar root@178.170.37.30:/home/apps/cycle0-core

Connecting to the remote
ssh root@178.170.37.30

3. Rename it on remote folder:
cd /home/apps/cycle0-core && mv cyclezero.jar cyclezero-previous.jar && mv core-0.0.1-SNAPSHOT.jar cyclezero.jar

4. Kill the existing process
ps aux | grep 443
kill -9 <id...>

5. Start the new server
./start.sh

Step 4 and 5 can be done together like that :
kill -9 <id...> && ./start.sh

Message when server ready (then exit the remote - not stopping the script !) :
Tomcat started on port(s): 443

## Launche server JAVA local
mvn spring-boot:run -Dspring-boot.run.profiles=dev,h2

## informations

- iPhone SE Safari browser windows size : 375 x 540

### ROBOTS.TXT

All exposed files to search engine should be outside the ./src folder


# Custom Landing Dev Tools

## Custom Dynamic HTML

### Compile

To generate static HTML from the dynamic html folder ./src/.html/*

Command can be found inside `./tools/dev.pushDynamicHtml.js`

### Import file

To import file inside the HTML, just type `<<{filename}>>` with filename that are under `.html` folder

### To put dynamic variable inside HTML file

Some common variable are defined : 

- `$filetimestamp$` for compile current time in unix ms
- `$title$` for the page title tags

To add new variable inside HTML, just type the variable name as follow inside your HTML page `$myvar$`, such as `<img src="my_img.png?v=$timestamp$`

Then in dev.generatedStaticHTML.js, add the new rules inside **FileManager.CustomCompile** function as wanted


## Javascript JSX Babel Compiler

JSX Files are located in `./src/.jsx` folder. This will allow us to use "html" syntaxes like react/JSX inside Javascript instead of typing functions call
and allow us to minify/compress our code

Just launch `./tools/compileLanding.bat` script which generate one single file inside `./src/script/Landing.js`

`./tools/compileContact.bat` => `./src/script/Contact.js`

## Copy/Paste all landing files expect .filename for the Java Server

- Make sure that all JSX files are compiled into js files, and that compress/minify tag are on (inside .babelrc file), and recompile it if modified

- Make sure all static HTML are generated (and up to date with the lastest file, to make sure, launch the JS to generate Static HTML once more - with `node index.js`)

- Launch the script that will copy paste all the landing page script to the folder specified (by default `./landing_clean/`)

or use `./tools/buildBundle.bat`

```powershell

# copy this comment too, to start the script

$destFolder = "../cyclezero-core/src/main/resources/static";

# create a clean copy of the landing page

node ./tools/dev.copyCleanCodeToServer.js landing $destFolder;

# Then to obfuscate the JS code and minify CSS

node ./tools/dev.obfuscateJS.js ./$destFolder/src/script/Landing.js;
node ./tools/dev.obfuscateJS.js ./$destFolder/src/script/Contact.js;
node ./tools/dev.obfuscateJS.js ./$destFolder/src/script/Licenses.js;
node ./tools/dev.minifyCss.js ./$destFolder/src/style/style.css;
node ./tools/dev.minifyCss.js ./$destFolder/src/style/style-mobile.css;

# copy this comment too, to end the script

```