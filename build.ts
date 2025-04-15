import fs from 'fs';
import { variants2standard, standard2variants, presets } from './src/data-config.js';
import { fileURLToPath } from 'url';
import path from 'path';

function getAbsPath(relativePath: string): string {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

const fileContentCache: Record<string, string> = {};

function loadFile(fileName: string): string {
  if (!fileContentCache[fileName]) {
    fileContentCache[fileName] = fs
      .readFileSync(`node_modules/opencc-data/data/${fileName}.txt`, {
        encoding: 'utf-8'
      })
      .trimEnd()
      .split('\n')
      .map((line) => {
        const [k, vs] = line.split('\t');
        const v = vs.split(' ')[0]; // only select the first candidate, the subsequent candidates are ignored
        return [k, v];
      })
      .filter(([k, v]) => k !== v || k.length > 1) // remove "char => the same char" convertions to reduce file size
      .map(([k, v]) => k + ' ' + v)
      .join('|');

    // Ensure directory exists
    const outputDir = path.dirname(getAbsPath(`./dist/esm-lib/dict/${fileName}.js`));
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = getAbsPath(`./dist/esm-lib/dict/${fileName}.js`);
    const outputCode = `export default "${fileContentCache[fileName]}";\n`;
    fs.writeFileSync(outputFile, outputCode);
  }
  return fileContentCache[fileName];
}

interface PresetConfig {
  from: string[];
  to: string[];
  filename?: string;
}

function getPresetCode(cfg: PresetConfig): string {
  const code = { import: [] as string[], from: [] as string[], to: [] as string[] };
  ['from', 'to'].forEach(type => {
    cfg[type as keyof Pick<PresetConfig, 'from' | 'to'>].forEach(loc => {
      code.import.push(`import ${type}_${loc} from "../${type}/${loc}.js";`);
      code[type as keyof Pick<typeof code, 'from' | 'to'>].push(`${loc}: ${type}_${loc}`);
    });
  });
  return `${code.import.join('\n')}

const fromDicts = {
    ${code.from.join(',\n    ')}
};

const toDicts = {
    ${code.to.join(',\n    ')}
};

export {fromDicts as from, toDicts as to};`;
}

// create directories if not exists.
['from', 'to', 'dict', 'preset'].forEach(d => {
  const dirpath = getAbsPath(`./dist/esm-lib/${d}`);
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
});

// update dict/*, from/*, to/*
['from', 'to'].forEach(type => {
  const localeCollection = type === 'from' ? variants2standard : standard2variants;
  for (const locale in localeCollection) {
    const outputFile = getAbsPath(`./dist/esm-lib/${type}/${locale}.js`);
    const outputCode = [];
    localeCollection[locale].forEach(dictName => {
      outputCode.push(`import ${dictName} from '../dict/${dictName}.js';`);
      loadFile(dictName);
    });
    outputCode.push(`\nexport default [${localeCollection[locale].join(', ')}];`);
    fs.writeFileSync(outputFile, outputCode.join('\n'));
  }
});

// update from/index.js to/index.js
['from', 'to'].forEach(type => {
  const localeCollection = type === 'from' ? variants2standard : standard2variants;
  const locales = Object.keys(localeCollection);
  const code = locales.map(loc => `import ${loc} from "./${loc}.js";`);
  code.push('');
  code.push(`export { ${locales.join(', ')} }`);
  fs.writeFileSync(getAbsPath(`./dist/esm-lib/${type}/index.js`), code.join('\n'));
});

// update presets
presets.forEach(o => {
  fs.writeFileSync(
    getAbsPath(`./dist/esm-lib/preset/${o.filename}.js`),
    getPresetCode(o)
  );
});