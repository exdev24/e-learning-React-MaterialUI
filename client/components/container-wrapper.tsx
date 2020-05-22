import { Container } from '@material-ui/core';
import React from 'react';

export default function ContainerWrapper(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const { style, children, ...wrapperProps } = props;

  return (
    <div
      {...wrapperProps}
      style={{
        position: 'relative',
        paddingTop: 50,
        paddingBottom: 50,
        ...style
      }}
    >
      <Container>{children}</Container>
    </div>
  );
}
