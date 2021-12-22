import { Container, Typography } from '@material-ui/core';
import React from 'react';
import Layout from '../../client/components/layout';
import NextMUIButton from '../../client/components/next-mui-button';
import { CLASSES } from '../../shared/constants';

export default function OptOutPage() {
  return (
    <Layout>
      <Container>
        <img
          src="https://cdn.create-learn.us/webinars/open-class-banner.png"
          alt="Open Class"
        />

        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5" style={{ margin: '48px 0' }}>
            {"You won't be automatically enrolled for future open classes anymore."}
          </Typography>
          <NextMUIButton
            color="primary"
            variant="contained"
            size="large"
            next={{ href: { pathname: '/', hash: CLASSES } }}
          >
            Explore More Classes
          </NextMUIButton>
        </div>
      </Container>
    </Layout>
  );
}
