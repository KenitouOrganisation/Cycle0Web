del /q .\landing\src\script\*
for /d %%x in (.\landing\src\script\*) do @rd /s /q "%%x"

npx babel ./landing/src/.jsx/Global ./landing/src/.jsx/OldMain --watch --out-file ./landing/src/script/Main.js