import React, { useState } from "react";
import { Button, Stack, Select, Title, Group, Table } from "@mantine/core";
import { CardSelector } from "../../ui/CardSelector";
import { FormatCard } from "../../ui/FormatCard";
import { PageContainer } from "../../ui/PageContainer";
import { RandomGeneratorButton } from "../../ui/RandomGeneratorButton";
import { errorLogic } from "../../ui/ErrorNotifications";
import { Card } from "../../cribbage";
import {
  calculatePeggingSequenceFromHands,
  generateLegalPeggingHands,
} from "../../cribbage";

export const PeggingCalculator = () => {
  const [starter, setStarter] = useState<"P1" | "P2">("P1");
  const [p1Plays, setP1Plays] = useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [p2Plays, setP2Plays] = useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [results, setResults] = useState<any[] | null>(null);

  const handleCardChange = (
    player: "P1" | "P2",
    idx: number,
    card: Card | null,
  ) => {
    if (player === "P1") {
      const next = [...p1Plays];
      next[idx] = card;
      setP1Plays(next);
    } else {
      const next = [...p2Plays];
      next[idx] = card;
      setP2Plays(next);
    }
    setResults(null);
  };

  const handleSubmit = () => {
    if (!errorLogic.validatePlayableSequence(starter, p1Plays, p2Plays)) return;
    const pegging = calculatePeggingSequenceFromHands({
      starter,
      p1Plays,
      p2Plays,
    });

    setResults(
      pegging.map((p, idx) => ({
        ...p,
        idx,
        reason: p.reasons.join(", "),
      })),
    );
  };

  return (
    <PageContainer
      title="Pegging Calculator"
      description="Enter the pegging sequence after a hand to verify scoring."
      label="Starting Player"
      headerRight={
        <RandomGeneratorButton
          label="Generate Random Sequence"
          onClick={() => {
            const { p1, p2 } = generateLegalPeggingHands();
            setP1Plays(p1);
            setP2Plays(p2);
            setResults(null);
          }}
        />
      }
    >
      <Select
        label="Who played first?"
        value={starter}
        onChange={(val) => setStarter(val as "P1" | "P2")}
        data={[
          { value: "P1", label: "Player 1" },
          { value: "P2", label: "Player 2" },
        ]}
        mb="lg"
      />
      <Group align="flex-start" grow>
        <Stack>
          <Title order={5} ta="center" bg="var(--mantine-color-appCyanLight-0)">
            Player 1
          </Title>
          <Group>
            {p1Plays.map((card, idx) => (
              <CardSelector
                key={idx}
                value={card}
                onChange={(c) => handleCardChange("P1", idx, c)}
                variant="grid"
                label={`Card #${idx + 1}`}
              />
            ))}
          </Group>
        </Stack>
        <Stack>
          <Title order={5} ta="center" bg="var(--mantine-color-appPinkLight-0)">
            Player 2
          </Title>
          <Group>
            {p2Plays.map((card, idx) => (
              <CardSelector
                key={idx}
                value={card}
                onChange={(c) => handleCardChange("P2", idx, c)}
                variant="grid"
                label={`Card #${idx + 1}`}
              />
            ))}
          </Group>
        </Stack>
      </Group>

      <Button fullWidth mt="lg" onClick={handleSubmit}>
        Calculate Pegging
      </Button>

      {results && (
        <React.Fragment>
          <Title order={4} mt="lg" mb="sm">
            Pegging Sequence
          </Title>
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
                    play.player === "P1"
                      ? "var(--mantine-color-appCyanLight-0)"
                      : "var(--mantine-color-appPinkLight-0)"
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
                      "—"
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
    </PageContainer>
  );
};
