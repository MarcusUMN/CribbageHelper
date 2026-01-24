import { ReactNode } from "react";
import { Group, Text, Title, Box } from "@mantine/core";

type PageContainerProps = {
  title: string;
  description?: string;
  label?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  maxPageWidth?: string;
};

export const PageContainer = ({
  title,
  description,
  label,
  headerRight,
  children,
  maxPageWidth = "400px",
}: PageContainerProps) => {
  return (
    <Box pb="16px" maw={maxPageWidth} m="2rem auto">
      <Title order={2}>{title}</Title>

      {description && (
        <Text size="sm" c="dimmed" mt="xs" mb="sm">
          {description}
        </Text>
      )}

      {(label || headerRight) && (
        <Group mb="md" justify="space-between">
          {label && <Text fw={500}>{label}</Text>}
          {headerRight && headerRight}
        </Group>
      )}

      {children}
    </Box>
  );
};
