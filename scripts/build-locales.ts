import { exists, existsSync } from "fs";
import { variants2standard, standard2variants } from "./consts";
import { getAbsPath } from "./utils";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";

const fileContentCache: Record<string, string> = {};

interface PresetConfig {
  filename: string;
  from: string[];
  to: string[];
}

export const presets: PresetConfig[] = [
  {
    filename: "full",
    from: Object.keys(variants2standard),
    to: Object.keys(standard2variants),
  },
  { filename: "cn2t", from: ["cn"], to: ["hk", "tw", "twp", "jp"] },
  { filename: "t2cn", from: ["hk", "tw", "twp", "jp"], to: ["cn"] },
];

function getPresetCode(cfg: PresetConfig): string {
  const code = {
    import: [] as string[],
    from: [] as string[],
    to: [] as string[],
  };

  ["from", "to"].forEach((type) => {
    cfg[type as keyof Pick<PresetConfig, "from" | "to">].forEach((loc) => {
      const name = [type, loc].join("_");

      code.import.push(`import ${name} from "../${type}/${loc}.ts";`);
      code[type].push(`${loc}: ${name}`);
    });
  });

  return `${code.import.join("\n")}

const fromDicts = {
    ${code.from.join(",\n    ")}
};

const toDicts = {
    ${code.to.join(",\n    ")}
};

export {fromDicts as from, toDicts as to};`;
}

const outDir = getAbsPath("../data/preset");

if (!existsSync(outDir)) {
  await mkdir(outDir, { recursive: true });
}

await Promise.all(
  presets.map((preset) =>
    writeFile(`${outDir}/${preset.filename}.ts`, getPresetCode(preset)),
  ),
);
