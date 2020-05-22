import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../client/components/layout';
import NextMUIButton from '../client/components/next-mui-button';
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
          <NextMUIButton
            color="secondary"
            variant="contained"
            size="small"
            next={{
              href: {
                pathname: routeIds.signup,
                query: router.query
              }
            }}
          >
            {t('cta.signup_alt')}
          </NextMUIButton>
        </Box>
        <UserLogin signup={false} />
      </Container>
    </Layout>
  );
}
