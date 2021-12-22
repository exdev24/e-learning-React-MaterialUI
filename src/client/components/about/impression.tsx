import { Box, Button, DialogContent } from '@material-ui/core';
import { PlayCircleFilled } from '@material-ui/icons';
import React from 'react';
import { logEvent } from '../../lib/analytics';
import EmbedVideo from '../embed-video';
import ModalWrapper from '../modal-wrapper';

export default function Impression() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box my={1} textAlign="center">
      <Button
        startIcon={<PlayCircleFilled />}
        disabled={isOpen}
        color="inherit"
        onClick={() => {
          setIsOpen(true);
          logEvent('ViewContent', {
            variant: 'Impression Video'
          });
        }}
      >
        Watch the Video
      </Button>
      <ModalWrapper
        title="Create to Learn, Create to Lead"
        fullWidth
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogContent style={{ padding: 0 }}>
          <EmbedVideo src="https://www.youtube.com/embed/LygU_bXX9zg" />
        </DialogContent>
      </ModalWrapper>
    </Box>
  );
}
