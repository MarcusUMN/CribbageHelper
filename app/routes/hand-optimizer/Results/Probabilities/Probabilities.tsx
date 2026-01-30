import React, { useMemo, useState } from 'react';
import { Table as MantineTable } from '@mantine/core';
import { Toolbar } from './Toolbar';
import { TableHeader, TableBody, StatKey } from '../../SharedTable';
import { EvaluationResult } from '../../../../cribbage/evaluateSixCardHand';
import classes from './Probabilities.module.css';

const headers = [
  { label: 'Combined', key: 'combined', colSpan: 1 },
  { label: 'Hand', key: 'hand', colSpan: 1 },
  { label: 'Crib', key: 'crib', colSpan: 1 }
];

const stats: { label: string; key: StatKey }[] = [
  { label: 'Probability', key: 'weightedDistribution' }
];

const operators = [
  {
    label: '<',
    value: '<',
    compare: (score: number, threshold: number) => score < threshold
  },
  {
    label: '<=',
    value: '<=',
    compare: (score: number, threshold: number) => score <= threshold
  },
  {
    label: '=',
    value: '=',
    compare: (score: number, threshold: number) => score === threshold
  },
  {
    label: '>=',
    value: '>=',
    compare: (score: number, threshold: number) => score >= threshold
  },
  {
    label: '>',
    value: '>',
    compare: (score: number, threshold: number) => score > threshold
  }
];

type CategoryKey = 'hand' | 'crib' | 'combined';

type Props = {
  hands: EvaluationResult[];
  isMyCrib: boolean;
};

export const Probabilities = ({ hands, isMyCrib }: Props) => {
  const [sortBy, setSortBy] = useState<string>('combined_weightedDistribution');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [threshold, setThreshold] = useState<number>(10);
  const [operator, setOperator] = useState<string>('>=');

  const visibleStats = useMemo(
    () => new Set<StatKey>(['weightedDistribution']),
    []
  );

  const compareFn =
    operators.find((op) => op.value === operator)?.compare ??
    ((score: number, threshold: number) => score >= threshold);

  const getCumulativeProb = (
    hand: EvaluationResult,
    cat: CategoryKey,
    threshold: number
  ): number => {
    const dist = hand.scoreData[cat].weightedDistribution ?? {};
    return Object.entries(dist).reduce(
      (acc, [scoreStr, weightedDistribution]) => {
        const score = Number(scoreStr);
        if (compareFn(score, threshold)) acc += weightedDistribution;
        return acc;
      },
      0
    );
  };

  const getScoreValue = (hand: EvaluationResult, sortKey: string): number => {
    const [catKey, statKey] = sortKey.split('_') as [CategoryKey, StatKey];
    if (statKey === 'weightedDistribution') {
      return getCumulativeProb(hand, catKey, threshold);
    }
    return 0;
  };

  const maxValues = useMemo(() => {
    const maxMap = new Map<string, number>();
    hands.forEach((hand) => {
      headers.forEach(({ key: catKey }) => {
        const sortKey = `${catKey}_weightedDistribution`;
        const val = getScoreValue(hand, sortKey);
        const currentMax = maxMap.get(sortKey);
        if (currentMax === undefined || val > currentMax) {
          maxMap.set(sortKey, val);
        }
      });
    });
    return maxMap;
  }, [hands, threshold, operator]);

  const sortedHands = useMemo(() => {
    return [...hands].sort((a, b) => {
      const aVal = getScoreValue(a, sortBy);
      const bVal = getScoreValue(b, sortBy);
      if (aVal === bVal) return 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [hands, sortBy, sortDirection, threshold, operator]);

  return (
    <React.Fragment>
      <Toolbar
        threshold={threshold}
        onThresholdChange={setThreshold}
        operator={operator}
        onOperatorChange={setOperator}
      />
      <div className={classes.tableWrapper}>
        <MantineTable striped>
          <TableHeader
            headers={headers}
            stats={stats}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(key) => {
              if (sortBy === key) {
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              } else {
                setSortBy(key);
                setSortDirection('desc');
              }
            }}
            visibleStats={visibleStats}
            isMyCrib={isMyCrib}
          />
          <TableBody
            hands={sortedHands}
            sortBy={sortBy}
            sortDirection={sortDirection}
            getScoreValue={getScoreValue}
            renderRow={(hand) =>
              headers.flatMap(({ key: catKey }) =>
                stats.map(({ key: statKey }, j) => {
                  const sortKey = `${catKey}_${statKey}`;
                  const value = getScoreValue(hand, sortKey);
                  const isMax = value === maxValues.get(sortKey);
                  return (
                    <MantineTable.Td
                      key={sortKey}
                      className={`${j === 0 ? classes.cellBorderLeft : ''} ${isMax ? classes.highlight : ''}`}
                      style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                    >
                      {(value * 100).toFixed(1)}%
                    </MantineTable.Td>
                  );
                })
              )
            }
          />
        </MantineTable>
      </div>
    </React.Fragment>
  );
};
