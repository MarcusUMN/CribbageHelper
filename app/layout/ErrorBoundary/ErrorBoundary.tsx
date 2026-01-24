import { Button, Container, Title, Text, Stack } from "@mantine/core";
import { Link } from "react-router";

export const ErrorBoundary = () => {
  return (
    <Container size="sm" pt="xl" style={{ textAlign: "center" }}>
      <Stack gap="md">
        <Title order={1}>Oops!</Title>
        <Text size="lg">The page you are looking for no longer exists.</Text>
        <Button component={Link} to="/" variant="filled" color="teal">
          Go Home
        </Button>
      </Stack>
    </Container>
  );
};
