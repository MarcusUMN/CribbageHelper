import { PeggingCalculator } from "./PeggingCalculator";
import { createMeta } from "../../tools/meta";

export const meta = () =>
  createMeta({
    title: "Pegging Calculator",
    description: "Enter the pegging sequence after a hand to verify scoring.",
  });

export default PeggingCalculator;
