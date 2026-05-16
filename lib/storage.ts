import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  await fs.writeFile(full, JSON.stringify(value, null, 2), "utf8");
}
