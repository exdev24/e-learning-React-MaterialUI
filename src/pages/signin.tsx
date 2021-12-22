import { Box, Container, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../client/components/layout';
import NextMUILink from '../client/components/next-mui-link';
import UserLogin from '../client/components/user-login';
import { routeIds } from '../shared/constants';
import { useTranslation } from '../shared/i18n';

export default function SignIn() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout title={t('cta.signin')}>
      <Container maxWidth="sm">
        <Box my={3} textAlign="right">
          <Typography variant="subtitle2">
            {'New to Create & Learn? '}
            <NextMUILink
              color="secondary"
              title="Sign Up"
              next={{
                href: {
                  pathname: routeIds.signup,
                  query: router.query
                }
              }}
            >
              {t('cta.signup_alt')}
            </NextMUILink>
          </Typography>
        </Box>
        <UserLogin signup={false} />
      </Container>
    </Layout>
  );
}
