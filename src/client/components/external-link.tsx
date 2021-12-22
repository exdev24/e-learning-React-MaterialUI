import React from 'react';
import { Link } from '@material-ui/core';
import { LinkProps } from '@material-ui/core/Link';

export default function ExternalLink({ children, ...linkProps }: LinkProps) {
  return (
    <Link target="_blank" rel="noopener noreferrer" {...linkProps}>
      {children}
    </Link>
  );
}
