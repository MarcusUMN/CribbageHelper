import React, { useState } from 'react';
import { Button, Stack, Title, Text, Group, Table, ScrollArea } from '@mantine/core';
import { IconDice4Filled } from '@tabler/icons-react';
import { scoreHand, Card, getDeck, getRandomHand, validateHand } from '../../utils';
import { CardSelector, FormatCard } from '../Shared';
import classes from './CutCardInsight.module.css';

export const CutCardInsight = () => {
  const [hand, setHand] = useState<(Card | null)[]>([null, null, null, null]);
  const [cutCardScores, setCutCardScores] = useState<{ starter: Card; score: number }[] | null>(null);

  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
    setCutCardScores(null);
  };

  const handleRandomHand = () => {
    const newHand = getRandomHand(5);
    setHand(newHand.slice(0, 4));
    setCutCardScores(null);
  };

  const handleAnalyzeCutCards = () => {
    if (hand.some((c) => c === null)) {
      alert('Please select all 4 cards first.');
      return;
    }

    if (!validateHand(hand as Card[])) {
      alert('Invalid hand - duplicate cards detected or wrong number');
      return;
    }

    const handCards = hand as Card[];
    const handSet = new Set(handCards.map((c) => c.rank + c.suit));
    const fullDeck = getDeck();
    const possibleStarters = fullDeck.filter((card) => !handSet.has(card.rank + card.suit));

    const results = possibleStarters.map((starterCard) => {
      const scoreObj = scoreHand(handCards, starterCard, false);
      return { starter: starterCard, score: scoreObj.total };
    });

    results.sort((a, b) => b.score - a.score);
    setCutCardScores(results);
  };

   const groupedScores = cutCardScores
    ? cutCardScores.reduce((acc, curr) => {
        if (!acc[curr.score]) acc[curr.score] = [];
        acc[curr.score].push(curr.starter);
        return acc;
      }, {} as Record<number, Card[]>)
    : null;
    
  return (
    <div className={classes.wrapper}>
      <Title order={2}>Cut Card Insight</Title>
      <Group mb="md" mt="md" justify="space-between">
        <Text fw={500}>Select Your Hand (4 cards):</Text>
        <Button onClick={handleRandomHand} rightSection={<IconDice4Filled size={14} />}>
          Random Hand
        </Button>
      </Group>
      <Stack gap="xs">
        {hand.map((card, idx) => (
          <CardSelector key={idx} value={card} onChange={(c) => handleCardChange(idx, c)} />
        ))}
        <Button onClick={handleAnalyzeCutCards} mt="sm" fullWidth>
           Analyze Cut Cards
        </Button>
      </Stack>
      {groupedScores && (
        <React.Fragment>
          <Title order={4} mt="lg" mb="sm">
            Cut Card Scores
          </Title>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Score</Table.Th>
                <Table.Th>Cut Cards</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(groupedScores)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([score, starters]) => (
                  <Table.Tr key={score}>
                    <Table.Td style={{ width: 60, fontWeight: 'bold' }}>{score}</Table.Td>
                    <Table.Td>
                      <Group>
                        {starters.map((starter, i) => (
                          <FormatCard
                            key={i}
                            rank={starter.rank}
                            suit={starter.suit}
                            iconSize={20}
                          />
                        ))}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
      </React.Fragment>
      )}
    </div>
  );
};
