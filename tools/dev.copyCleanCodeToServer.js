// Recursive search directory method : https://stackoverflow.com/a/45130990/9408443

const { resolve, dirname } = require("path");
const fs = require("fs");
const { readdir } = fs.promises;

let sourceFolder = "landing";
let destFolder = "landing_clean";

async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);

        if (dirent.isDirectory() && dirent.name[0] != ".") {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}

function CopyFile(segmented_name) {
    try {
        const filePath = segmented_name.join("/");
        
        // we replace ./landing by ./lading_clean
        const insertPosition = segmented_name.indexOf(sourceFolder);
        segmented_name.splice(insertPosition, 1, destFolder);

        const destPath = segmented_name.join("/");

        const destdirpath = dirname(destPath);

        // if folder path doesn't exist, we create it before copying the file
        if (!fs.existsSync(destdirpath)) {
            fs.mkdirSync(destdirpath, { recursive: true });
        }

        fs.copyFileSync(filePath, destPath);
    } catch (err) {
        console.error(err);
    }
}

function StartCheck() {

    // if this is the main script called inside the cmd, we try to get the source and dest folder from the cmd arguments
    if(typeof require !== 'undefined' && require.main === module){
        if(process?.argv && process?.argv[2] && process?.argv[3]) {
            sourceFolder = process.argv[2];
            destFolder = process.argv[3];
        }
    }


    /*
        Make sure this script is launch from the root of this project `node ./tools/....js`
        Make sure also the variable sourceFolder match with this project folder name !
        Also make sure landing folder is present at the same level of ./tools/ folder
    */

    if (!fs.existsSync("./" + sourceFolder))
        throw new Error(
            "The project folder called " +
                sourceFolder +
                " doesn't exist. Rename it or change sourceFolder variable of this script"
        );

    return true;
}

function Wait(ms){
    return new Promise((res, rej)=>{
        setTimeout(()=>{
            res()
        }, ms ? ms : 10);
    });
}

(async () => {
    StartCheck();

    await fs.rm("./" + destFolder + "/", { recursive: true }, (err) => {
        if(err)
            console.error(err);
    });

    await Wait(1000);


    let countTreated = [];

    for await (const f of getFiles(`./${sourceFolder}/`)) {
        let toBeIgnored = false;
        const segmented_name = f.split("\\");
        segmented_name.forEach((name) => {
            // we ignored all files that are inside a folder starting with . or th file starting with .
            // but the folder starting with . are already ignored inside getFiles function, to avoid unecessary deep search
            if (name[0] == ".") {
                toBeIgnored = true;
                return;
            }
        });
        countTreated.push(toBeIgnored);
        //console.log(toBeIgnored, f);
        if (!toBeIgnored) CopyFile(segmented_name);
    }

    // count element method : https://www.jsowl.com/count-duplicate-values-in-an-array-in-javascript/
    const elementCounts = {};

    countTreated.forEach((element) => {
        elementCounts[element] = (elementCounts[element] || 0) + 1;
    });

    console.log(elementCounts);
})();
