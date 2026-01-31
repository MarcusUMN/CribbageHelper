import { Select, Stack, ActionIcon, Group, Tooltip, Grid } from '@mantine/core';
import {
  IconSpadeFilled,
  IconHeartFilled,
  IconDiamondFilled,
  IconClubsFilled
} from '@tabler/icons-react';
import { Card, Rank, RANKS, Suit } from '../../cribbage';

const rankOptions: { value: Rank; label: string }[] = RANKS.map((r) => ({
  value: r,
  label: r
}));

const suitOptions = [
  { value: 'H', label: 'Hearts', icon: <IconHeartFilled size={14} /> },
  { value: 'S', label: 'Spades', icon: <IconSpadeFilled size={14} /> },
  { value: 'D', label: 'Diamonds', icon: <IconDiamondFilled size={14} /> },
  { value: 'C', label: 'Clubs', icon: <IconClubsFilled size={14} /> }
];

type CardSelectorProps = {
  value: Card | null;
  onChange: (card: Card | null) => void;
  variant?: 'row' | 'grid';
  label?: string;
};

export const CardSelector = ({
  value,
  onChange,
  variant = 'row',
  label
}: CardSelectorProps) => {
  const handleRankChange = (rank: string | null) => {
    if (!rank) return onChange(null);
    const castRank = rank as Rank;
    onChange({ rank: castRank, suit: value?.suit ?? 'S' });
  };

  const handleSuitChange = (suit: string) => {
    const castSuit = suit as Suit;
    onChange({ rank: value?.rank ?? 'A', suit: castSuit });
  };

  return (
    <Stack>
      {variant === 'row' ? (
        <Group align="flex-end">
          <Select
            {...(label ? { label } : {})}
            data={rankOptions}
            value={value?.rank ?? null}
            onChange={handleRankChange}
            w={80}
          />
          {suitOptions.map(({ value: val, label, icon }) => (
            <Tooltip key={val} label={label} withArrow>
              <ActionIcon
                variant={value?.suit === val ? 'filled' : 'outline'}
                color={val === 'H' || val === 'D' ? 'red' : 'black'}
                onClick={() => handleSuitChange(val)}
                size="lg"
                aria-label={label}
              >
                {icon}
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      ) : (
        <Group align="flex-end">
          <Select
            {...(label ? { label } : {})}
            data={rankOptions}
            value={value?.rank ?? null}
            onChange={handleRankChange}
            w={80}
            styles={{
              label: {
                textAlign: 'center',
                width: '100%',
                transform: 'translateY(-10px)'
              }
            }}
          />
          <Grid style={{ width: 70 }} gutter={4}>
            {suitOptions.map(({ value: val, label, icon }) => (
              <Grid.Col span={6} key={val}>
                <Tooltip label={label} withArrow>
                  <ActionIcon
                    variant={value?.suit === val ? 'filled' : 'outline'}
                    color={val === 'H' || val === 'D' ? 'red' : 'black'}
                    onClick={() => handleSuitChange(val)}
                    size="lg"
                    aria-label={label}
                  >
                    {icon}
                  </ActionIcon>
                </Tooltip>
              </Grid.Col>
            ))}
          </Grid>
        </Group>
      )}
    </Stack>
  );
};
