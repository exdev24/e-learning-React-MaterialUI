import {
  Dialog,
  DialogProps,
  DialogTitle,
  IconButton,
  Typography,
  withMobileDialog
} from '@material-ui/core';
import { blue, pink } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';
import React from 'react';

interface ModalWrapperProps extends DialogProps {
  title?: string;
  onClose: () => void;
}

function ModalWrapper({
  title,
  onClose,
  children,
  ...dialogProps
}: ModalWrapperProps) {
  return (
    <Dialog {...dialogProps} onClose={onClose}>
      <IconButton
        onClick={onClose}
        style={{ position: 'absolute', right: 16, top: 8, zIndex: 1 }}
      >
        <Close />
      </IconButton>
      {title && (
        <DialogTitle
          disableTypography
          style={{
            color: pink.A700,
            position: 'relative',
            borderBottom: `3px solid ${blue.A400}`
          }}
        >
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </DialogTitle>
      )}
      {children}
    </Dialog>
  );
}

export default withMobileDialog<ModalWrapperProps>({ breakpoint: 'sm' })(
  ModalWrapper
);
