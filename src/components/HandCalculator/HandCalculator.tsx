import React, { useState } from 'react';
import {
  Button,
  Switch,
  Stack,
  Text,
  Popover,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { HandCalculatorProps } from '../../pages/hand-calculator';
import {
  scoreHand,
  validateHand,
  Card,
  getRandomHand,
  getHandHash,
  parseHandString,
} from '../../utils';
import {
  CardSelector,
  ScoringBreakdown,
  ScoredResult,
  HeaderSection,
} from '../Shared';
import classes from './HandCalculator.module.css';

function toSingleString(param: string | string[] | undefined): string {
  if (!param) return '';
  return Array.isArray(param) ? param[0] : param;
}

export const HandCalculator = ({ initialQueryParams }: HandCalculatorProps) => {
  const router = useRouter();
  const handStr = toSingleString(initialQueryParams.hand);
  const starterStr = toSingleString(initialQueryParams.s);
  const cribStr = toSingleString(initialQueryParams.c);
  
  const parsedHand = parseHandString(handStr);
  const initialHand = parsedHand.length === 4 ? parsedHand : [null, null, null, null];
  const parsedStarter = parseHandString(starterStr);
  const initialStarter = parsedStarter.length === 1 ? parsedStarter[0] : null;
  const initialIsCrib = cribStr.toUpperCase() === 'Y';

  const [hand, setHand] = React.useState<(Card | null)[]>(initialHand);
  const [starter, setStarter] = React.useState<Card | null>(initialStarter);
  const [isCrib, setIsCrib] = React.useState(initialIsCrib);
  const [scoredResult, setScoredResult] = useState<ScoredResult | null>(() => {
    if (
      initialHand.length === 4 &&
      initialHand.every(Boolean) &&
      initialStarter !== null &&
      validateHand(initialHand as Card[], initialStarter)
    ) {
      const result = scoreHand(initialHand as Card[], initialStarter, initialIsCrib);
      return {
        score: result.total,
        details: result.details,
        hand: initialHand as Card[],
        starter: initialStarter,
        isCrib: initialIsCrib,
      };
    }
    return null;
  });

  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
    setScoredResult(null);
  };

  const handleRandomHand = () => {
    const newHand = getRandomHand(5);
    setHand(newHand.slice(0, 4));
    setStarter(newHand[4] || null);
    setScoredResult(null);
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
    const result = scoreHand(hand as Card[], starter, isCrib);
    setScoredResult({
      score: result.total,
      details: result.details,
      hand: hand as Card[],
      starter,
      isCrib,
    });
    const handStr = getHandHash(hand as Card[]);
    const starterStr = getHandHash([starter]);
    const cribFlag = isCrib ? 'Y' : 'N';

    router.replace(
      {
        pathname: router.pathname,
        query: { hand: handStr, s: starterStr, c: cribFlag },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className={classes.wrapper}>
      <HeaderSection
        title="Hand Calculator"
        description="Score your 4-card hand and starter."
        label="Select Your Hand (4 cards):"
        onRandom={handleRandomHand}
      />
      <Stack gap="xs">
        {hand.map((card, idx) => (
          <CardSelector
            key={idx}
            value={card}
            onChange={(c) => handleCardChange(idx, c)}
          />
        ))}
        <Text fw={500}>Cut Card:</Text>
        <CardSelector 
          value={starter} 
          onChange={(card) => {
            setStarter(card);
            setScoredResult(null); 
          }}
        />
        <div className={classes.switchWraper}>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Switch
              label="Score as Crib"
              checked={isCrib}
              onChange={(e) => setIsCrib(e.currentTarget.checked)}
            />
            <Popover.Target>
              <IconInfoCircle
                size={16}
                style={{ verticalAlign: 'middle', marginLeft: 4 }}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">
                In the crib, flushes only count if all 5 cards match suit
              </Text>
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
