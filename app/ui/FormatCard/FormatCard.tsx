import React from "react";
import {
  IconSpadeFilled,
  IconHeartFilled,
  IconDiamondFilled,
  IconClubsFilled,
} from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import { Suit } from "../../cribbage";

type FormatCardProps = {
  rank: string;
  suit: Suit;
  iconSize?: number;
};

export const FormatCard: React.FC<FormatCardProps> = ({
  rank,
  suit,
  iconSize = 14,
}) => {
  const iconProps = { size: iconSize };

  const suitIcon = {
    H: <IconHeartFilled {...iconProps} color="red" />,
    D: <IconDiamondFilled {...iconProps} color="red" />,
    S: <IconSpadeFilled {...iconProps} color="black" />,
    C: <IconClubsFilled {...iconProps} color="black" />,
  }[suit];

  return (
    <Group gap={4} wrap="nowrap" align="center">
      <Text size="sm">{rank}</Text>
      {suitIcon}
    </Group>
  );
};
