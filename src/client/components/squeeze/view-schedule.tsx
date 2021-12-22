import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import React from 'react';
import { IDVars } from '../../../types';
import { GetCourseQuery, GetCourseQueryResult } from '../../graphql/catalog-queries';
import MainSection from '../main-section';
import PostEnrollmentShare from '../post-enrollment-share';
import PreflightCheck from '../preflight-check';
import SelectTrial from './select-trial';

export default function ViewSchedule(props: { cid: string }) {
  const [classConfirmed, setConfirmation] = React.useState(false);

  const courseResult = useQuery<GetCourseQueryResult, IDVars>(GetCourseQuery, {
    variables: { id: props.cid }
  });

  if (!courseResult.data || !courseResult.data.course) {
    return (
      <PreflightCheck loading={courseResult.loading} error={courseResult.error} />
    );
  }

  const { course } = courseResult.data;

  if (classConfirmed) {
    return (
      <MainSection
        maxWidth="md"
        header={
          <Typography variant="h4">Your {course.name} Class is Confirmed</Typography>
        }
      >
        <PostEnrollmentShare course={course} />
      </MainSection>
    );
  }

  return (
    <SelectTrial
      course={course}
      onAccountCreated={() => {
        setConfirmation(true);
      }}
    />
  );
}
