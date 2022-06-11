del /q .\src\script\*
for /d %%x in (.\src\script\*) do @rd /s /q "%%x"

npx babel ./src/.jsx --watch --out-file ./src/script/Main.js