import { Button, Text, Stack } from '@mantine/core';

type ComputeButtonBlockProps = {
  onClick: () => void;
  disabledButton?: boolean;
  showStaleMessage?: boolean;
  label?: string;
  disabledLabel?: string;
};

export const ComputeButtonBlock = ({
  onClick,
  disabledButton,
  showStaleMessage,
  label,
  disabledLabel
}: ComputeButtonBlockProps) => {
  return (
    <Stack>
      <Button onClick={onClick} fullWidth disabled={disabledButton}>
        {disabledButton ? disabledLabel : label}
      </Button>
      {showStaleMessage && (
        <Text size="xs" c="dimmed">
          Previous results are shown. Press{' '}
          <Text component="span" c="black" fw={700}>
            {label}
          </Text>{' '}
          to update.
        </Text>
      )}
    </Stack>
  );
};
