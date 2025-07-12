import { fileURLToPath } from "bun";

export function getAbsPath(relativePath: string): string {
	return fileURLToPath(new URL(relativePath, import.meta.url));
}
