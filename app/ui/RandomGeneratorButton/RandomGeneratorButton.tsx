import { Button } from '@mantine/core';
import { IconDice4Filled } from '@tabler/icons-react';

type RandomGeneratorButtonProps = {
  onClick: () => void;
  label?: string;
};

export const RandomGeneratorButton = ({
  onClick,
  label = 'Random Hand'
}: RandomGeneratorButtonProps) => {
  return (
    <Button onClick={onClick} rightSection={<IconDice4Filled size={14} />}>
      {label}
    </Button>
  );
};
