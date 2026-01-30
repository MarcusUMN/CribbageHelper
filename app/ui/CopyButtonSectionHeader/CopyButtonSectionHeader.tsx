import { Button, Tooltip, CopyButton, Group, Title } from '@mantine/core';
import { IconShare } from '@tabler/icons-react';

type CopyButtonSectionHeaderProps = {
  title: React.ReactNode;
};

export const CopyButtonSectionHeader = ({
  title
}: CopyButtonSectionHeaderProps) => {
  const getUrl = () =>
    typeof window !== 'undefined' ? window.location.href : '';

  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleAction = async (copy: () => void) => {
    const url = getUrl();
    if (!url) return;

    if (canShare) {
      try {
        await navigator.share({ url });
        return;
      } catch {}
    }

    copy();
  };

  return (
    <Group justify="space-between" align="center">
      <Title order={3}>{title}</Title>

      <CopyButton value={getUrl()} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? 'Link copied!' : 'Share link'}
            withArrow
            position="top"
          >
            <Button
              size="sm"
              variant="light"
              color={copied ? 'teal' : 'blue'}
              leftSection={<IconShare size={16} />}
              onClick={() => handleAction(copy)}
            >
              {copied ? 'Copied' : 'Share'}
            </Button>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};
