import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';
import { Group, Text } from '@mantine/core';

export const showError = (message: string) => {
  notifications.show({
    message: (
      <Group align="center">
        <IconExclamationCircle color="red" />
        <Text>{message}</Text>
      </Group>
    ),
    color: 'red',
    autoClose: 5000,
    withCloseButton: true,
    position: 'top-center'
  });
};
