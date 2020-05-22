import { Button, CircularProgress } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';

type Props = ButtonProps & {
  loading: boolean;
};

export default function CLButton({ children, loading, ...btnProps }: Props) {
  if (!btnProps.type) {
    btnProps.type = 'submit';
  }

  if (btnProps.disabled || loading) {
    btnProps.onClick = evt => {
      evt.preventDefault();
    };
  }

  return (
    <Button {...btnProps}>
      &nbsp;
      {loading ? (
        <CircularProgress color="inherit" size={16} thickness={4} />
      ) : (
        children
      )}
      &nbsp;
    </Button>
  );
}
