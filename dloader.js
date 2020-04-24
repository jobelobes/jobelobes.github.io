const fs = require("fs");
const Path = require("path");
const http = require("http");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const deleteDirectory = function (path) {
  if (!fs.existsSync(path)) {
    return;
  }

  fs.readdirSync(path).forEach((file) => {
    const curPath = Path.join(path, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteDirectory(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(path);
};

function wget(uri, path) {
  const outputDir = Path.dirname(path);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  return new Promise((resolve, reject) => {
    http.get(uri, { timeout: 1000 }).on("response", (response) => {
      if (response.statusCode == 404) {
        resolve(null);
        return;
      }
      if (response.statusCode != 200) {
        console.log(`ERROR: ${uri} returned ${response.statusCode}`);
        reject(response);
        return;
      }

      response.pipe(
        fs.createWriteStream(path).on("close", () => {
          resolve(path);
        })
      );
    });
  });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    let content = "";
    const stream = fs.createReadStream(path, { encoding: "utf8" });
    stream.on("data", (data) => {
      content += data;
    });
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("close", () => {
      resolve(content);
    });
  });
}

async function loadMangaData(uri, output) {
  const htmlFilePath = Path.join(output, "index.html");
  await wget(uri, htmlFilePath);

  const htmlContent = (await readFile(htmlFilePath)).toString();
  let matches = htmlContent.match(
    /select[>]\s+of\s+(?<pageCount>\d+)[<][\/]div/is
  );
  if (!matches) {
    console.log("a");
    return;
  }
  const pageCount = parseInt(matches.groups["pageCount"]);

  matches = htmlContent.match(
    /[<]div id=\"imgholder\".*?src=\"(?<url>[^\"]+-(?<startIndex>\d+)[.]jpg)\".*?[<][\/]a[>]/is
  );
  if (!matches) {
    console.log("c");
    return;
  }
  const templateUrl = matches.groups["url"]
    .replace("https:", "http:")
    .replace(/\d+[.]jpg/i, "{index}.jpg");
  const startIndex = parseInt(matches.groups["startIndex"]);

  return {
    uri,
    templateUrl,
    startIndex,
    pageCount,
  };
}

async function downloadManga(manga, output) {
  console.log(`Downloading Manga: ${manga.uri}`);
  console.log(` - Pages: ${manga.pageCount}`);

  let index = manga.startIndex;
  const pages = [];
  while (pages.length < manga.pageCount) {
    const imageUrl = manga.templateUrl.replace("{index}", index.toString());
    const filePath = Path.join(
      output,
      `img-${index.toString().padStart(4, "0")}.jpg`
    );
    await wget(imageUrl, filePath)
      .then((res) => {
        if (res != null) {
          pages.push(res);
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });

    const progress = Math.floor((pages.length / manga.pageCount) * 100);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${index.toString().padStart(10, " ")} - ${progress}%`
    );

    index++;
  }

  console.log("\n");
}

async function main(args) {
  const baseUri = "http://www.mangareader.net";

  const mangaName = args[0];
  const startChapter = args.length > 1 ? parseInt(args[1]) : 1;
  const cleanup = !(args.length > 2 && args[2].toLowerCase() === "--noclean");

  let chapter = startChapter;
  while (true) {
    const uri = `${baseUri}/${mangaName}/${chapter}`;
    const output = Path.join(__dirname, mangaName, `chapter_${chapter}`);

    deleteDirectory(output);
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true });
    }

    const mangaData = await loadMangaData(uri, output);
    if (mangaData == null) {
      return;
    }

    await downloadManga(mangaData, output);

    await exec(
      `magick convert ${Path.join(output, "*.jpg")} ${Path.join(
        output,
        "..",
        `${mangaName}_${chapter}.pdf`
      )}`
    );

    if (cleanup) {
      deleteDirectory(output);
    }

    chapter++;
  }
}

(async () => {
  try {
    await main(process.argv.slice(2));
  } catch (e) {
    console.log(e);
  }
})();
