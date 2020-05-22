import { useQuery } from '@apollo/react-hooks';
import { Topic } from 'common';
import React from 'react';
import EnrollClass from '../../../client/components/checkout/enroll-class';
import EnrollTrial from '../../../client/components/checkout/enroll-trial';
import EnrollWebinar from '../../../client/components/checkout/enroll-webinar';
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

  let flow: React.ReactNode = null;

  if (klass.course.price > 0) {
    flow = <EnrollClass user={user} klass={klass} />;
  } else if (klass.course.subjectId === Topic.WEBINARS) {
    flow = <EnrollWebinar user={user} klass={klass} />;
  } else {
    flow = <EnrollTrial user={user} klass={klass} />;
  }

  return (
    <Layout title={klass.course.name} noIndex>
      <ContainerWrapper>
        <CheckoutProvider user={user} klass={klass}>
          {flow}
        </CheckoutProvider>
      </ContainerWrapper>
    </Layout>
  );
}
