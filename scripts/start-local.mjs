import { spawn, spawnSync } from "node:child_process";

const build = spawnSync(process.execPath, ["scripts/run-framework.mjs", "build"], {
  stdio: "inherit",
  shell: false,
});
if (build.error || build.status !== 0) {
  if (build.error) console.error(build.error);
  process.exit(build.status ?? 1);
}

const server = spawn(process.execPath, [
  "--import", "./scripts/sites-env.mjs",
  "./node_modules/wrangler/bin/wrangler.js", "dev",
  "--config", "dist/server/wrangler.json", "--local",
  "--persist-to", ".wrangler/state", "--ip", "127.0.0.1",
  "--inspector-port", "0",
], { stdio: "inherit", shell: false });

server.on("error", error => { console.error(error); process.exitCode = 1; });
server.on("exit", code => { process.exitCode = code ?? 0; });
