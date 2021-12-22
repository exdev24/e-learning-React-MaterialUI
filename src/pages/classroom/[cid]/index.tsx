import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import ClassroomContainer from '../../../client/components/classroom/container';
import Layout from '../../../client/components/layout';
import PreflightCheck from '../../../client/components/preflight-check';
import { GetClassroomQuery } from '../../../client/graphql/classroom-queries';
import { Classroom } from '../../../client/graphql/data-models';
import { IDVars } from '../../../types';

export default function ClassroomPage(props: { cid: string }) {
  const result = useQuery<{ classroom: Classroom }, IDVars>(GetClassroomQuery, {
    pollInterval: 5 * 60 * 1000,
    variables: {
      id: props.cid
    },
    onError() {
      result.stopPolling();
    }
  });

  if (!result.data) {
    return <PreflightCheck loading={result.loading} error={result.error} />;
  }

  if (!result.data.classroom) {
    return <PreflightCheck statusCode={404} />;
  }

  return (
    <Layout title="Classroom" noIndex>
      <ClassroomContainer {...result.data.classroom} />
    </Layout>
  );
}
