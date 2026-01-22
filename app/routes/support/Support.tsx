import { Container, Text, Paper } from "@mantine/core";

export function Support() {
  return (
    <Container size="md" py="xl">
      <Paper
        withBorder
        shadow="sm"
        radius="md"
        p="xl"
        style={{ textAlign: "center", backgroundColor: "#f7f9f9" }}
      >
        <Text size="lg" fw={500}>
          Your support helps keep these cribbage tools up-to-date, so you can
          continue improving your game and enjoying new features.
        </Text>
        <Text size="md" mt="sm">
          Thank you for being part of the community!
        </Text>
      </Paper>
    </Container>
  );
}
