import React from 'react';
import { Table as MantineTable, Group } from '@mantine/core';
import { FormatCard } from '../../Shared';
import classes from './Table.module.css';
import { EvaluationResult } from '../../../utils/evaluateSixCardHand'

type Props = {
  hands: EvaluationResult[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  getScoreValue: (hand: EvaluationResult, sortKey: string) => number;
  renderRow: (hand: EvaluationResult, idx: number) => React.ReactNode;
};

export const TableBody: React.FC<Props> = ({
  hands,
  sortBy,
  sortDirection,
  getScoreValue,
  renderRow,
}) => {
  const sortedHands = [...hands].sort((a, b) => {
    const aVal = getScoreValue(a, sortBy);
    const bVal = getScoreValue(b, sortBy);
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
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
          {renderRow(hand, idx)}
        </MantineTable.Tr>
      ))}
    </MantineTable.Tbody>
  );
};
