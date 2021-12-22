import {
  Dialog,
  IconButton,
  withMobileDialog,
  WithMobileDialog
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const formUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSeTz42EhcD5l_rl2GWLHVZZ87Ltrq-sZYQpB0XwV7jCXkzB6Q/viewform?embedded=true';

function TrialSurvey(props: Props & WithMobileDialog) {
  return (
    <Dialog
      open={props.open}
      scroll="body"
      fullScreen={props.fullScreen}
      onClose={props.onClose}
    >
      <IconButton
        onClick={props.onClose}
        style={{ position: 'absolute', right: 16, top: 8 }}
      >
        <Close />
      </IconButton>
      <iframe
        src={formUrl}
        frameBorder="0"
        style={{
          width: 640,
          maxWidth: '100%',
          height: props.fullScreen ? '100%' : '70vh',
          marginTop: 40
        }}
      />
    </Dialog>
  );
}

export default withMobileDialog<Props>({ breakpoint: 'sm' })(TrialSurvey);
