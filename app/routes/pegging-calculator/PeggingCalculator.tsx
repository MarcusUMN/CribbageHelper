import React, { useState } from 'react';
import { Stack, Select, Title, Group, Table } from '@mantine/core';
import { useSearchParams } from 'react-router';
import { CardSelector } from '../../ui/CardSelector';
import { FormatCard } from '../../ui/FormatCard';
import { PageContainer } from '../../ui/PageContainer';
import { RandomGeneratorButton } from '../../ui/RandomGeneratorButton';
import { CopyButtonSectionHeader } from '../../ui/CopyButtonSectionHeader';
import { ComputeButtonBlock } from '../../ui/ComputeButtonBlock';
import { errorLogic } from '../../ui/ErrorNotifications';
import { Card } from '../../cribbage';
import {
  calculatePeggingSequenceFromHands,
  generateLegalPeggingHands,
  getHandHash,
  parseHandString
} from '../../cribbage';

type PeggingInputs = {
  p1: string;
  p2: string;
  startingPlayer: 'P1' | 'P2';
};

export const PeggingCalculator = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialP1 = parseHandString(searchParams.get('p1') ?? '');
  const initialP2 = parseHandString(searchParams.get('p2') ?? '');
  const initialStartingPlayer = (searchParams.get('sp') as 'P1' | 'P2') ?? 'P1';

  const [startingPlayer, setStartingPlayer] = useState<'P1' | 'P2'>(
    initialStartingPlayer
  );
  const [p1Plays, setP1Plays] = useState<(Card | null)[]>(
    initialP1.length === 4 ? initialP1 : [null, null, null, null]
  );
  const [p2Plays, setP2Plays] = useState<(Card | null)[]>(
    initialP2.length === 4 ? initialP2 : [null, null, null, null]
  );

  const [lastCalculated, setLastCalculated] = useState<PeggingInputs | null>(
    () => {
      if (initialP1.length === 4 && initialP2.length === 4) {
        return {
          p1: getHandHash(initialP1),
          p2: getHandHash(initialP2),
          startingPlayer: initialStartingPlayer
        };
      }
      return null;
    }
  );

  const [results, setResults] = useState<any[] | null>(() => {
    if (initialP1.length === 4 && initialP2.length === 4) {
      return calculatePeggingSequenceFromHands({
        starter: initialStartingPlayer,
        p1Plays: initialP1,
        p2Plays: initialP2
      }).map((p, idx) => ({ ...p, idx, reason: p.reasons.join(', ') }));
    }
    return null;
  });

  const currentInputs: PeggingInputs | null =
    p1Plays.every(Boolean) && p2Plays.every(Boolean)
      ? {
          p1: getHandHash(p1Plays.filter((c): c is Card => c !== null)),
          p2: getHandHash(p2Plays.filter((c): c is Card => c !== null)),
          startingPlayer
        }
      : null;

  const isStale =
    !results ||
    !currentInputs ||
    !lastCalculated ||
    lastCalculated.p1 !== currentInputs.p1 ||
    lastCalculated.p2 !== currentInputs.p2 ||
    lastCalculated.startingPlayer !== currentInputs.startingPlayer;

  const handleCardChange = (
    player: 'P1' | 'P2',
    idx: number,
    card: Card | null
  ) => {
    if (player === 'P1') {
      const next = [...p1Plays];
      next[idx] = card;
      setP1Plays(next);
    } else {
      const next = [...p2Plays];
      next[idx] = card;
      setP2Plays(next);
    }
  };

  const calculatePegging = (
    p1: (Card | null)[],
    p2: (Card | null)[],
    starter: 'P1' | 'P2'
  ) => {
    if (!errorLogic.validatePlayableSequence(starter, p1, p2)) return;

    const pegging = calculatePeggingSequenceFromHands({
      starter,
      p1Plays: p1,
      p2Plays: p2
    }).map((p, idx) => ({ ...p, idx, reason: p.reasons.join(', ') }));

    const inputs: PeggingInputs = {
      p1: getHandHash(p1.filter((c): c is Card => c !== null)),
      p2: getHandHash(p2.filter((c): c is Card => c !== null)),
      startingPlayer: starter
    };

    setResults(pegging);
    setLastCalculated(inputs);

    setSearchParams(
      { p1: inputs.p1, p2: inputs.p2, sp: starter },
      { replace: true, preventScrollReset: true }
    );
  };

  const handleRandomSequence = () => {
    const { p1, p2 } = generateLegalPeggingHands();
    setP1Plays(p1);
    setP2Plays(p2);
    setStartingPlayer('P1');
    calculatePegging(p1, p2, 'P1');
  };

  return (
    <PageContainer
      title="Pegging Calculator"
      description="Enter the pegging sequence after a hand to verify scoring."
      bottomLeft="Starting Player"
      bottomRight={
        <RandomGeneratorButton
          label="Generate Random Sequence"
          onClick={handleRandomSequence}
        />
      }
    >
      <Stack>
        <Select
          label="Who played first?"
          value={startingPlayer}
          onChange={(val) => setStartingPlayer(val as 'P1' | 'P2')}
          data={[
            { value: 'P1', label: 'Player 1' },
            { value: 'P2', label: 'Player 2' }
          ]}
        />

        <Group align="flex-start" grow>
          <Stack>
            <Title
              order={5}
              ta="center"
              bg="var(--mantine-color-appCyanLight-0)"
            >
              Player 1
            </Title>
            <Group>
              {p1Plays.map((card, idx) => (
                <CardSelector
                  key={idx}
                  value={card}
                  onChange={(c) => handleCardChange('P1', idx, c)}
                  variant="grid"
                  label={`Card #${idx + 1}`}
                />
              ))}
            </Group>
          </Stack>

          <Stack>
            <Title
              order={5}
              ta="center"
              bg="var(--mantine-color-appPinkLight-0)"
            >
              Player 2
            </Title>
            <Group>
              {p2Plays.map((card, idx) => (
                <CardSelector
                  key={idx}
                  value={card}
                  onChange={(c) => handleCardChange('P2', idx, c)}
                  variant="grid"
                  label={`Card #${idx + 1}`}
                />
              ))}
            </Group>
          </Stack>
        </Group>
        <ComputeButtonBlock
          onClick={() => calculatePegging(p1Plays, p2Plays, startingPlayer)}
          disabledButton={!isStale}
          showStaleMessage={!!results && isStale}
          label="Calculate Pegging"
          disabledLabel="Pegging is up to date"
        />
        {results && (
          <React.Fragment>
            <CopyButtonSectionHeader title="Pegging Sequence" />
            <Group grow>
              <Title
                order={5}
                ta="center"
                bg="var(--mantine-color-appCyanLight-0)"
                p="md"
              >
                P1 - Total:{' '}
                {results
                  .filter((r) => r.player === 'P1')
                  .reduce((sum, r) => sum + r.points, 0)}
              </Title>
              <Title
                order={5}
                ta="center"
                bg="var(--mantine-color-appPinkLight-0)"
                p="md"
              >
                P2 - Total:{' '}
                {results
                  .filter((r) => r.player === 'P2')
                  .reduce((sum, r) => sum + r.points, 0)}
              </Title>
            </Group>

            <Table withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Player</Table.Th>
                  <Table.Th>Card</Table.Th>
                  <Table.Th>Running Total</Table.Th>
                  <Table.Th>Points</Table.Th>
                  <Table.Th>Reason</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {results.map((play, i) => (
                  <Table.Tr
                    key={i}
                    bg={
                      play.player === 'P1'
                        ? 'var(--mantine-color-appCyanLight-0)'
                        : 'var(--mantine-color-appPinkLight-0)'
                    }
                  >
                    <Table.Td>{play.player}</Table.Td>
                    <Table.Td>
                      {play.card ? (
                        <FormatCard
                          rank={play.card.rank}
                          suit={play.card.suit}
                          iconSize={20}
                        />
                      ) : (
                        '—'
                      )}
                    </Table.Td>
                    <Table.Td>{play.runningTotal}</Table.Td>
                    <Table.Td>{play.points}</Table.Td>
                    <Table.Td>{play.reason}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </React.Fragment>
        )}
      </Stack>
    </PageContainer>
  );
};
