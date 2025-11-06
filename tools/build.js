import { execSync } from "child_process";
import fs from "fs";

console.log("🧩 Building JKCSS 7.0.0...");

// Ensure dist exists
if (!fs.existsSync("dist")) fs.mkdirSync("dist");

// Build normal (expanded) version
execSync("sass src/jkcss.scss dist/jkcss.css --no-source-map --style=expanded", { stdio: "inherit" });

// Build minified version
execSync("sass src/jkcss.scss dist/jkcss.min.css --no-source-map --style=compressed", { stdio: "inherit" });

console.log("✅ Build complete!");
console.log("📦 Generated: dist/jkcss.css");
console.log("📦 Generated: dist/jkcss.min.css");
