import { Box, Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../client/components/layout';
import NextMUIButton from '../client/components/next-mui-button';
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
          <NextMUIButton
            next={{
              href: {
                pathname: routeIds.signin,
                query: router.query
              }
            }}
            size="small"
            variant="contained"
            color="secondary"
          >
            {t('cta.signin_alt')}
          </NextMUIButton>
        </Box>
        <UserLogin signup={true} />
      </Container>
    </Layout>
  );
}
