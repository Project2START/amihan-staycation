const { spawnSync } = require("child_process");

const runBuild = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
});

if (runBuild.status !== 0) {
  process.exit(runBuild.status || 1);
}

const runScript = spawnSync("node", ["dist/scripts/createAdmin.js"], {
  stdio: "inherit",
  shell: true,
});

process.exit(runScript.status || 1);
