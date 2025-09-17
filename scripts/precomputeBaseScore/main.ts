import fs from 'fs';
import path from 'path';
import { generateBaseScores } from './generateBaseScores';

async function main() {
  const { baseScoreMap } = generateBaseScores();

  const outPath = path.resolve(__dirname, '../../src/components/HandOptimizer/scoring/baseScoreCache.json');
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(baseScoreMap, null, 2));
}

main().catch(err => {
  console.error('❌ Error generating base score cache:', err);
});
