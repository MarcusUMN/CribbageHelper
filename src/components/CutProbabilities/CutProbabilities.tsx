import React, { useState } from 'react';
import { Button, Stack, Title, Group, Table } from '@mantine/core';
import { scoreHand, Card, getDeck, getRandomHand, validateHand } from '../../utils';
import { CardSelector, FormatCard, HeaderSection } from '../Shared';
import classes from './CutProbabilities.module.css';

export const CutProbabilities = () => {
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
      <HeaderSection
        title="Cut Probabilities"
        description="Score your 4-card hand against every possible cut card to see your potential points."
        label="Select Your Hand (4 cards):"
        onRandom={handleRandomHand}
      />
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
            Total Scores With Cut Card
          </Title>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Score</Table.Th>
                <Table.Th>Cut Cards</Table.Th>
                <Table.Th style={{ width: 80, textAlign: 'right' }}>Probability</Table.Th>  {/* New column */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(groupedScores)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([score, starters]) => {
                  const percentage = ((starters.length / 48 ) * 100).toFixed(1);
                  return (
                    <Table.Tr key={score}>
                      <Table.Td style={{ width: 60, textAlign: 'center', fontWeight: 'bold' }}>{score}</Table.Td>
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
                      <Table.Td style={{ width: 60, textAlign: 'center', fontWeight: 'bold' }}>
                        {percentage}%
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
      </React.Fragment>
      )}
    </div>
  );
};
