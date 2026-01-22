import React, { useState } from "react";
import { Button, Switch, Stack, Text, Popover, Group } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useSearchParams } from "react-router";
import {
  scoreHand,
  validateHand,
  Card,
  getRandomHand,
  getHandHash,
  parseHandString,
} from "../../cribbage";
import { CardSelector } from "../../ui/CardSelector";
import { ScoringBreakdown, ScoredResult } from "../../ui/ScoringBreakdown";
import { PageContainer } from "../../ui/PageContainer";
import { RandomGeneratorButton } from "../../ui/RandomGeneratorButton";
import { errorLogic } from "../../ui/ErrorNotifications";

export const HandCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handStr = searchParams.get("hand") ?? "";
  const starterStr = searchParams.get("s") ?? "";
  const cribStr = searchParams.get("c") ?? "";

  const parsedHand = parseHandString(handStr);
  const initialHand =
    parsedHand.length === 4 ? parsedHand : [null, null, null, null];
  const parsedStarter = parseHandString(starterStr);
  const initialStarter = parsedStarter.length === 1 ? parsedStarter[0] : null;
  const initialIsCrib = cribStr.toUpperCase() === "Y";

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
      const result = scoreHand(
        initialHand as Card[],
        initialStarter,
        initialIsCrib,
      );
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
    if (!errorLogic.validateHand(hand, { starter: starter })) return;
    const result = scoreHand(hand as Card[], starter as Card, isCrib);
    setScoredResult({
      score: result.total,
      details: result.details,
      hand: hand as Card[],
      starter: starter as Card,
      isCrib,
    });
    const handStr = getHandHash(hand as Card[]);
    const starterStr = getHandHash([starter as Card]);
    const cribFlag = isCrib ? "Y" : "N";

    setSearchParams(
      { hand: handStr, s: starterStr, c: cribFlag },
      { replace: true },
    );
  };

  return (
    <PageContainer
      title="Hand Calculator"
      description="Score your 4-card hand and starter."
      label="Select Your Hand (4 cards):"
      headerRight={<RandomGeneratorButton onClick={handleRandomHand} />}
    >
      <Stack gap="xs">
        <Group gap="lg" align="flex-start" justify="center">
          {hand.map((card, idx) => (
            <CardSelector
              label={`Card #${idx + 1}`}
              key={idx}
              value={card}
              onChange={(c) => handleCardChange(idx, c)}
            />
          ))}
          <CardSelector
            label="Cut Card"
            value={starter}
            onChange={(card) => {
              setStarter(card);
              setScoredResult(null);
            }}
          />
        </Group>
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
                style={{ verticalAlign: "middle", marginLeft: 4 }}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">
                In the crib, flushes only count if all 5 cards match suit
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Group>
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
    </PageContainer>
  );
};
