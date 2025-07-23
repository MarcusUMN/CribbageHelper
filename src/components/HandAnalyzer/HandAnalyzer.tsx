import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Button, Stack, Switch } from '@mantine/core';
import { CardSelector, HeaderSection } from '../Shared';
import { Results } from './Results';
import { HandAnalyzerProps } from '../../pages/hand-analyzer'
import { Card, getRandomHand, cardToString, getHandHash } from '../../utils';
import classes from './HandAnalyzer.module.css';

export const HandAnalyzer = ({ initialQueryParams}: HandAnalyzerProps) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<ParsedUrlQuery | undefined>(initialQueryParams );
  const [hand, setHand] = useState<(Card | null)[]>([null, null, null, null, null, null]);
  const [isMyCrib, setIsMyCrib] = useState(false);

  const handleChange = (index: number, card: Card | null) => {
    const updated = [...hand];
    updated[index] = card;
    setHand(updated);
  };

  const handleCalculate = () => {
    if (hand.some(c => !c)) {
      alert('Please select all 6 cards');
      return;
    }

    const nonNullCards = hand.filter((c): c is Card => c !== null);
    const uniqueKeys = new Set(nonNullCards.map(cardToString));
    if (uniqueKeys.size < hand.length) {
      alert('Duplicate cards detected. Please ensure all 6 cards are unique.');
      return;
    }
    
    const handHash = getHandHash(hand as Card[]);
    router.push({
      pathname: router.pathname,
      query: {
        data: handHash,
        crib: isMyCrib ? 'Y' : 'N',
      },
    }, undefined, { shallow: true });
  } 

  const handleRandomHand = () => {
    setHand(getRandomHand(6));
  };

  useEffect(() => {
    const key = router.query
    setQueryParams(key);
  }, [router.isReady, router.query]);
  
  if (queryParams && Object.keys(queryParams).length > 0) {
    return <Results queryParams={queryParams}/>
  }

  return (
    <div className={classes.wrapper}>
      <HeaderSection
        title="Hand Analyzer"
        description="Analyze your 6 cards to find the best 4-card hand."
        label="Select Your Hand (6 cards):"
        onRandom={handleRandomHand}
      />
      <Stack gap="xs">
        {hand.map((card, i) => (
          <CardSelector key={i} value={card} onChange={c => handleChange(i, c)} />
        ))}
      </Stack>
      <Switch
        label="My Crib"
        mt="sm"
        checked={isMyCrib}
        onChange={e => setIsMyCrib(e.currentTarget.checked)}
      />
      <Button onClick={handleCalculate} mt="sm" fullWidth>
        Analyze Hand
      </Button>
    </div>
  );
};
