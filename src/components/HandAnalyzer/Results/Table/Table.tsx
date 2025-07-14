import React, { useState } from 'react';
import { Table, Group, Text } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { FormatCard } from '../../../Shared/FormatCard';
import classes from './Table.module.css';

type CardStr = string;

type ScoreStats = {
  avg: number;
  min: number;
};

type HandData = {
  discard: CardStr[];
  scoreData: {
    hand: ScoreStats;
    crib: ScoreStats;
    combined: ScoreStats;
  };
};

type Props = {
  hands: HandData[];
  isMyCrib: boolean;
};

type SortKey =
  | 'combined_avg' | 'combined_min'
  | 'hand_avg' | 'hand_min'
  | 'crib_avg' | 'crib_min';

type SortDirection = 'asc' | 'desc';

const getScoreValue = (hand: HandData, key: SortKey): number => {
  switch (key) {
    case 'combined_avg': return hand.scoreData.combined.avg;
    case 'combined_min': return hand.scoreData.combined.min;
    case 'hand_avg': return hand.scoreData.hand.avg;
    case 'hand_min': return hand.scoreData.hand.min;
    case 'crib_avg': return hand.scoreData.crib.avg;
    case 'crib_min': return hand.scoreData.crib.min;
  }
};

const SortButton = ({ direction }: { direction: SortDirection | null }) => {
  if (direction === 'asc') return <IconChevronUp size={14} />;
  if (direction === 'desc') return <IconChevronDown size={14} />;
  return <span style={{ width: 14, height: 14, display: 'inline-block' }} />;
};

const headers: { label: string; key: SortKey; withBorder?: boolean }[] = [
  { label: 'Avg', key: 'combined_avg', withBorder: true },
  { label: 'Min', key: 'combined_min' },

  { label: 'Avg', key: 'hand_avg', withBorder: true },
  { label: 'Min', key: 'hand_min' },

  { label: 'Avg', key: 'crib_avg', withBorder: true },
  { label: 'Min', key: 'crib_min' },
];

export const TableHeader = ({
  sortBy,
  sortDirection,
  onSortChange,
}: {
  sortBy: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
}) => {
  const renderHeaderCell = (label: string, key: SortKey, withBorder = false) => {
    const isActive = sortBy === key;
    const handleClick = () => onSortChange(key);

    return (
      <Table.Th
        key={key}
        className={withBorder ? classes.cellBorderLeft : ''}
        style={{ userSelect: 'none', whiteSpace: 'nowrap', textAlign: 'center', cursor: 'pointer' }}
        onClick={handleClick}
      >
        <Group justify="center" gap={4} wrap="nowrap">
          <Text fw={700} size="xs" c="#555">
            {label}
          </Text>
          <SortButton direction={isActive ? sortDirection : null} />
        </Group>
      </Table.Th>
    );
  };

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th rowSpan={2} className={classes.discardCell}>
          Discard
        </Table.Th>
        <Table.Th colSpan={2} className={classes.groupHeader}>
          Hand + Crib
        </Table.Th>
        <Table.Th colSpan={2} className={classes.groupHeader}>
          Hand
        </Table.Th>
        <Table.Th colSpan={2} className={classes.groupHeader}>
          Crib
        </Table.Th>
      </Table.Tr>
      <Table.Tr>
        {headers.map(({ label, key, withBorder }) =>
          renderHeaderCell(label, key, withBorder)
        )}
      </Table.Tr>
    </Table.Thead>
  );
};

export const DataTable = ({ hands }: Props) => {
  const [sortBy, setSortBy] = useState<SortKey>('combined_avg');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSortChange = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const sortedHands = [...hands].sort((a, b) => {
    const aVal = getScoreValue(a, sortBy);
    const bVal = getScoreValue(b, sortBy);
    if (aVal === bVal) return 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const maxValuesPerColumn = headers.reduce<Record<SortKey, number>>((acc, { key }) => {
    acc[key] = Math.max(...hands.map(hand => getScoreValue(hand, key)));
    return acc;
  }, {} as Record<SortKey, number>);

  const formatCell = (key: SortKey, value: number) =>
    key.endsWith('_avg') ? value.toFixed(1) : Math.round(value).toString();

  return (
    <div className={classes.tableWrapper}>
      <Table striped >
        <TableHeader
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
        <Table.Tbody>
          {sortedHands.map((hand, idx) => (
            <Table.Tr key={idx}>
              <Table.Td className={classes.discardCell}>
              <Group gap="xs" wrap="nowrap">
                {hand.discard.map((cardStr, i) => {
                  const rank = cardStr.slice(0, -1);  // all but last char(s)
                  const suit = cardStr.slice(-1) as 'S' | 'H' | 'D' | 'C';  // last char
                  return <FormatCard key={i} rank={rank} suit={suit}/>;
                })}
              </Group>
            </Table.Td>
              {headers.map(({ key, withBorder }) => {
                const value = getScoreValue(hand, key);
                const isMax = value === maxValuesPerColumn[key];
                return (
                  <Table.Td
                    key={key}
                    className={`${withBorder ? classes.cellBorderLeft : ''} ${isMax ? classes.highlightCell : ''}`}
                    style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                  >
                    {formatCell(key, value)}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
