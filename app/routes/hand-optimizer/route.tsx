import { HandOptimizer } from "./HandOptimizer";
import { createMeta } from "../../tools/meta";

export const meta = () =>
  createMeta({
    title: "Hand Optimizer",
    description:
      "Analyze your 6-card hand and discover the optimal 4 cards to keep.",
  });

export default HandOptimizer;
