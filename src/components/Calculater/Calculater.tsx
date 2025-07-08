import React, { useState } from 'react';
import { Button, Checkbox, Stack, Title, Text, Popover } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { cardToString, Card } from '../../utils/deck';
import { validateHand } from '../../utils/validation';
import { scoreHand, ScoreDetail } from '../../utils/scoring';
import { CardSelector } from './CardSelector';
import classes from './Calculater.module.css';

export const Calculater = () => {
  const [hand, setHand] = useState<(Card | null)[]>([null, null, null, null]);
  const [starter, setStarter] = useState<Card | null>(null);
  const [isMyCrib, setIsMyCrib] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [details, setDetails] = useState<ScoreDetail[]>([]);

  const handleCardChange = (index: number, card: Card | null) => {
    const newHand = [...hand];
    newHand[index] = card;
    setHand(newHand);
  }

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
    setScore(result.total);
    setDetails(result.details);
  }

  return (
    <div className={classes.wrapper}>
      <Title order={2}>Cribbage Hand Scorer</Title>
      <Stack gap="xs">
        <Text mt="md" fw={500}>Your Hand (4 cards):</Text>
        {hand.map((card, idx) => (
          <CardSelector
            key={idx}
            value={card}
            onChange={(c) => handleCardChange(idx, c)}
          />
        ))}
        <Text fw={500}>Cut Card:</Text>
        <CardSelector value={starter} onChange={setStarter} />
        <div className={classes.checkboxWrapper}>
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Checkbox
              label="Score as Crib"
              checked={isMyCrib}
              onChange={(e) => setIsMyCrib(e.currentTarget.checked)}
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
      <Button
        onClick={handleSubmit}
        mt="xl"
        size="md"
        fullWidth
      >
        Score Hand
      </Button>

      {score !== null && (
        <div style={{ marginTop: 32 }}>
          <Title order={3}>Total Score: {score}</Title>
          <ul>
            {details.map((d, i) => (
              <li key={i}>
                <strong>{d.type}</strong>: {d.points} points — {d.cards.map(cardToString).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
