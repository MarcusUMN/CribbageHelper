import { ReactNode } from "react";
import { Group, Text, Title } from "@mantine/core";
import classes from "./PageContainer.module.css";

type PageContainerProps = {
  title: string;
  description?: string;
  label?: string;
  headerRight?: ReactNode;
  children: ReactNode;
};

export const PageContainer = ({
  title,
  description,
  label,
  headerRight,
  children,
}: PageContainerProps) => {
  return (
    <div className={classes.wrapper}>
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
    </div>
  );
};
