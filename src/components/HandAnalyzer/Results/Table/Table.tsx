import React, { useState } from 'react';
import {
  Table as MantineTable,
  Group,
  Text,
} from '@mantine/core';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import { FormatCard } from '../../../Shared';
import { StatKey, HandData, ScoreStats, SortKey, headers, stats } from './types'
import classes from './Table.module.css';

type Props = {
  hands: HandData[];
  isMyCrib: boolean;
};

const getScoreValue = (hand: HandData, sortKey: SortKey) => {
  const [category, stat] = sortKey.split('_') as [keyof HandData['scoreData'], keyof ScoreStats];
  return hand.scoreData[category][stat];
};

const formatValue = (key: SortKey, value: number) =>
  key.endsWith('avg') ? value.toFixed(1) : Math.round(value).toString();

export const Table = ({ hands, isMyCrib }: Props) => {
  const [sortBy, setSortBy] = useState<SortKey>('combined_avg');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleStats, setVisibleStats] = useState<Set<'avg' | 'min'>>(new Set(['avg', 'min']));

  const onSortChange = (key: SortKey) => {
    if (sortBy === key) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const toggleStat = (key: 'avg' | 'min') => {
    setVisibleStats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const initialMaxValues: Record<SortKey, number> = headers.reduce((acc, { key: catKey }) => {
    stats.forEach(({ key: statKey }) => {
      acc[`${catKey}_${statKey}` as SortKey] = -Infinity;
    });
    return acc;
  }, {} as Record<SortKey, number>);

  const maxValues = hands.reduce<Record<SortKey, number>>((acc, hand) => {
    headers.forEach(({ key: catKey }) => {
      stats.forEach(({ key: statKey }) => {
        const sortKey = `${catKey}_${statKey}` as SortKey;
        acc[sortKey] = Math.max(acc[sortKey], getScoreValue(hand, sortKey));
      });
    });
    return acc;
  }, initialMaxValues);

  const sortedHands = [...hands].sort((a, b) => {
    const aVal = getScoreValue(a, sortBy);
    const bVal = getScoreValue(b, sortBy);
    if (aVal === bVal) return 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <React.Fragment>
      <TableToolbar visibleStats={visibleStats} onToggleStat={toggleStat} />
      <div className={classes.tableWrapper}>
        <MantineTable striped>
          <TableHeader
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
            visibleStats={visibleStats}
            isMyCrib={isMyCrib}
          />
          <MantineTable.Tbody>
            {sortedHands.map((hand, idx) => (
              <MantineTable.Tr key={idx}>
                <MantineTable.Td className={classes.discardCell}>
                  <Group gap="xs" wrap="nowrap">
                    {hand.discard.map((cardStr, i) => {
                      const rank = cardStr.slice(0, -1);
                      const suit = cardStr.slice(-1) as 'S' | 'H' | 'D' | 'C';
                      return <FormatCard key={i} rank={rank} suit={suit} />;
                    })}
                  </Group>
                </MantineTable.Td>

                {headers.flatMap(({ key: catKey }) =>
                  stats
                    .filter(({ key: statKey }) => visibleStats.has(statKey as StatKey))
                    .map(({ key: statKey }, j) => {
                      const sortKey = `${catKey}_${statKey}` as SortKey;
                      const value = getScoreValue(hand, sortKey);
                      const isMax = value === maxValues[sortKey];
                      return (
                        <MantineTable.Td
                          key={sortKey}
                          className={`${j === 0 ? classes.cellBorderLeft : ''} ${
                            isMax ? classes.highlightCell : ''
                          }`}
                          style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                        >
                          {formatValue(sortKey, value)}
                        </MantineTable.Td>
                      );
                    })
                )}
              </MantineTable.Tr>
            ))}
          </MantineTable.Tbody>
        </MantineTable>
      </div>
    </React.Fragment>
  );
};
