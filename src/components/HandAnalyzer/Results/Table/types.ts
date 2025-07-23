export type StatKey = 'avg' | 'min';

export const stats: { label: string; key: StatKey }[] = [
  { label: 'Avg', key: 'avg' },
  { label: 'Min', key: 'min' },
];

export type CategoryKey = 'combined' | 'hand' | 'crib';

export type SortKey = `${CategoryKey}_${StatKey}`;

export const headers: { label: string; key: CategoryKey; colSpan: number }[] = [
  { label: 'Hand + Crib', key: 'combined', colSpan: 2 },
  { label: 'Hand', key: 'hand', colSpan: 2 },
  { label: 'Crib', key: 'crib', colSpan: 2 },
];

export type ScoreStats = {
  avg: number;
  min: number;
};

export type CardStr = string;

export type HandData = {
  discard: CardStr[];
  scoreData: Record<CategoryKey, ScoreStats>;
};
