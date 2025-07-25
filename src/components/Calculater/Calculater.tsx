import React, { useState } from 'react';
import { Button, Switch, Stack, Title, Text, Popover, Group } from '@mantine/core';
import { IconInfoCircle, IconDice4Filled } from '@tabler/icons-react';
import { scoreHand, validateHand, Card, getRandomHand } from '../../utils';
import { CardSelector, ScoringBreakdown, ScoredResult } from '../Shared';
import classes from './Calculater.module.css';

export const Calculater = () => {
  const [hand, setHand] = useState<(Card | null)[]>([null, null, null, null]);
  const [starter, setStarter] = useState<Card | null>(null);
  const [isMyCrib, setIsMyCrib] = useState(false);
  
  // Used for scoring
  const [scoredResult, setScoredResult] = useState<ScoredResult>();


  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
  }

  const handleRandomHand = () => {
    const newHand = getRandomHand(5);
    setHand(newHand.slice(0, 4));
    setStarter(newHand[4] || null);
  };

  const handleSubmit = () => {
    if (!starter || hand.some((c) => c === null)) {
      alert('Please select all cards / suits');
      return;
    }
    if (!validateHand(hand as Card[], starter)) {
      alert('Invalid hand - duplicate cards detected or wrong number');
      return;
    }
    const result = scoreHand(hand as Card[], starter, isMyCrib);
    setScoredResult({
      score: result.total,
      details: result.details,
      hand: hand as Card[],
      starter,
      isCrib: isMyCrib,
  });
  }

  return (
    <div className={classes.wrapper}>
      <Title order={2}>Hand Scorer / Calculater</Title>
      <Group  mb="md" mt="md" justify="space-between">
        <Text fw={500}>Your Hand (4 cards):</Text>
        <Button onClick={handleRandomHand} rightSection={<IconDice4Filled size={14} />}>Random Hand</Button>
      </Group>
      <Stack gap="xs">
        {hand.map((card, idx) => (
          <CardSelector
            key={idx}
            value={card}
            onChange={(c) => handleCardChange(idx, c)}
          />
        ))}
        <Text fw={500}>Cut Card:</Text>
        <CardSelector value={starter} onChange={setStarter} />
        <div className={classes.switchWraper}>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Switch
              label="Score as Crib"
              checked={isMyCrib}
              onChange={e => setIsMyCrib(e.currentTarget.checked)}
            />
            <Popover.Target>
              <IconInfoCircle size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">In the crib, flushes only count if all 5 cards match suit</Text>
            </Popover.Dropdown>
          </Popover>
        </div>
      </Stack>
      <Button onClick={handleSubmit} mt="sm" fullWidth>
        Score Hand
      </Button>
      {scoredResult && (
        <ScoringBreakdown
          score={scoredResult.score}
          details={scoredResult.details}
          hand={scoredResult.hand}
          starter={scoredResult.starter}
          isCrib={scoredResult.isCrib}
        />
      )}
    </div>
  );
};
