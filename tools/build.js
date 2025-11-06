const { execSync } = require("child_process");
const fs = require("fs");

console.log("🧩 Building JKCSS 7.0.0...");

// Ensure dist directory exists
if (!fs.existsSync("dist")) fs.mkdirSync("dist", { recursive: true });

// Helper function to safely run commands
function run(command) {
    try {
        execSync(command, { stdio: "inherit" });
    } catch (err) {
        console.error("❌ Build failed!");
        console.error(err.message);
        process.exit(1);
    }
}

// Detect sass command: try local (npx) first, fallback to global
const sassCmd = "npx sass";

console.log("⚙️  Compiling expanded version...");
run(`${sassCmd} src/jkcss.scss dist/jkcss.css --no-source-map --style=expanded`);

console.log("⚙️  Compiling minified version...");
run(`${sassCmd} src/jkcss.scss dist/jkcss.min.css --no-source-map --style=compressed`);

console.log("\n✅ Build complete!");
console.log("📦 Generated: dist/jkcss.css");
console.log("📦 Generated: dist/jkcss.min.css");
