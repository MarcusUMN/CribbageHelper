import { Text, Container, Group, Button } from '@mantine/core';

export const Footer = () => {
  return (
    <Container>
      <Group justify="center">
        <Text size="sm" c="dimmed" inline>
          Want to support the site?
        </Text>
        <Button
          component="a"
          href="https://ko-fi.com/cribbageninja"
          target="_blank"
          size="sm"
          variant="outline"
          color="blue"
        >
          Buy me a coffee ☕
        </Button>
      </Group>
    </Container>
  );
};
