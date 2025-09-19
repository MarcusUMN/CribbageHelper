import React from 'react';
import { Button, Group, Text, Title } from '@mantine/core';
import { IconDice4Filled } from '@tabler/icons-react';

type HeaderSectionProps = {
  title: string;
  description?: string;
  label?: string;
  onRandom?: () => void;
  randomButtonLabel?: string;
};

export const HeaderSection = ({ title, description, label, onRandom, randomButtonLabel = 'Random Hand' }: HeaderSectionProps) => {
  return (
    <React.Fragment>
      <Title order={2}>{title}</Title>
      {description && (
        <Text size="sm" c="dimmed" mt="xs" mb="sm">
          {description}
        </Text>
      )}
      <Group mb="md" justify="space-between">
        {label && <Text fw={500}>{label}</Text>}
        {onRandom && (
          <Button onClick={onRandom} rightSection={<IconDice4Filled size={14} />}>
           {randomButtonLabel}
          </Button>
        )}
      </Group>
    </React.Fragment>
  );
};
