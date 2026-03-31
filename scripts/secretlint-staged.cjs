const { execSync } = require("node:child_process");

function run(command) {
  return execSync(command, { encoding: "utf8" }).trim();
}

try {
  const output = run('git diff --cached --name-only --diff-filter=ACMRTUXB');
  const files = output
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((f) => !f.startsWith("node_modules/"))
    .filter((f) => !f.startsWith("dist/"))
    .filter((f) => !f.startsWith("dist-electron/"))
    .filter((f) => !f.startsWith(".profiles/"));

  if (files.length === 0) {
    console.log("No staged files to scan.");
    process.exit(0);
  }

  const quoted = files.map((f) => `"${f.replace(/"/g, '\\"')}"`).join(" ");
  execSync(`npx secretlint ${quoted}`, { stdio: "inherit" });
} catch (error) {
  process.exit(error.status || 1);
}
