const fs = require("fs");

class FileManager {
    constructor(fileName, pageTitle = "") {
        this.targetPath = "./landing/";
        this.sourcePath = "./landing/src/.html/";
        this.fileName = fileName;

        this.pageTitle = pageTitle;
        this.fileDatas = "";

        this.lastCompileTime = Date.now();
        this.compileTimeLapse = 500; // ms
    }

    From() {
        return this.sourcePath + this.fileName;
    }

    To() {
        return this.targetPath + this.fileName;
    }

    async Read(filepath = null) {
        try {
            const fileDatas = await fs.promises.readFile(
                filepath ? filepath : this.From()
            );
            if (!filepath) this.fileDatas = fileDatas.toString();

            return fileDatas.toString();
        } catch (err) {
            console.error(err);
            this.fileDatas = "";
            return -1;
        }
    }

    async Write(data = null) {
        try {
            return await fs.promises.writeFile(
                this.To(),
                data ? data : this.fileDatas
            );
        } catch (err) {
            console.error(err);
            return -1;
        }
    }

    ReplaceVar(varKey, str) {
        const rgx = new RegExp(varKey, "ig");
        return this.fileDatas.replace(rgx, str);
    }

    async ReplaceVarByFile() {
        const rgx = /<<{(.+)}>>/gi;
        // reading all existing include on the html file
        let importList = this.fileDatas.match(rgx);

        console.log("Import file from HTML detected :", importList.length);

        // no duplicata https://stackoverflow.com/a/9229821/9408443
        importList = importList.filter((item, pos) => {
            return importList.indexOf(item) == pos;
        });
        console.log("Uniq total import :", importList.length, importList);

        // fetching for import file data
        for (const valKey of importList) {
            const valName = valKey.replace(rgx, "$1");

            const filePath = this.sourcePath + valName;
            const fileVal = await this.Read(filePath);
            if (fileVal == -1) {
                console.log(
                    `❌ Error when importing '${valName}' from '${filePath}'`
                );
            } else {
                console.log(`✅ Importing '${valName}' from '${filePath}'`);
                this.fileDatas = this.ReplaceVar(valKey, fileVal);
            }
        }
    }

    async Compile() {
        await this.Read();
        await this.ReplaceVarByFile();

        this.fileDatas = this.ReplaceVar(
            "\\$filetimestamp\\$",
            Date.now() + ""
        );
        this.fileDatas = this.ReplaceVar("\\$title\\$", this.pageTitle);

        await this.Write();
    }

    async WatchCompile() {
        await this.Compile();
        fs.watch(this.sourcePath + this.fileName, {}, async (c, p) => {
            if (Date.now() - this.lastCompileTime < this.compileTimeLapse)
                return;
            console.log(c, p);
            this.lastCompileTime = Date.now();
            await this.Compile();
        });
    }
}

(async () => {

    new FileManager(
        "contacts.html",
        "Cycle Zéro - Contact"
    ).WatchCompile();

    new FileManager(
        "index.html",
        "Cycle Zéro - Réemploi chantier"
    ).WatchCompile();
    
})();
