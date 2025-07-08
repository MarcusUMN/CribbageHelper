import { Select, Stack, ActionIcon, Group, Tooltip, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Card } from '../../../utils/deck';

const rankOptions = [
  'A', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'J', 'Q', 'K',
].map((r) => ({ value: r, label: r }));

const suitOptions = [
  { value: 'S', label: 'Spades', icon: '♠' },
  { value: 'H', label: 'Hearts', icon: '♥' },
  { value: 'D', label: 'Diamonds', icon: '♦' },
  { value: 'C', label: 'Clubs', icon: '♣' },
];

type Props = {
  value: Card | null;
  onChange: (card: Card | null) => void;
};

export const CardSelector = ({ value, onChange }: Props) => {
  const [rank, setRank] = useState<string | null>(value?.rank ?? null);
  const [suit, setSuit] = useState<string | null>(value?.suit ?? null);

  useEffect(() => {
    if (rank && suit) {
      onChange({ rank, suit } as Card);
    } else {
      onChange(null);
    }
  }, [rank, suit]);

  return (
    <Stack gap="xs">
      <Group align="flex-end">
        <Select
          data={rankOptions}
          value={rank}
          onChange={setRank}
          style={{ width: 80 }}
        />
        <div>
          <Group >
            {suitOptions.map(({ value: val, label, icon }) => (
              <Tooltip key={val} label={label} withArrow>
                <ActionIcon
                  variant={suit === val ? 'filled' : 'outline'}
                  color={val === 'H' || val === 'D' ? 'red' : 'black'}
                  onClick={() => setSuit(val)}
                  size="lg"
                  aria-label={label}
                >
                  <span style={{ fontSize: 20 }}>{icon}</span>
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </div>
      </Group>
    </Stack>
  );
};
