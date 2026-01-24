import { Link } from "react-router";
import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  Image,
  Grid,
} from "@mantine/core";

const features = [
  "Score hands quickly and accurately",
  "Analyze all discard options for optimal play",
  "Visualize scoring by cut card",
  "Learn cribbage strategies with real examples",
];

export const Home = () => {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl" align="center">
        <Title order={1} ta="center">
          Welcome to{" "}
          <Title component="span" c="black" fw={1000}>
            CRIBBAGE NINJA
          </Title>
        </Title>

        <Text size="lg" ta="center">
          Learn, practice, and analyze cribbage. Use our tools to score hands,
          explore strategies, and become a stronger player.
        </Text>

        <Grid gutter="xl" align="center" style={{ width: "100%" }}>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 1 }}>
            <Stack gap="md" align="stretch">
              <Title order={3} ta="center">
                Explore Tools
              </Title>
              <Button component={Link} to="/hand-calculator" fullWidth>
                Hand Calculator
              </Button>
              <Button component={Link} to="/hand-optimizer" fullWidth>
                Hand Optimizer
              </Button>
              <Button component={Link} to="/cut-probabilities" fullWidth>
                Cut Probabilities
              </Button>

              <Stack gap="sm" align="center" mt="md">
                <Title order={4}>Features</Title>
                <Grid gutter="sm">
                  {features.map((feature, idx) => (
                    <Grid.Col key={idx} span={{ base: 12, sm: 6 }}>
                      <Text size="md">✔ {feature}</Text>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 3, md: 2 }}>
            <Image
              src="/cribbage-board.png"
              alt="Cribbage board"
              mx="auto"
              style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};
