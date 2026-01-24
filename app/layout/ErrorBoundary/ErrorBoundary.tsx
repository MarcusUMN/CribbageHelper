import { useState, useEffect } from "react";
import { Button, Container, Title, Text, Stack } from "@mantine/core";
import { Link } from "react-router";

export const ErrorBoundary = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Container size="sm" pt="xl" ta="center">
      <Stack gap="md">
        <Title order={1}>Oops!</Title>
        <Text size="lg">The page you are looking for no longer exists.</Text>
        <Button
          component={Link}
          to="/"
          variant="default"
          bg=" var(--mantine-color-appMintTeal-0)"
        >
          Go Home
        </Button>
      </Stack>
    </Container>
  );
};
