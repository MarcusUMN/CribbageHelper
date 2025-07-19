import { Table, Title, Group, Text } from '@mantine/core';
import Image from 'next/image';
import { ScoreDetail, cardToString, Card } from '../../../utils';

function getCardImageFilename(card: Card): string {
  console.log('getCardImageFilename', cardToString(card));
  return `/cards/${cardToString(card)}.svg`; 
}

export type ScoredResult = {
  score: number;
  details: ScoreDetail[];
  hand: Card[];
  starter: Card;
  isCrib: boolean;
};

export const ScoringBreakdown = ({ score, details, hand, starter, isCrib }: ScoredResult) => {
  return (
    <div style={{ marginTop: 32 }}>
      <Title order={3} mb="sm">
        Total Score: {score}
        <Text span size="sm" c="dimmed" ml="sm">
          ({isCrib ? 'Crib' : 'Hand'})
        </Text>
      </Title>
      <Group gap="xs" mb="md" mt="md" >
        {hand.map((card, idx) => (
          <Image
            key={idx}
            src={getCardImageFilename(card)}
            alt={cardToString(card)}
            width={60}
            height={80}
          />
        ))}
        <Text fw={600} mx="sm">+</Text>
        <Image
          src={getCardImageFilename(starter)}
          alt={cardToString(starter)}
          width={60}
          height={80}
          style={{ border: '2px solid red' }}
        />
      </Group>
      <Table striped highlightOnHover withTableBorder>
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
              <Table.Td><Text fw={600}>{d.points}</Text></Table.Td>
              <Table.Td>{d.type}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {d.cards.map((card, idx) => (
                    <Image
                      key={idx}
                      src={getCardImageFilename(card)}
                      alt={cardToString(card)}
                      width={70}
                      height={90}
                    />
                  ))}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
