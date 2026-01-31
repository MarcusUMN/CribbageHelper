import { useState } from 'react';
import { Switch, Stack, Text, Popover, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useSearchParams } from 'react-router';
import {
  scoreHand,
  validateHand,
  Card,
  getRandomHand,
  getHandHash,
  parseHandString
} from '../../cribbage';
import { CardSelector } from '../../ui/CardSelector';
import { ScoringBreakdown, ScoredResult } from './ScoringBreakdown';
import { ComputeButtonBlock } from '../../ui/ComputeButtonBlock';
import { PageContainer } from '../../ui/PageContainer';
import { RandomGeneratorButton } from '../../ui/RandomGeneratorButton';
import { errorLogic } from '../../ui/ErrorNotifications';

type HandScoreInputs = {
  hand: string;
  starter: string;
  isCrib: boolean;
};

export const HandCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handStr = searchParams.get('hand') ?? '';
  const starterStr = searchParams.get('s') ?? '';
  const cribStr = searchParams.get('c') ?? '';

  const parsedHand = parseHandString(handStr);
  const initialHand =
    parsedHand.length === 4 ? parsedHand : [null, null, null, null];
  const parsedStarter = parseHandString(starterStr);
  const initialStarter = parsedStarter.length === 1 ? parsedStarter[0] : null;
  const initialIsCrib = cribStr.toUpperCase() === 'Y';

  const [hand, setHand] = useState<(Card | null)[]>(initialHand);
  const [starter, setStarter] = useState<Card | null>(initialStarter);
  const [isCrib, setIsCrib] = useState(initialIsCrib);
  const [lastCalculated, setLastCalculated] = useState<HandScoreInputs | null>(
    null
  );

  const [scoredResult, setScoredResult] = useState<ScoredResult | null>(() => {
    if (
      initialHand.length === 4 &&
      initialHand.every(Boolean) &&
      initialStarter &&
      validateHand(initialHand as Card[], initialStarter)
    ) {
      const result = scoreHand(
        initialHand as Card[],
        initialStarter,
        initialIsCrib
      );

      const inputs = {
        hand: getHandHash(initialHand as Card[]),
        starter: getHandHash([initialStarter]),
        isCrib: initialIsCrib
      };

      setLastCalculated(inputs);

      return {
        score: result.total,
        details: result.details,
        hand: initialHand as Card[],
        starter: initialStarter,
        isCrib: initialIsCrib
      };
    }
    return null;
  });

  const currentInputs: HandScoreInputs | null =
    hand.every(Boolean) && starter
      ? {
          hand: getHandHash(hand as Card[]),
          starter: getHandHash([starter]),
          isCrib
        }
      : null;

  const isStale =
    !scoredResult ||
    !currentInputs ||
    !lastCalculated ||
    lastCalculated.hand !== currentInputs.hand ||
    lastCalculated.starter !== currentInputs.starter ||
    lastCalculated.isCrib !== currentInputs.isCrib;

  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
  };

  const calculateHand = (
    handToScore: (Card | null)[],
    starterToScore: Card | null,
    isCribFlag: boolean
  ) => {
    if (!errorLogic.validateHand(handToScore, { starter: starterToScore }))
      return;

    const result = scoreHand(
      handToScore as Card[],
      starterToScore as Card,
      isCribFlag
    );

    const inputs = {
      hand: getHandHash(handToScore as Card[]),
      starter: getHandHash([starterToScore as Card]),
      isCrib: isCribFlag
    };

    setScoredResult({
      score: result.total,
      details: result.details,
      hand: handToScore as Card[],
      starter: starterToScore as Card,
      isCrib: isCribFlag
    });

    setLastCalculated(inputs);

    setSearchParams(
      { hand: inputs.hand, s: inputs.starter, c: isCribFlag ? 'Y' : 'N' },
      { replace: true, preventScrollReset: true }
    );
  };

  const handleRandomHand = () => {
    const newHand = getRandomHand(5);
    const handCards = newHand.slice(0, 4);
    const starterCard = newHand[4] || null;

    setHand(handCards);
    setStarter(starterCard);

    calculateHand(handCards, starterCard, isCrib);
  };

  return (
    <PageContainer
      title="Hand Calculator"
      description="Score your 4-card hand and starter."
      bottomLeft="Select Your Hand (4 cards):"
      bottomRight={<RandomGeneratorButton onClick={handleRandomHand} />}
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

        <CardSelector
          label="Cut Card"
          value={starter}
          onChange={(card) => {
            setStarter(card);
          }}
        />

        <Group gap={0}>
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
        </Group>

        <ComputeButtonBlock
          onClick={() => calculateHand(hand, starter, isCrib)}
          disabledButton={!isStale}
          showStaleMessage={!!scoredResult && isStale}
          label="Score Hand"
          disabledLabel="Score is up to date"
        />

        {scoredResult && (
          <ScoringBreakdown
            score={scoredResult.score}
            details={scoredResult.details}
            hand={scoredResult.hand}
            starter={scoredResult.starter}
            isCrib={scoredResult.isCrib}
          />
        )}
      </Stack>
    </PageContainer>
  );
};
