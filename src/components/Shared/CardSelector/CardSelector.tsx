import { Select, Stack, ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconSpadeFilled, IconHeartFilled, IconDiamondFilled, IconClubsFilled } from '@tabler/icons-react';
import { Card, Rank, RANKS, Suit } from '../../../utils';

const rankOptions: { value: Rank; label: string }[] = RANKS.map((r) => ({
  value: r,
  label: r,
}));

const suitOptions = [
  { value: 'H', label: 'Hearts', icon: <IconHeartFilled size={14} /> },
  { value: 'S', label: 'Spades', icon: <IconSpadeFilled size={14} /> },
  { value: 'D', label: 'Diamonds', icon: <IconDiamondFilled size={14} /> },
  { value: 'C', label: 'Clubs', icon: <IconClubsFilled size={14} /> },
];

type Props = {
  value: Card | null;
  onChange: (card: Card | null) => void;
};

export const CardSelector = ({ value, onChange }: Props) => {
 const handleRankChange = (rank: string | null) => {
    if (!rank) return onChange(null);
    const castRank = rank as Rank;
    if (value?.suit) onChange({ rank: castRank, suit: value.suit });
    else onChange({ rank: castRank, suit: 'S' }); 
  };

  const handleSuitChange = (suit: string) => {
    const castSuit = suit as Suit;
    if (value?.rank) onChange({ rank: value.rank, suit: castSuit });
    else onChange({ rank: 'A', suit: castSuit });
  };

  return (
    <Stack gap="xs">
      <Group align="flex-end">
        <Select
          data={rankOptions}
          value={value?.rank ?? null}
          onChange={handleRankChange}
          style={{ width: 80 }}
        />
        <Group>
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
      </Group>
    </Stack>
  );
};
