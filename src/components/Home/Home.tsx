import { Container, Title, Text, Image, Stack } from '@mantine/core';
import classes from './Home.module.css';

export function Home() {
  return (
    <Container size="md" py="xl">
      <Stack align="center">
        <Title order={1} className={classes.title}>
          Welcome to <span className={classes.highlight}>CRIBBAGE NINJA</span>
        </Title>

        <Text size="lg" ta="center" className={classes.subtitle}>
          This site helps you learn, practice, and analyze cribbage. 
          Use our tools to score hands, explore strategies, and become a stronger player.
        </Text>

        <Image src="/cribbage-board.png" alt="Cribbage cards and board" className={classes.image} />
      </Stack>
    </Container>
  );
}
