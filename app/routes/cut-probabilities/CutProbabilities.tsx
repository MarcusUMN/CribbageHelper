import React, { useState } from 'react';
import { Stack, Group, Table } from '@mantine/core';
import { useSearchParams } from 'react-router';
import {
  scoreHand,
  Card,
  getDeck,
  getRandomHand,
  getHandHash,
  parseHandString
} from '../../cribbage';
import { CardSelector } from '../../ui/CardSelector';
import { CopyButtonSectionHeader } from '../../ui/CopyButtonSectionHeader';
import { FormatCard } from '../../ui/FormatCard';
import { PageContainer } from '../../ui/PageContainer';
import { RandomGeneratorButton } from '../../ui/RandomGeneratorButton';
import { ComputeButtonBlock } from '../../ui/ComputeButtonBlock';
import { errorLogic } from '../../ui/ErrorNotifications';

export const CutProbabilities = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handStr = searchParams.get('hand') ?? '';
  const parsedHand = parseHandString(handStr);
  const initialHand =
    parsedHand.length === 4 ? parsedHand : [null, null, null, null];

  const [hand, setHand] = useState<(Card | null)[]>(initialHand);

  const [cutCardScores, setCutCardScores] = useState<
    { starter: Card; score: number }[] | null
  >(() => {
    if (initialHand.every(Boolean)) {
      const handCards = initialHand as Card[];
      const handSet = new Set(handCards.map((c) => c.rank + c.suit));
      const fullDeck = getDeck();
      const possibleStarters = fullDeck.filter(
        (card) => !handSet.has(card.rank + card.suit)
      );

      const results = possibleStarters.map((starterCard) => {
        const scoreObj = scoreHand(handCards, starterCard, false);
        return { starter: starterCard, score: scoreObj.total };
      });

      results.sort((a, b) => b.score - a.score);
      return results;
    }
    return null;
  });

  const [lastCalculatedHand, setLastCalculatedHand] = useState<string | null>(
    initialHand.every(Boolean) ? getHandHash(initialHand as Card[]) : null
  );

  const handHash = hand.every(Boolean) ? getHandHash(hand as Card[]) : null;
  const isStale = !cutCardScores || handHash !== lastCalculatedHand;

  const analyzeCutCards = (handToAnalyze: (Card | null)[]) => {
    if (!errorLogic.validateHand(handToAnalyze)) return;

    const handCards = handToAnalyze as Card[];
    const handSet = new Set(handCards.map((c) => c.rank + c.suit));
    const fullDeck = getDeck();
    const possibleStarters = fullDeck.filter(
      (card) => !handSet.has(card.rank + card.suit)
    );

    const results = possibleStarters.map((starterCard) => {
      const scoreObj = scoreHand(handCards, starterCard, false);
      return { starter: starterCard, score: scoreObj.total };
    });

    results.sort((a, b) => b.score - a.score);
    setCutCardScores(results);

    const handKey = getHandHash(handCards);
    setLastCalculatedHand(handKey);

    setSearchParams(
      { hand: handKey },
      { replace: true, preventScrollReset: true }
    );
  };

  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
  };

  const handleRandomHand = () => {
    const newHand = getRandomHand(5).slice(0, 4);
    setHand(newHand);
    analyzeCutCards(newHand);
  };

  const groupedScores = cutCardScores
    ? cutCardScores.reduce(
        (acc, curr) => {
          if (!acc[curr.score]) acc[curr.score] = [];
          acc[curr.score].push(curr.starter);
          return acc;
        },
        {} as Record<number, Card[]>
      )
    : null;

  return (
    <PageContainer
      title="Cut Probabilities"
      description="Score your 4-card hand against every possible cut card to see your potential points."
      label="Select Your Hand (4 cards):"
      headerRight={<RandomGeneratorButton onClick={handleRandomHand} />}
    >
      <Stack>
        {hand.map((card, idx) => (
          <CardSelector
            key={idx}
            label={`Card #${idx + 1}`}
            value={card}
            onChange={(c) => handleCardChange(idx, c)}
          />
        ))}

        <ComputeButtonBlock
          label="Analyze Cut Cards"
          disabledLabel="Cut scores are up to date"
          onClick={() => hand.every(Boolean) && analyzeCutCards(hand)}
          disabledButton={!isStale}
          showStaleMessage={!!cutCardScores && isStale}
        />

        {groupedScores && (
          <React.Fragment>
            <CopyButtonSectionHeader title=" Total Scores With Cut Card" />
            <Table striped withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Score</Table.Th>
                  <Table.Th>Cut Cards</Table.Th>
                  <Table.Th style={{ width: 80, textAlign: 'right' }}>
                    Probability
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(groupedScores)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([score, starters]) => {
                    const percentage = ((starters.length / 48) * 100).toFixed(
                      1
                    );
                    return (
                      <Table.Tr key={score}>
                        <Table.Td
                          style={{
                            width: 60,
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          {score}
                        </Table.Td>
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
                        <Table.Td
                          style={{
                            width: 60,
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          {percentage}%
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
              </Table.Tbody>
            </Table>
          </React.Fragment>
        )}
      </Stack>
    </PageContainer>
  );
};
