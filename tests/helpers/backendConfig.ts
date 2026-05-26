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

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Set it in .env.test.local, .env.local, .env, or CI secrets before running npm run test:integration.`
    );
  }

  return value;
};

loadPlaywrightEnv();

export const PLAYWRIGHT_FRONTEND_PORT = 4174;
export const PLAYWRIGHT_BACKEND_PORT = 4001;

export const PLAYWRIGHT_FRONTEND_ORIGIN = `http://127.0.0.1:${PLAYWRIGHT_FRONTEND_PORT}`;
export const PLAYWRIGHT_BACKEND_ORIGIN = `http://127.0.0.1:${PLAYWRIGHT_BACKEND_PORT}`;
export const PLAYWRIGHT_BACKEND_RPC_URL = `${PLAYWRIGHT_BACKEND_ORIGIN}/rpc`;

export const PLAYWRIGHT_ALLOWED_FRONTEND_ORIGINS = [
  PLAYWRIGHT_FRONTEND_ORIGIN,
  `http://localhost:${PLAYWRIGHT_FRONTEND_PORT}`,
].join(",");

export const PLAYWRIGHT_CAPTCHA_BYPASS_CODE = getRequiredEnv(
  "PLAYWRIGHT_CAPTCHA_BYPASS_CODE"
);
