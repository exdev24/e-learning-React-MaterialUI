import { useQuery } from '@apollo/react-hooks';
import { Topic } from 'cl-common';
import React from 'react';
import PreflightCheck from '../../client/components/preflight-check';
import SubjectDetailsScratch from '../../client/components/subject-details-scratch';
import {
  GetSubjectQuery,
  GetSubjectQueryResult
} from '../../client/graphql/catalog-queries';
import { logPageView } from '../../client/lib/analytics';
import { IDVars } from '../../types';

export default function Scratch2Page() {
  React.useEffect(
    () =>
      logPageView('SubjectClassListing', {
        subject: Topic.SN
      }),
    []
  );

  const { data, loading, error } = useQuery<GetSubjectQueryResult, IDVars>(
    GetSubjectQuery,
    {
      variables: { id: Topic.SN }
    }
  );

  if (!data || !data.subject) {
    return <PreflightCheck loading={loading} error={error} />;
  }

  return <SubjectDetailsScratch subject={data.subject} />;
}
