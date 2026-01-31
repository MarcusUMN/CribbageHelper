import { ReactNode } from 'react';
import { Group, Text, Title, Stack } from '@mantine/core';

type PageContainerProps = {
  title: string;
  titleRight?: ReactNode;
  description?: string;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  children: ReactNode;
  maxPageWidth?: string;
};

export const PageContainer = ({
  title,
  titleRight,
  description,
  bottomLeft,
  bottomRight,
  children,
  maxPageWidth = '400px'
}: PageContainerProps) => {
  return (
    <Stack pb="16px" maw={maxPageWidth} m="2rem auto">
      <Group>
        <Title order={2}>{title}</Title>
        {titleRight}
      </Group>

      {description && (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      )}

      {(bottomLeft || bottomRight) && (
        <Group justify="space-between">
          {bottomLeft &&
            (typeof bottomLeft === 'string' ? (
              <Text fw={500}>{bottomLeft}</Text>
            ) : (
              bottomLeft
            ))}
          {bottomRight}
        </Group>
      )}
      {children}
    </Stack>
  );
};
