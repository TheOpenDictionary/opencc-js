import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname } from "node:path";

import { standard2variants, variants2standard } from "./consts";
import { getAbsPath } from "./utils";

const fileContentCache = new Map<string, string>();

async function downloadFile(fileName: string): Promise<string> {
  const contents = await fetch(
    `https://raw.githubusercontent.com/TheOpenDictionary/opencc-data/refs/heads/main/data/${fileName}.txt`,
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch ${fileName}: ${response.status} ${response.statusText}`,
        );
      }

      return response.text();
    })
    .catch((error) => {
      console.error(`Failed to download ${fileName}:`, error);
      throw error;
    });

  try {
    const processed = contents
      .trimEnd()
      .split("\n")
      .map((line) => {
        const [k, vs] = line.split("\t");
        const [v] = vs.split(" "); // only select the first candidate, the subsequent candidates are ignored
        return [k, v];
      })
      .filter(([k, v]) => k !== v || k.length > 1); // remove "char => the same char" convertions to reduce file size

    return JSON.stringify(Object.fromEntries(processed));
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    throw error;
  }
}

async function loadFile(fileName: string): Promise<string> {
  if (!fileContentCache.has(fileName)) {
    const tson = await downloadFile(fileName);

    fileContentCache.set(fileName, tson);

    const outputFile = getAbsPath(`../data/dict/${fileName}.ts`);
    const outputDir = dirname(outputFile);
    const outputCode = `export default ${tson};\n`;

    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    await writeFile(outputFile, outputCode);
  }

  return fileContentCache.get(fileName)!;
}

async function createDictionaryFiles(
  dir: "from" | "to",
  locales: Record<string, string[]>,
) {
  for (const locale in locales) {
    const outputFile = getAbsPath(`../data/${dir}/${locale}.ts`);
    const outputDir = dirname(outputFile);

    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    const outputCode = await Promise.all(
      locales[locale].map(async (dictName) => {
        await loadFile(dictName);
        return `import ${dictName} from '../dict/${dictName}.ts';`;
      }),
    );

    outputCode.push(`\nexport default [${locales[locale].join(", ")}];`);

    await writeFile(outputFile, outputCode.join("\n"));
  }
}

async function createBarrelFile(path: string) {
  const files = await readdir(path, { withFileTypes: true });
  const imports: string[] = [];
  const exports: string[] = [];

  for (const file of files) {
    if (
      file.isFile() &&
      extname(file.name) === ".ts" &&
      file.name !== "index.ts"
    ) {
      const name = basename(file.name, extname(file.name));
      imports.push(`import ${name} from './${file.name}';`);
      exports.push(name);
    }
  }

  const contents = `${imports.join("\n")}\n\nexport { ${exports.join(", ")} };`;

  await writeFile(getAbsPath(`${path}/index.ts`), contents);
}

try {
  await Promise.all([
    createDictionaryFiles("from", variants2standard),
    createDictionaryFiles("to", standard2variants),
  ]);

  await Promise.all([
    createBarrelFile(getAbsPath("../data/from")),
    createBarrelFile(getAbsPath("../data/to")),
  ]);
} catch (e) {
  console.error("Error downloading data:", e);
  process.exit(1);
} finally {
  process.exit(0);
}
