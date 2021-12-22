import { Box, Container, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../client/components/layout';
import NextMUILink from '../client/components/next-mui-link';
import UserLogin from '../client/components/user-login';
import { routeIds } from '../shared/constants';
import { useTranslation } from '../shared/i18n';

export default function Signup() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout title={t('cta.signup')}>
      <Container maxWidth="sm">
        <Box my={3} textAlign="right">
          <Typography variant="subtitle2">
            {'Already have a Create & Learn Account? '}
            <NextMUILink
              color="secondary"
              title="Sign In"
              next={{
                href: {
                  pathname: routeIds.signin,
                  query: router.query
                }
              }}
            >
              {t('cta.signin')}
            </NextMUILink>
          </Typography>
        </Box>
        <UserLogin signup={true} />
      </Container>
    </Layout>
  );
}
