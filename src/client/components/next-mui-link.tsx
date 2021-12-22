import MUILink, { LinkProps as MUILinkProps } from '@material-ui/core/Link';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

interface Props extends MUILinkProps {
  next: NextLinkProps;
}

export default function NextMUILink({ next, ...linkProps }: Props) {
  return (
    <NextLink passHref {...next}>
      <MUILink {...linkProps} />
    </NextLink>
  );
}
