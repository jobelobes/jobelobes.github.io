const fs = require('fs');
const Path = require('path');
const http = require('http');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const deleteDirectory = function(path) {
    if (!fs.existsSync(path)) {
        return;
    }

    fs.readdirSync(path)
        .forEach((file) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    fs.rmdirSync(path);
}

function wget(uri, path) {

    const outputDir = Path.dirname(path);
    if(!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    return new Promise((resolve, reject) => {
        http.get(uri, {timeout: 1000})
            .on('response', (response) => {
                if(response.statusCode == 404) {
                    resolve(null)
                    return;
                }
                if(response.statusCode != 200) {
                    console.log(`ERROR: ${uri} returned ${response.statusCode}`);
                    reject(response)
                    return;
                }

                response.pipe(
                    fs.createWriteStream(path)
                        .on('close', () => {
                            resolve(path);
                        }));
            });
    });
}


function readFile(path) {
    return new Promise ((resolve, reject) => {
        let content = '';
        const stream = fs.createReadStream(path, {encoding: 'utf8'});
        stream.on('data', (data) => {
            content += data;
        });
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('close', () => {
            resolve(content);
        });
    });
}

async function loadManga(url, output){
    const htmlFilePath = Path.join(__dirname, output, 'index.html');
    await wget(url, htmlFilePath);

    const htmlContent = (await readFile(htmlFilePath)).toString();
    let matches = htmlContent.match(/select[>]\s+of\s+(?<pageCount>\d+)[<][\/]div/is);
    if(!matches){
        console.log('a')
        return;
    }
    const pageCount = parseInt(matches.groups['pageCount']);

    matches = htmlContent.match(/[<]div id=\"imgholder\".*?src=\"(?<url>[^\"]+-(?<startIndex>\d+)[.]jpg)\".*?[<][\/]a[>]/is);
    if(!matches){
        return;
    }
    const templateUrl = matches.groups['url'].replace('https:', 'http:').replace(/\d+[.]jpg/i, '{index}.jpg');
    const startIndex = parseInt(matches.groups['startIndex']);

    return {
        templateUrl,
        startIndex,
        pageCount
    }
}

async function downloadManga(url, output) {

    deleteDirectory(Path.join(__dirname, output));

    const manga = await loadManga(url, output);

    console.log(`Downloading Manga: ${url}`);

    let index = manga.startIndex;
    const pages = [];
    while(pages.length < manga.pageCount){
        const imageUrl = manga.templateUrl.replace('{index}', index.toString());
        const filePath = Path.join(__dirname, output, `img-${index.toString().padStart(4, '0')}.jpg`);
        await wget(imageUrl, filePath)
            .then((res) => {
                if(res != null){
                    pages.push(res);
                }
            })
            .catch(err => {
                console.log(err);
                return err;
            });

        const progress = Math.floor((pages.length / manga.pageCount) * 100);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${index.toString().padStart(10, ' ')} - ${progress}%`);

        index++;
    }
    
    await exec(`convert ${Path.join(output, '*.jpg')} ${output}.pdf`);

    deleteDirectory(Path.join(__dirname, output));

    console.log('\n')
}

async function main(){
    for(var i = 6; i <= 17; i++) {
        await downloadManga(`http://www.mangareader.net/dorohedoro/${i}`, `dorohedoro_${i}`);
    }
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
})();
