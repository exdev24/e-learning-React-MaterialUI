import { useQuery } from '@apollo/react-hooks';
import { Topic, topicRoutes } from 'common';
import React from 'react';
import Layout from '../../client/components/layout';
import PreflightCheck from '../../client/components/preflight-check';
import SubjectDetails from '../../client/components/subject-details';
import {
  GetSubjectQuery,
  GetSubjectQueryResult
} from '../../client/graphql/catalog-queries';
import { logPageView } from '../../client/lib/analytics';
import { IDVars } from '../../types';

export default function TopicPage(props: { id: Topic; level?: string }) {
  React.useEffect(
    () =>
      logPageView('SubjectClassListing', {
        subject: props.id
      }),
    [props.id]
  );

  const { data, loading, error } = useQuery<GetSubjectQueryResult, IDVars>(
    GetSubjectQuery,
    {
      variables: { id: props.id }
    }
  );

  if (!data || !data.subject) {
    return <PreflightCheck loading={loading} error={error} />;
  }

  return (
    <Layout
      title={data.subject.name}
      pathname={topicRoutes[data.subject.id]}
      description={data.subject.headline}
      image={data.subject.thumbnail}
    >
      <SubjectDetails subject={data.subject} />;
    </Layout>
  );
}
