import { Container, ContainerProps, useTheme } from '@material-ui/core';
import React from 'react';

interface Props extends ContainerProps {
  header?: React.ReactNode;
  stripe?: boolean;
}

export default function MainSection({
  children,
  stripe,
  header,
  className,
  id,
  ...props
}: Props) {
  const theme = useTheme();

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  };

  if (stripe) {
    wrapperStyle.backgroundColor = theme.palette.grey[50];
  }

  return (
    <section id={id} className={className} style={wrapperStyle}>
      {header && (
        <Container
          maxWidth="md"
          style={{
            textAlign: 'center',
            paddingBottom: theme.spacing(6)
          }}
        >
          {header}
        </Container>
      )}
      <Container {...props}>{children}</Container>
    </section>
  );
}
