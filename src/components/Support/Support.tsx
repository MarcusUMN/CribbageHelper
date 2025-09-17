import { Container, Text } from '@mantine/core';
import classes from './Support.module.css';

export function Support() {
  return (
    <Container size="md" py="xl" className={classes.wrapper}>
       <Text size="md" ta="center">
        Your support helps keep these cribbage tools up-to-date, so you can continue
        improving your game and enjoying new features. Thank you for being part of the community!
      </Text>
    </Container>
  );
}
