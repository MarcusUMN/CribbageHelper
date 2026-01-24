import { CutProbabilities } from "./CutProbabilities";
import { createMeta } from "../../tools/meta";

export const meta = () =>
  createMeta({
    title: "Cut Probabilities",
    description:
      "Score your 4-card hand against every possible cut card to see your potential points.",
  });

export default CutProbabilities;
