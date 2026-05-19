const { spawn } = require("node:child_process");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const baseEnv = {
  ...process.env,
  BACKEND_PORT: process.env.BACKEND_PORT || "3001",
  FRONTEND_PORT: process.env.FRONTEND_PORT || "3000",
};

const commands = [
  {
    name: "backend",
    args: ["--prefix", "backEnd", "run", "dev"],
    env: {
      ...baseEnv,
      PORT: baseEnv.BACKEND_PORT,
    },
  },
  {
    name: "frontend",
    args: [
      "--prefix",
      "frontend",
      "run",
      "dev",
      "--",
      "--host",
      "0.0.0.0",
    ],
    env: baseEnv,
  },
];

const children = commands.map(({ name, args, env }) => {
  const child = spawn(npmCommand, args, {
    cwd: rootDir,
    env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (data) => process.stdout.write(`[${name}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${name}] ${data}`));

  return { name, child };
});

let shuttingDown = false;

function stopAll(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const { child } of children) {
    if (!child.killed) child.kill();
  }

  process.exit(exitCode);
}

for (const { name, child } of children) {
  child.on("exit", (code) => {
    if (!shuttingDown && name !== "backend") {
      console.error(`${name} exited with code ${code}`);
      stopAll(code || 0);
    } else if (!shuttingDown) {
      console.error(`${name} exited with code ${code}`);
    }
  });
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
