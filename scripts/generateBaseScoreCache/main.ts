import fs from "fs";
import path from "path";
import { generateBaseScoreCache } from "./generateBaseScoreCache";

async function main() {
  const { baseScoreMap } = generateBaseScoreCache();

  const outPath = path.resolve(
    __dirname,
    "../../app/cribbage/data/baseScoreCache.json",
  );
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(baseScoreMap, null, 2));
}

main().catch((err) => {
  console.error("❌ Error generating base score cache:", err);
});
