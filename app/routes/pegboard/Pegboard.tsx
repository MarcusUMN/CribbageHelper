import { useState } from 'react';
import {
  Stack,
  Group,
  Paper,
  Text,
  SimpleGrid,
  ActionIcon,
  Box,
  Button,
  Divider,
  Badge
} from '@mantine/core';
import {
  IconX,
  IconMinus,
  IconHistory,
  IconCalculator,
  IconLayoutBoard,
  IconTarget
} from '@tabler/icons-react';
import { PageContainer } from '../../ui/PageContainer';
import { CribbageBoard } from '../../ui/CribbageBoard';
import { ConfigToolbar } from './ConfigToolbar';
import { DEFAULT_PLAYERS } from './gameDefaults';
import { Player, LogEntry } from './types';

export const Pegboard = () => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [pendingPoints, setPendingPoints] = useState<number>(0);
  const [history, setHistory] = useState<Player[][]>([]);
  const [scoreLog, setScoreLog] = useState<LogEntry[]>([]);

  const winningPlayer = players.find((p) => p.score >= 121);

  const addPoints = (playerId: string) => {
    if (pendingPoints === 0 || winningPlayer) return;

    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const newScore = Math.min(Math.max(player.score + pendingPoints, 0), 121);

    setScoreLog((prev) => [
      ...prev,
      {
        name: player.name,
        points: pendingPoints,
        total: newScore,
        color: player.color
      }
    ]);

    setHistory((h) => [...h, [...players]]);
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, score: newScore } : p))
    );
    setPendingPoints(0);
  };

  const undoLast = () => {
    if (history.length === 0) return;
    setPlayers(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setScoreLog((s) => s.slice(0, -1));
  };

  const handleResetMatch = () => {
    setPlayers((p) => p.map((player) => ({ ...player, score: 0 })));
    setHistory([]);
    setScoreLog([]);
    setPendingPoints(0);
  };

  return (
    <PageContainer
      title="Cribbage Pegboard"
      description="A digital cribbage board and score tracker for 2, 3, or 4 players."
    >
      <Stack gap="xl">
        <ConfigToolbar
          players={players}
          setPlayers={setPlayers}
          onReset={handleResetMatch}
          scoreLog={scoreLog}
        />

        <Box>
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <IconLayoutBoard size={18} style={{ opacity: 0.6 }} />
              <Text fw={800} size="sm" tt="uppercase" lts={1.5} c="dimmed">
                Scoreboard
              </Text>
            </Group>
            <Badge
              variant="outline"
              color="gray"
              leftSection={<IconTarget size={12} />}
              styles={{ label: { textTransform: 'none', fontWeight: 700 } }}
            >
              Play to 121
            </Badge>
          </Group>
          <CribbageBoard players={players} />
        </Box>
        <Box>
          <Group gap="xs" mb="xs">
            <IconCalculator size={18} style={{ opacity: 0.6 }} />
            <Text fw={800} size="sm" tt="uppercase" lts={1.5} c="dimmed">
              Point Entry
            </Text>
          </Group>
          <Paper
            p="md"
            withBorder
            radius="md"
            bg="#fdfaf5"
            shadow="sm"
            w="100%"
          >
            <Stack>
              <SimpleGrid cols={players.length}>
                {players.map((p) => (
                  <Stack key={p.id} gap={0} align="center">
                    <Text size="xs" fw={700} c="dimmed" lts={1} tt="uppercase">
                      {p.name}
                    </Text>
                    <Text
                      size="34px"
                      ff="monospace"
                      fw={900}
                      c={p.color}
                      style={{ lineHeight: 1 }}
                    >
                      {p.score}
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
              <Divider />
              <Group justify="space-between" w="100%" wrap="nowrap">
                <Stack align="center" gap={0} style={{ minWidth: 60 }}>
                  <Text size="8px" fw={800} c="dimmed" tt="uppercase">
                    Tally
                  </Text>
                  <Text
                    size="32px"
                    ff="monospace"
                    fw={700}
                    c={pendingPoints < 0 ? 'red' : 'dark'}
                  >
                    {pendingPoints > 0 ? `+${pendingPoints}` : pendingPoints}
                  </Text>
                </Stack>

                <Group gap={4} wrap="nowrap">
                  <SimpleGrid cols={5} spacing={4}>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 14].map((v) => (
                      <Button
                        key={v}
                        variant="subtle"
                        color="gray"
                        size="xs"
                        onClick={() =>
                          setPendingPoints((p) => Math.min(p + v, 29))
                        }
                      >
                        {v}
                      </Button>
                    ))}
                  </SimpleGrid>
                  <Stack gap={4}>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => setPendingPoints((p) => p * -1)}
                      disabled={pendingPoints === 0}
                    >
                      <IconMinus size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="gray"
                      size="sm"
                      onClick={() => setPendingPoints(0)}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </Stack>
                </Group>
              </Group>
              <Group grow>
                {players.map((p) => (
                  <Button
                    key={p.id}
                    color={p.color}
                    size="md"
                    onClick={() => addPoints(p.id)}
                    disabled={pendingPoints === 0 || !!winningPlayer}
                    variant={pendingPoints === 0 ? 'light' : 'filled'}
                  >
                    {p.name}
                  </Button>
                ))}
              </Group>

              <Button
                variant="subtle"
                color="gray"
                size="compact-xs"
                leftSection={<IconHistory size={14} />}
                onClick={undoLast}
                disabled={history.length === 0}
              >
                Undo Last Entry
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </PageContainer>
  );
};
