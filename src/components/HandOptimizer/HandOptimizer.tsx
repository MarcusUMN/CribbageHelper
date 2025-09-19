import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Button, Stack, Switch } from '@mantine/core';
import { CardSelector, HeaderSection, errorLogic } from '../Shared';
import { Results } from './Results';
import { HandOptimizerProps } from '../../pages/hand-optimizer'
import { Card, getRandomHand, getHandHash } from '../../utils';
import classes from './HandOptimizer.module.css';

export const HandOptimizer = ({ initialQueryParams}: HandOptimizerProps) => {
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
    if (!errorLogic.validateHand(hand)) return;
    
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
        title="Hand Optimizer"
        description="Analyze your 6-card hand and discover the optimal 4 cards to keep."
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
