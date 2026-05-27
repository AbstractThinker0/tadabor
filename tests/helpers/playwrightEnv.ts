import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

const loadPlaywrightEnv = () => {
  for (const fileName of [".env.test.local", ".env.local", ".env"]) {
    const envPath = path.join(workspaceRoot, fileName);

    if (!existsSync(envPath)) {
      continue;
    }

    const values = parseEnv(readFileSync(envPath, "utf8"));

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
};

export const getOptionalEnv = (name: string) => process.env[name];

export const getRequiredEnv = (name: string) => {
  const value = getOptionalEnv(name);

  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Set it in .env.test.local, .env.local, .env, or CI secrets before running npm run test:integration.`
    );
  }

  return value;
};

loadPlaywrightEnv();
