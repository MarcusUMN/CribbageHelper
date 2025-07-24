import React, { useState } from 'react';
import {
  Button,
  Modal,
  Checkbox,
  Stack,
  Group,
  Text,
  Box,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { StatKey } from '../../../SharedTable'

type Props = {
  visibleStats: Set<StatKey>;
  onToggleStat: (key: StatKey) => void;
  stats: {label: string; key: StatKey;}[]
};

export const Toolbar = ({ stats, visibleStats, onToggleStat }: Props) => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <React.Fragment>
      <Group justify="space-between" align="center" wrap="nowrap" mt="md" mb="md">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" c="dimmed">
            Shows all possible 2-card discards from your 6-card hand
            with their expected scoring outcomes.
          </Text>
        </Box>

        <Button
          onClick={() => setModalOpened(true)}
          leftSection={<IconSettings size={16} />}
          variant="outline"
        >
          Configure View
        </Button>
      </Group>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600}>Customize View</Text>}
        centered
        size="md"
      >
        <Stack gap="sm">
          <div>
            <Text fw={600} size="sm" mb={4}>
              Show/Hide Columns
            </Text>
            <Text size="xs" c="dimmed" mb="xs">
              Toggle which score stats are visible in the table.
            </Text>
            <Stack gap="xs">
              {stats.map(({ label, key }) => (
                <Checkbox
                  key={key}
                  label={`Show ${label}`}
                  checked={visibleStats.has(key  as StatKey)}
                  onChange={() => onToggleStat(key  as StatKey)}
                />
              ))}
            </Stack>
          </div>
        </Stack>
      </Modal>
    </React.Fragment>
  );
};
