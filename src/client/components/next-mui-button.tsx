import Button, { ButtonProps } from '@material-ui/core/Button';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

interface Props extends ButtonProps {
  next: NextLinkProps;
}

export default function NextMUILink({ next, ...buttonProps }: Props) {
  return (
    <NextLink passHref {...next}>
      <Button {...buttonProps} />
    </NextLink>
  );
}
