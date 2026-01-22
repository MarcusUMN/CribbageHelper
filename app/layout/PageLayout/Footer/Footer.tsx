import { Text, Container, Group, Button, Stack } from "@mantine/core";

export const Footer = () => {
  return (
    <Container>
      <Stack align="center">
        <Group>
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
      </Stack>
    </Container>
  );
};
