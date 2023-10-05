// Import required modules
const { resolve, dirname } = require("path");
const fs = require("fs");
const { readdir, stat } = fs.promises;

// Define source and destination folders
let sourceFolder = "landing";
let destFolder = "landing_clean";

const trackProcess = {
    errorFolder: 0,
    errorFile: 0,
    success: 0
};

// Define a function to copy files
async function copyFile(sourcePath, destPath) {
    try {
        // Check if the source is a directory
        const sourceStats = await stat(sourcePath);
        if (sourceStats.isDirectory()) {
            console.error(`Skipping directory: ${sourcePath}`);
            return;
        }

        // Ensure the destination directory exists
        const destDirPath = dirname(destPath);
        await fs.promises.mkdir(destDirPath, { recursive: true });

        // Copy the file
        await fs.promises.copyFile(sourcePath, destPath);
        console.log(`Copied: ${sourcePath} to ${destPath}`);

        trackProcess.success ++;
    } catch (err) {
        console.error(`Error copying file: ${err.message}`);
        trackProcess.errorFile ++;
    }
}

// Define a function to recursively copy files
async function copyFilesRecursively(sourceDir, destDir) {
    try {
        // Read the source directory
        const dirents = await readdir(sourceDir, { withFileTypes: true });

        // Process each entry
        for (const dirent of dirents) {
            if(!dirent.name.startsWith('.')){
                const sourcePath = resolve(sourceDir, dirent.name);
                const destPath = resolve(destDir, dirent.name);

                // If it's a directory, recursively copy it
                if (dirent.isDirectory()) {
                    await copyFilesRecursively(sourcePath, destPath);
                } else {
                    // If it's a file, copy it
                    await copyFile(sourcePath, destPath);
                }
            }
        }
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
        trackProcess.errorFolder ++;
    }
}

function Wait(ms){
    return new Promise((res, rej)=>{
        setTimeout(()=>{
            res()
        }, ms ? ms : 10);
    });
}

// Main function
(async () => {
    // Check if this script is the main module and parse command-line arguments
    if (require.main === module && process.argv.length >= 4) {
        sourceFolder = process.argv[2];
        destFolder = process.argv[3];
    }

    // Check if source folder exists
    if (!fs.existsSync(sourceFolder)) {
        console.error(`Source folder '${sourceFolder}' does not exist 😵‍💫.`);
        return;
    }else {
        // cleanup the existing directories
        await fs.rm(destFolder, {recursive: true}, 
            (err)=>{
                if(err)
                    console.error(err)
            }    
        );
        await Wait(1000);
    }

    // Recursively copy files from sourceFolder to destFolder
    await copyFilesRecursively(sourceFolder, destFolder);

    console.log("Copy completed with: ", trackProcess);
})();
