import { Home } from "./Home";
import { createMeta } from "../../tools/meta";

export const meta = () =>
  createMeta({
    title: "Cribbage Tools",
    description: "Cribbage calculators and tools",
  });

export default Home;
