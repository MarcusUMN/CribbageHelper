import { HandCalculator } from "./HandCalculator";
import { createMeta } from "../../tools/meta";

export const meta = () =>
  createMeta({
    title: "Hand Calculator",
    description: "Score your 4-card hand and cut card, including crib scoring.",
  });

export default HandCalculator;
