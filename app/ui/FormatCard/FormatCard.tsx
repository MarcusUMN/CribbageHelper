import React from 'react';
import {
  IconSpadeFilled,
  IconHeartFilled,
  IconDiamondFilled,
  IconClubsFilled
} from '@tabler/icons-react';
import { Group, Text, TextProps } from '@mantine/core';
import { Suit } from '../../cribbage';

type FormatCardProps = {
  rank: string;
  suit: Suit;
  iconSize?: number;
  textProps?: TextProps;
};

export const FormatCard: React.FC<FormatCardProps> = ({
  rank,
  suit,
  iconSize = 14,
  textProps
}) => {
  const iconProps = { size: iconSize };

  const suitIcon = {
    H: <IconHeartFilled {...iconProps} color="red" />,
    D: <IconDiamondFilled {...iconProps} color="red" />,
    S: <IconSpadeFilled {...iconProps} color="black" />,
    C: <IconClubsFilled {...iconProps} color="black" />
  }[suit];

  return (
    <Group wrap="nowrap" align="center" justify="space-between">
      <Text size="sm" {...textProps}>
        {rank}
      </Text>
      {suitIcon}
    </Group>
  );
};
