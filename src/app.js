const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const AdmZip = require('adm-zip');
const fileUrl = "https://raw.githubusercontent.com/TTSWarhammer40k/Battleforged-Workshop-Mod-Compilation/master/battle-forge.zip";
const persistantMessage = ' If this problem persists, please contact us via r/TTSWarhammer40k';
const saveLocations = {
    darwin: os.homedir() + '/Library/Tabletop Simulator',
    linux: "",
    win32: os.homedir() + '\\Documents\\Tabletop Simulator',
}

const saveTo = saveLocations[os.platform()];
if (!saveTo) throw "OS Not Supported";

console.log('Downloading file...');
try {
    const request = https.get(fileUrl, processResponse);
} catch (e) {
    console.log('Download failed, please check your network connection.');
}

function processResponse(response) {
    fs.mkdtemp(path.join(os.tmpdir(), 'ttswarhammer40k-'), (err, folder) => {
        if (err) throw "Failed to create temp directory." + persistantMessage;
        const tmpFileLocation = folder + "/battle-forge.zip";
        try {
            const file = fs.createWriteStream(tmpFileLocation);
            response.pipe(file);

            file.on('finish', () => {
                unzipFile(tmpFileLocation);
            })
        } catch (e) {
            throw "Failed to save to temp directory." + persistantMessage;
        }
    });
}

function unzipFile(tmpFileLocation) {
    const zip = new AdmZip(tmpFileLocation);
    console.info('Saving to: ' + saveTo)
    zip.extractAllTo(saveTo, true);
    console.log('TTSWarhammer40k Update complete');
}

