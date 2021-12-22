import { LinearProgress } from '@material-ui/core';
import { captureException } from '@sentry/browser';
import NextError from 'next/error';
import React from 'react';

interface Props {
  statusCode?: number;
  loading?: boolean;
  error?: Error;
}

export default function PreflightCheck(props: Props) {
  React.useEffect(() => {
    if (props.error) {
      captureException(props.error);
      if (process.env.NODE_ENV !== 'production') {
        console.error(props.error); //eslint-disable-line
      }
    }
  }, [props.error]);

  if (props.statusCode || props.error) {
    return <NextError statusCode={props.statusCode || 500} />;
  }

  return props.loading ? <LinearProgress /> : null;
}
