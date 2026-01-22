import { notifications } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons-react';

export const showError = (message: string) => {
  notifications.show({
     message: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconExclamationCircle color='#FA5252' />
        <span>{message}</span>
      </div>
    ),
    color: 'red',
    autoClose: 5000,
    withCloseButton: true,
    position: 'top-center',
  });
};
