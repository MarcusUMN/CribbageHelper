import React, { useState, useEffect } from 'react';
import {
  Group,
  Button,
  ActionIcon,
  Text,
  Stack,
  TextInput,
  Title,
  Modal,
  ScrollArea,
  Box
} from '@mantine/core';
import {
  IconUsers,
  IconPlus,
  IconTrash,
  IconRefresh,
  IconListDetails,
  IconRotateDot
} from '@tabler/icons-react';
import { DEFAULT_PLAYERS, PLAYER_COLOR_SWATCHES } from '../gameDefaults';
import { Player, LogEntry } from '../types';

interface ConfigToolbarProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onReset: () => void;
  scoreLog: LogEntry[];
}

export const ConfigToolbar = ({
  players,
  setPlayers,
  onReset,
  scoreLog
}: ConfigToolbarProps) => {
  const [playerModalOpened, setPlayerModalOpened] = useState(false);
  const [logModalOpened, setLogModalOpened] = useState(false);
  const [resetModalOpened, setResetModalOpened] = useState(false);
  const [localPlayers, setLocalPlayers] = useState<Player[]>(players);

  useEffect(() => {
    if (playerModalOpened) setLocalPlayers(players);
  }, [playerModalOpened, players]);

  const handlePlayerModalClose = () => {
    setPlayers(localPlayers);
    setPlayerModalOpened(false);
  };

  const handleResetConfirm = () => {
    onReset();
    setResetModalOpened(false);
  };

  const updateLocalPlayer = (id: string, obj: Partial<Player>) => {
    setLocalPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...obj } : p))
    );
  };

  return (
    <React.Fragment>
      <Group>
        <Button
          size="xs"
          leftSection={<IconUsers size={16} />}
          onClick={() => setPlayerModalOpened(true)}
        >
          Manage Players
        </Button>
        <Button
          size="xs"
          leftSection={<IconListDetails size={16} />}
          onClick={() => setLogModalOpened(true)}
        >
          Score Log
        </Button>
        <Button
          size="xs"
          leftSection={<IconRefresh size={16} />}
          onClick={() => setResetModalOpened(true)}
        >
          New Game
        </Button>
      </Group>
      <Modal
        opened={resetModalOpened}
        onClose={() => setResetModalOpened(false)}
        title={<Title order={4}>Reset Match?</Title>}
        centered
        size="sm"
      >
        <Stack>
          <Text size="sm">
            This clears all scores and history. Player names and colors will
            stay.
          </Text>
          <Group grow mt="md">
            <Button
              variant="default"
              onClick={() => setResetModalOpened(false)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleResetConfirm}>
              Reset Board
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={playerModalOpened}
        onClose={handlePlayerModalClose}
        title={<Title order={4}>Manage Players</Title>}
        centered
      >
        <Stack>
          {localPlayers.map((p, i) => (
            <Group key={p.id} align="flex-end" wrap="nowrap">
              <TextInput
                label={`Player ${i + 1}`}
                variant="filled"
                value={p.name}
                flex="1"
                onChange={(e) =>
                  updateLocalPlayer(p.id, {
                    name: e.target.value.toUpperCase()
                  })
                }
              />
              <Group gap={6} wrap="nowrap">
                {PLAYER_COLOR_SWATCHES.map((swatchColor) => {
                  const isSelected = p.color === swatchColor;

                  return (
                    <ActionIcon
                      key={swatchColor}
                      size={isSelected ? 'lg' : 'md'}
                      radius="xl"
                      onClick={() =>
                        updateLocalPlayer(p.id, { color: swatchColor })
                      }
                      style={{
                        backgroundColor: swatchColor,
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        border: isSelected
                          ? '2px solid #228be6'
                          : '1px solid rgba(0,0,0,0.1)',
                        boxShadow: isSelected
                          ? '0 0 0 2px white inset, 0 2px 8px rgba(0,0,0,0.2)'
                          : 'none'
                      }}
                    ></ActionIcon>
                  );
                })}
              </Group>
              <ActionIcon
                color="red"
                variant="subtle"
                size="lg"
                onClick={() =>
                  setLocalPlayers((prev) => prev.filter((pl) => pl.id !== p.id))
                }
                disabled={localPlayers.length <= 2}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Group>
          ))}

          <Group grow>
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              disabled={localPlayers.length >= 4}
              onClick={() => {
                setLocalPlayers((prev) => [
                  ...prev,
                  {
                    id: `P${Date.now()}`,
                    name: `PLAYER ${prev.length + 1}`,
                    color: '#adb5bd',
                    score: 0
                  }
                ]);
              }}
            >
              Add Player
            </Button>
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconRotateDot size={14} />}
              onClick={() => setLocalPlayers(DEFAULT_PLAYERS)}
            >
              Reset Defaults
            </Button>
          </Group>
          <Button
            fullWidth
            color="dark"
            mt="md"
            onClick={handlePlayerModalClose}
          >
            Done
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={logModalOpened}
        onClose={() => setLogModalOpened(false)}
        title={<Title order={4}>Score Log</Title>}
        centered
      >
        <ScrollArea h={400} type="auto">
          <Stack gap={0}>
            {scoreLog.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No points recorded.
              </Text>
            )}
            {[...scoreLog].reverse().map((log, i) => (
              <Group
                key={i}
                justify="space-between"
                p="xs"
                style={{ borderBottom: '1px solid #f1f3f5' }}
              >
                <Group gap="xs">
                  <Box
                    w={8}
                    h={8}
                    style={{ borderRadius: '50%', backgroundColor: log.color }}
                  />
                  <Text fw={600} size="sm">
                    {log.name}
                  </Text>
                </Group>
                <Group gap="xl">
                  <Text
                    size="sm"
                    c={log.points >= 0 ? 'green.7' : 'red.7'}
                    fw={700}
                  >
                    {log.points > 0 ? `+${log.points}` : log.points}
                  </Text>
                  <Text size="xs" c="dimmed" w={50} ta="right">
                    Total: {log.total}
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </ScrollArea>
      </Modal>
    </React.Fragment>
  );
};
