import React from 'react';
import { NumberInput, Select, Group, Box, Text } from '@mantine/core';

const operators = [
  { label: '<', value: '<' },
  { label: '<=', value: '<=' },
  { label: '=', value: '=' },
  { label: '>=', value: '>=' },
  { label: '>', value: '>' }
];

type Props = {
  threshold: number;
  onThresholdChange: (value: number) => void;
  operator: string;
  onOperatorChange: (value: string) => void;
};

export const Toolbar = ({
  threshold,
  onThresholdChange,
  operator,
  onOperatorChange
}: Props) => {
  return (
    <Group mt="md" mb="md" align="center">
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" c="dimmed">
          Show discard score probabilities by operator and threshold.
        </Text>
      </Box>
      <Select
        data={operators}
        value={operator}
        onChange={(val) => val && onOperatorChange(val)}
        styles={{ input: { width: 100 } }}
      />
      <NumberInput
        min={-53}
        max={53}
        value={threshold}
        onChange={(val) => typeof val === 'number' && onThresholdChange(val)}
        styles={{ input: { width: 100 } }}
      />
    </Group>
  );
};
