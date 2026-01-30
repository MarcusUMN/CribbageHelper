import React from 'react';
import { Table, Group, Text, Image } from '@mantine/core';
import { ScoreDetail, cardToString, Card } from '../../../cribbage';
import { CopyButtonSectionHeader } from '../../../ui/CopyButtonSectionHeader';

function getCardImageFilename(card: Card): string {
  return `/cards/${cardToString(card)}.svg`;
}

export type ScoredResult = {
  score: number;
  details: ScoreDetail[];
  hand: Card[];
  starter: Card;
  isCrib: boolean;
};

export const ScoringBreakdown = ({
  score,
  details,
  hand,
  starter,
  isCrib
}: ScoredResult) => {
  return (
    <React.Fragment>
      <CopyButtonSectionHeader
        title={
          <React.Fragment>
            Total Score: {score}
            <Text span size="sm" c="dimmed" ml="sm">
              ({isCrib ? 'Crib' : 'Hand'})
            </Text>
          </React.Fragment>
        }
      />
      <Group>
        {hand.map((card, idx) => (
          <Image
            key={idx}
            src={getCardImageFilename(card)}
            w={60}
            h={80}
            fit="contain"
          />
        ))}
        <Text fw={600}>+</Text>
        <Image
          src={getCardImageFilename(starter)}
          alt={cardToString(starter)}
          w={60}
          h={80}
          fit="contain"
          style={{ border: '2px solid red' }}
        />
      </Group>
      <Table striped withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Points</Table.Th>
            <Table.Th>Reason</Table.Th>
            <Table.Th>Cards</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {details.map((d, i) => (
            <Table.Tr key={i}>
              <Table.Td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {d.points}
              </Table.Td>
              <Table.Td>{d.type}</Table.Td>
              <Table.Td>
                <Group>
                  {d.cards.map((card, idx) => (
                    <Image
                      key={idx}
                      src={getCardImageFilename(card)}
                      w={70}
                      h={90}
                      fit="contain"
                    />
                  ))}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </React.Fragment>
  );
};
