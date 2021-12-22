import { Typography } from '@material-ui/core';
import React from 'react';
import Layout from './layout';
import { HeadProps } from './layout/html-head';
import MainSection from './main-section';

interface Props extends HeadProps {
  title: string;
  subtitle: string;
  hero?: React.ReactNode;
  article: string;
}

export default function PressRelease({
  title,
  subtitle,
  hero,
  article,
  ...headProps
}: Props) {
  return (
    <Layout title={title} {...headProps}>
      <MainSection
        header={
          <>
            <Typography variant="h5" color="textPrimary">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {subtitle}
            </Typography>
          </>
        }
      >
        {hero}
        <Typography
          variant="body1"
          component="article"
          dangerouslySetInnerHTML={{ __html: article }}
        />
      </MainSection>
    </Layout>
  );
}
