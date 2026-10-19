"use client";

import { LensSim } from "./LensSim";
import { OhmSim } from "./OhmSim";
import { QuadraticSim } from "./QuadraticSim";

/** Renders the simulation named by a `::sim[id]` lesson directive. Unknown ids render nothing. */
export function Simulation({ id }: { id: string }) {
  if (id === "lens") return <LensSim />;
  if (id === "ohm") return <OhmSim />;
  if (id === "quadratic") return <QuadraticSim />;
  return null;
}
