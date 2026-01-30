import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button, Stack, Switch } from '@mantine/core';
import { CardSelector } from '../../ui/CardSelector';
import { PageContainer } from '../../ui/PageContainer';
import { RandomGeneratorButton } from '../../ui/RandomGeneratorButton';
import { errorLogic } from '../../ui/ErrorNotifications';
import { Results } from './Results';
import { Card, getRandomHand, getHandHash } from '../../cribbage';

export const HandOptimizer = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dataParam = searchParams.get('data');
  const cribParam = searchParams.get('crib');
  const hasQueryParams = Boolean(dataParam);

  const [hand, setHand] = useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null
  ]);
  const [isMyCrib, setIsMyCrib] = useState(cribParam === 'Y');

  const handleChange = (index: number, card: Card | null) => {
    const updated = [...hand];
    updated[index] = card;
    setHand(updated);
  };

  const handleCalculate = () => {
    if (!errorLogic.validateHand(hand)) return;

    const handHash = getHandHash(hand as Card[]);
    setSearchParams({
      data: handHash,
      crib: isMyCrib ? 'Y' : 'N'
    });
  };

  const handleRandomHand = () => {
    setHand(getRandomHand(6));
  };

  if (hasQueryParams) {
    return (
      <Results
        queryParams={{
          data: dataParam!,
          crib: cribParam ?? 'N'
        }}
      />
    );
  }

  return (
    <PageContainer
      title="Hand Optimizer"
      description="Analyze your 6-card hand and discover the optimal 4 cards to keep."
      label="Select Your Hand (6 cards):"
      headerRight={<RandomGeneratorButton onClick={handleRandomHand} />}
    >
      <Stack>
        {hand.map((card, idx) => (
          <CardSelector
            label={`Card #${idx + 1}`}
            key={idx}
            value={card}
            onChange={(c) => handleChange(idx, c)}
          />
        ))}
        <Switch
          label="My Crib"
          checked={isMyCrib}
          onChange={(e) => setIsMyCrib(e.currentTarget.checked)}
        />
        <Button onClick={handleCalculate} fullWidth>
          Analyze Hand
        </Button>
      </Stack>
    </PageContainer>
  );
};
