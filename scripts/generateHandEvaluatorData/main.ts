import fs from 'fs';
import path from 'path';
import { generateData } from './data/generateData';

async function main(limit?: number) {
  const { results, timeTakenSeconds, processedHands } = generateData(20);

  const outPath = path.resolve(__dirname, '../../src/components/HandAnalyzer/data.json');
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  console.log(`Saved data file to ${outPath}`);
  console.log(`Generation took ${timeTakenSeconds.toFixed(2)} seconds.`);
  console.log(`Processed ${processedHands} unique hands.`);
  console.log(`Average time per hand: ${(timeTakenSeconds / processedHands).toFixed(4)} seconds.`);
}

const limitArg = process.argv[2];
const limit = limitArg ? parseInt(limitArg, 10) : undefined;

main(limit).catch(err => {
  console.error('Error generating hand evaluator data:', err);
});
