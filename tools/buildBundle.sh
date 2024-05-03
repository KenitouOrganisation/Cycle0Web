#!/bin/bash

# Start of the script

# destFolder="$(pwd)/../cyclezero-core/src/main/resources/static"
destFolder="./landing_clean"

# Create a clean copy of the landing page
node ./tools/dev.copyCleanCodeToServer.js landing "$destFolder"

echo "Starting to process files for production..."

# Then obfuscate the JS code and minify CSS
node ./tools/dev.obfuscateJS.js $destFolder/src/script/Contact.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/gCookieConsent.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/Landing.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/Licenses.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/Presse.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/Chantiers.js
node ./tools/dev.obfuscateJS.js $destFolder/src/script/FAQ.js

node ./tools/dev.minifyCss.js $destFolder/src/style/style.css
node ./tools/dev.minifyCss.js $destFolder/src/style/style-mobile.css

echo "End"

# End of the script