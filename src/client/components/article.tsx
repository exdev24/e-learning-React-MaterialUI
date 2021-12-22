import { Box, Typography } from '@material-ui/core';
import React from 'react';
import ContainerWrapper from './container-wrapper';

export default function Article(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ContainerWrapper>
      <Typography variant="h4" align="center">
        {props.title}
      </Typography>
      <Box component="article" my={4}>
        {props.children}
      </Box>
    </ContainerWrapper>
  );
}
