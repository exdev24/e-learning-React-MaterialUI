import { Container, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Layout from '../client/components/layout';

export default function SixCricketsPage() {
  return (
    <Layout>
      <Container maxWidth="md" style={{ marginTop: '10vh' }}>
        <Paper style={{ padding: 32 }}>
          <Typography variant="body1" component="article">
            <p>Dear Parent,</p>
            <p>We received your registration through 6crickets!</p>
            <p>
              After you register, please expect an email 1 day before the event to
              get all the information you need to attend the class. Meanwhile, if you
              have any questions, you can email us on{' '}
              <u>cnl_6crickets@create-learn.us</u>.
            </p>
            <p>We look forward to seeing your child in the class. Thanks!</p>
            <p>The Create & Learn Team</p>
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
}
