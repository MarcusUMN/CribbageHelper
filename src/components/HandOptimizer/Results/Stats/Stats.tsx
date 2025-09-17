import React, { useState, useMemo } from 'react';
import {
  Table as MantineTable,
} from '@mantine/core';
import { Toolbar } from './Toolbar';
import { TableHeader, TableBody, getScoreValue, StatKey } from '../../SharedTable'
import { EvaluationResult, } from '../../../../utils/evaluateSixCardHand'
import classes from './Stats.module.css';

const headers = [
  { label: 'Combined', key: 'combined', colSpan: 3 },
  { label: 'Hand', key: 'hand', colSpan: 3 },
  { label: 'Crib', key: 'crib', colSpan: 3 },
];

export const stats: { label: string; key: StatKey }[] = [
  { label: 'Avg', key: 'avg' },
  { label: 'Min', key: 'min' },
];

type Props = {
  hands: EvaluationResult[];
  isMyCrib: boolean;
};

export const Stats = ({ hands, isMyCrib }: Props) => {
  const [sortBy, setSortBy] = useState<string>('combined_avg');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleStats, setVisibleStats] = useState<Set<StatKey>>(new Set(['avg', 'min']));

  const toggleStat = (key: StatKey) => {
    setVisibleStats((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const maxValues = useMemo(() => {
    const maxMap = new Map<string, number>(); // key: 'combined_avg' etc, value: max number

    hands.forEach((hand) => {
      headers.forEach(({ key: catKey }) => {
        stats.forEach(({ key: statKey }) => {
          if (!visibleStats.has(statKey)) return;
          const sortKey = `${catKey}_${statKey}`;
          const val = getScoreValue(hand, sortKey);
          const currentMax = maxMap.get(sortKey);
          if (currentMax === undefined || val > currentMax) {
            maxMap.set(sortKey, val);
          }
        });
      });
    });

    return maxMap;
  }, [hands, visibleStats]);

  return (
    <React.Fragment>
      <Toolbar stats={stats} visibleStats={visibleStats} onToggleStat={toggleStat} />
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
            hands={hands}
            sortBy={sortBy}
            sortDirection={sortDirection}
            getScoreValue={getScoreValue}
            renderRow={(hand) =>
              headers.flatMap(({ key: catKey }) =>
                stats
                  .filter(({ key: statKey }) => visibleStats.has(statKey))
                  .map(({ key: statKey }, j) => {
                    const sortKey = `${catKey}_${statKey}`;
                    const value = getScoreValue(hand, sortKey);
                    const isMax = value === maxValues.get(sortKey);
                    return (
                      <MantineTable.Td
                        key={sortKey}
                        className={`${j === 0 ? classes.cellBorderLeft : ''} ${isMax ? classes.highlight : ''}`}
                        style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                      >
                        {sortKey.endsWith('avg') ? value.toFixed(1) : Math.round(value)}
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
