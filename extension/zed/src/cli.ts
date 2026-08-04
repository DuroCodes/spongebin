#!/usr/bin/env bun
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const TASK_LABEL = "spongebin: upload";
const TASKS_TEMPLATE = "extension/zed/tasks.json";
const UPLOAD_ARG = "$ZED_WORKTREE_ROOT/extension/zed/src/upload.ts";
const UPLOAD_SRC = "extension/zed/src/upload.ts";
const SHARED_IMPORT = 'from "@spongebin/shared"';
const LOCAL_SHARED_IMPORT = 'from "./shared/src/index.ts"';

const FILES = [
  "shared/src/index.ts",
  "shared/src/languages.ts",
  "shared/src/extensions.ts",
  "shared/src/paste.ts",
  UPLOAD_SRC,
] as const;

type Task = { label?: string; args?: string[]; [key: string]: unknown };

const home = (...parts: string[]) => path.join(os.homedir(), ...parts);

const installDir = () =>
  process.env.SPONGEBIN_HOME?.trim() ||
  path.join(
    process.env.XDG_DATA_HOME?.trim() || home(".local", "share"),
    "spongebin",
  );

const zedTasksPath = () =>
  path.join(
    process.env.XDG_CONFIG_HOME?.trim() || home(".config"),
    "zed",
    "tasks.json",
  );

const repoRoot = () => {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(here, "../../..");
    const looksLikeCheckout =
      fs.existsSync(path.join(here, "upload.ts")) &&
      fs.existsSync(path.join(root, "shared/src/index.ts"));
    if (looksLikeCheckout) return root;
  } catch {
    // remote `bun run https://…` has no local checkout
  }
  return null;
};

const rawBase = () => {
  const repo = process.env.SPONGEBIN_REPO?.trim() || "DuroCodes/spongebin";
  const ref = process.env.SPONGEBIN_REF?.trim() || "main";
  return `https://raw.githubusercontent.com/${repo}/${ref}`;
};

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

const writeJson = (filePath: string, value: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const fetchText = async (rel: string) => {
  const root = repoRoot();
  if (root) return fs.readFileSync(path.join(root, rel), "utf8");

  const res = await fetch(`${rawBase()}/${rel}`);
  if (!res.ok) throw new Error(`failed to fetch ${rel}: ${res.status}`);
  return await res.text();
};

const otherTasks = (tasks: Task[]) =>
  tasks.filter((task) => task.label !== TASK_LABEL);

const install = async () => {
  const dest = installDir();
  const tasksPath = zedTasksPath();
  const uploadPath = path.join(dest, "upload.ts");

  console.log(`installing spongebin zed task → ${dest}`);

  for (const rel of FILES) {
    const target = rel === UPLOAD_SRC ? uploadPath : path.join(dest, rel);
    const text = (await fetchText(rel)).replaceAll(
      SHARED_IMPORT,
      LOCAL_SHARED_IMPORT,
    );

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }

  const [task] = JSON.parse(
    (await fetchText(TASKS_TEMPLATE)).replaceAll(UPLOAD_ARG, uploadPath),
  ) as Task[];

  writeJson(tasksPath, [...otherTasks(readJson<Task[]>(tasksPath, [])), task]);

  console.log("done.");
  console.log(`  script: ${uploadPath}`);
  console.log(`  tasks:  ${tasksPath}`);
};

const uninstall = () => {
  const dest = installDir();
  const tasksPath = zedTasksPath();
  const hadInstall = fs.existsSync(dest);

  console.log("uninstalling spongebin zed task…");

  if (hadInstall) {
    fs.rmSync(dest, { recursive: true, force: true });
    console.log(`  removed ${dest}`);
  }

  if (!hadInstall) console.log(`  no install dir at ${dest}`);

  if (!fs.existsSync(tasksPath)) {
    console.log(`  no tasks file at ${tasksPath}`);
    console.log("done.");
    return;
  }

  const next = otherTasks(readJson<Task[]>(tasksPath, []));
  if (!next.length) {
    fs.unlinkSync(tasksPath);
    console.log(`  removed empty ${tasksPath}`);
    console.log("done.");
    return;
  }

  writeJson(tasksPath, next);
  console.log(`  updated ${tasksPath}`);
  console.log("done.");
};

const commands: Record<string, () => void | Promise<void>> = {
  install,
  uninstall,
};

const command = process.argv[2];
const run = command ? commands[command] : undefined;
if (!run) {
  console.error("usage: bun run cli.ts <install|uninstall>");
  process.exit(2);
}

await run();
