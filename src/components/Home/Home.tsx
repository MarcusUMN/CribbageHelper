import Link from 'next/link';
import { Container, Title, Text, Image, Stack, Group, Button } from '@mantine/core';
import classes from './Home.module.css';

export function Home() {
  return (
    <Container size="md" py="xl">
      <Title order={1} ta="center"  className={classes.title}>
        Welcome to <span className={classes.highlight}>CRIBBAGE NINJA</span>
      </Title>
      <Text size="lg" ta="center" className={classes.subtitle}>
        This site helps you learn, practice, and analyze cribbage. Use our tools to score hands,
        explore strategies, and become a stronger player.
      </Text>
      <div className={classes.containerFlex}>
        <div className={classes.leftColumn}>
          <Stack mb={'lg'}>
            <Stack align="center">
              <Title order={3}>Explore Our Cribbage Tools</Title>
              <Group >
                <Button component={Link} href="/hand-calculator" fullWidth>
                  Hand Calculator
                </Button>
                <Button component={Link} href="/hand-optimizer" fullWidth>
                  Hand Optimizer
                </Button>
                <Button component={Link} href="/cut-probabilities" fullWidth>
                  Cut Probabilities
                </Button>
              </Group>
            </Stack>
            <Stack maw={600}>
              <Title order={3}>Features</Title>
              <Text>✔ Score hands quickly and accurately</Text>
              <Text>✔ Analyze all discard options for optimal play</Text>
              <Text>✔ Visualize scoring by cut card</Text>
              <Text>✔ Learn cribbage strategies with real examples</Text>
            </Stack>
          </Stack>
        </div>
        <div className={classes.rightColumn}>
          <Image
            src="/cribbage-board.png"
            alt="Cribbage cards and board"
            className={classes.image}
          />
        </div>
      </div>
    </Container>
  );
}
