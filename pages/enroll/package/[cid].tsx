import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import EnrollPackage from '../../../client/components/checkout/enroll-package';
import ContainerWrapper from '../../../client/components/container-wrapper';
import Layout from '../../../client/components/layout';
import PreflightCheck from '../../../client/components/preflight-check';
import { CheckoutProvider } from '../../../client/context/checkout';
import {
  GetUserWithClassQuery,
  GetUserWithClassResponse
} from '../../../client/graphql/enrollment-queries';
import { IDVars } from '../../../types';

export default function CheckoutPage(props: { cid: string }) {
  const queryResult = useQuery<GetUserWithClassResponse, IDVars>(
    GetUserWithClassQuery,
    {
      variables: { id: props.cid },
      fetchPolicy: 'network-only',
      ssr: false
    }
  );

  if (!queryResult.data) {
    return (
      <PreflightCheck loading={queryResult.loading} error={queryResult.error} />
    );
  }

  const { user, klass } = queryResult.data;

  return (
    <Layout title={klass.course.subject.name} noIndex>
      <ContainerWrapper>
        <CheckoutProvider wholePackage user={user} klass={klass}>
          <EnrollPackage user={user} klass={klass} />
        </CheckoutProvider>
      </ContainerWrapper>
    </Layout>
  );
}
