import { Alert } from '@material-ui/lab';
import React from 'react';
import { AlertComponentPropsWithStyle } from 'react-alert';

export default function AlertTemplate(props: AlertComponentPropsWithStyle) {
  return (
    <Alert
      style={props.style}
      onClose={props.close}
      severity={props.options.type}
      variant="filled"
    >
      {props.message}
    </Alert>
  );
}
