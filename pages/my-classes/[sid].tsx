import { useQuery } from '@apollo/react-hooks';
import { Box, LinearProgress } from '@material-ui/core';
import React from 'react';
import AccountNavs from '../../client/components/account-navs';
import CancelModal from '../../client/components/my-classes/cancel-modal';
import EnrollmentItem from '../../client/components/my-classes/enrollment-item';
import RescheduleModal from '../../client/components/my-classes/reschedule-modal';
import NextMUILink from '../../client/components/next-mui-link';
import PreflightCheck from '../../client/components/preflight-check';
import StudentCard from '../../client/components/user-info/student-card';
import { Registration } from '../../client/graphql/data-models';
import {
  StudentRegistrationsQuery,
  StudentRegistrationsResult
} from '../../client/graphql/user-queries';
import { CLASSES } from '../../shared/constants';
import { IDVars } from '../../types';

export default function MyClassesPage(props: { sid: string }) {
  const [toCancel, setCancel] = React.useState<Registration>(null);
  const [toReschedule, setReschedule] = React.useState<Registration>(null);

  const result = useQuery<StudentRegistrationsResult, IDVars>(
    StudentRegistrationsQuery,
    {
      fetchPolicy: 'cache-and-network',
      variables: { id: props.sid }
    }
  );

  if (result.error) {
    return <PreflightCheck error={result.error} />;
  }

  if (!result.data || !result.data.student) {
    return (
      <AccountNavs>
        <LinearProgress />
      </AccountNavs>
    );
  }

  const { student } = result.data;

  return (
    <AccountNavs>
      <StudentCard student={student} />

      {toCancel && (
        <CancelModal
          registration={toCancel}
          onClose={() => setCancel(null)}
          refetchQuery={{
            query: StudentRegistrationsQuery,
            variables: { id: student.id }
          }}
        />
      )}
      {toReschedule && (
        <RescheduleModal
          registration={toReschedule}
          studentId={student.id}
          onClose={() => setReschedule(null)}
        />
      )}
      {student.registrations.length === 0 ? (
        <Box
          p={4}
          my={4}
          textAlign="center"
          borderRadius={4}
          border="1px dashed #ddd"
        >
          <NextMUILink next={{ href: { pathname: '/', hash: CLASSES } }}>
            Enroll <strong>{student.name}</strong> today!
          </NextMUILink>
        </Box>
      ) : (
        student.registrations.map(registration => (
          <EnrollmentItem
            key={registration.id}
            student={student}
            registration={registration}
            onClickCancel={() => {
              setReschedule(null);
              setCancel(registration);
            }}
            onClickReschedule={() => {
              setCancel(null);
              setReschedule(registration);
            }}
          />
        ))
      )}
    </AccountNavs>
  );
}
