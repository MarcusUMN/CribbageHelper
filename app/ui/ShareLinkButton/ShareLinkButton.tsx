'use client';
import { useEffect, useState } from 'react';
import { Button, Tooltip, CopyButton } from '@mantine/core';
import { IconShare, IconCheck, IconCopy } from '@tabler/icons-react';

type ShareLinkButtonProps = {
  title?: string;
  message?: string;
};

export const ShareLinkButton = ({
  title = 'Check this out!',
  message = '',
}: ShareLinkButtonProps) => {
  const [isClient, setIsClient] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setIsClient(true);
    setUrl(window.location.href);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({ title, text: message, url });
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  if (!isClient) return null;

  return canShare ? (
    <Button
      size="sm"
      variant="light"
      color="blue"
      leftSection={<IconShare size={16} />}
      onClick={handleShare}
    >
      Share
    </Button>
  ) : (
    <CopyButton value={url} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Link copied!' : 'Copy to share'} withArrow position="top">
          <Button
            size="sm"
            variant="light"
            color={copied ? 'teal' : 'blue'}
            leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            onClick={copy}
          >
            {copied ? 'Ready to Share' : 'Copy Link'}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
};
