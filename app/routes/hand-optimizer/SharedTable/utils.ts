import {
  EvaluationResult,
  ScoreStats,
} from "../../../cribbage/evaluateSixCardHand";

export type StatKey = keyof ScoreStats;

export const getScoreValue = (
  hand: EvaluationResult,
  sortKey: string,
): number => {
  const [category, stat] = sortKey.split("_") as [
    keyof EvaluationResult["scoreData"],
    keyof ScoreStats,
  ];
  return hand.scoreData[category][stat] as number;
};
