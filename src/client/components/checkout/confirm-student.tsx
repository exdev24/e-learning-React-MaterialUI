import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { CheckoutContext } from '../../context/checkout';
import {
  ChildWithEnrollStats,
  GetUserWithClassResponse
} from '../../graphql/enrollment-queries';
import { isAgeEnforced, isOldEnough } from '../../lib/checkout-helper';
import { getTopicLink } from '../../lib/url-utils';
import CLButton from '../cl-button';
import NextMUILink from '../next-mui-link';
import AddStudentForm from '../user-info/add-student-form';
import SelectStudent from './select-student';

interface Props extends GetUserWithClassResponse {
  loading?: boolean;
  onConfirmed: (s: ChildWithEnrollStats) => void;
}

export default function ConfirmStudent(props: Props) {
  const { student, selectStudent } = React.useContext(CheckoutContext);

  if (props.klass.seats <= 0) {
    return (
      <Alert color="warning">
        <strong>{props.klass.course.name}</strong> is fully booked,&nbsp;
        <NextMUILink
          color="secondary"
          next={getTopicLink(props.klass.course.subjectId, {
            courseId: props.klass.courseId
          })}
          title="pick a different schedule"
        >
          pick a different schedule
        </NextMUILink>
        .
      </Alert>
    );
  }

  if (!student) {
    return (
      <>
        <SelectStudent
          value=""
          students={props.user.children}
          onChange={selectStudent}
        />
        <AddStudentForm
          submitLabel="Next"
          onCompleted={data => {
            const s = {
              ...data.student,
              enrollStats: {
                id: data.student.id,
                hasEnrolled: false,
                historical: [],
                futureTrials: 0,
                attendedTrials: 0
              }
            };

            selectStudent(s);
            props.onConfirmed(s);
          }}
        />
      </>
    );
  }

  let warning: React.ReactNode = null;
  let disabled = false;

  if (student.enrollStats.historical.includes(props.klass.courseId)) {
    warning = (
      <Alert color="info">
        {'Are you interested in taking the '}
        <strong>{props.klass.course.name}</strong>
        {
          ' class again? We cover very similar content in these classes. If your child is interested in learning more, please sign up for the next level of the class, or try out one of our other free classes'
        }
      </Alert>
    );
  } else if (!isOldEnough(props.klass.course, student)) {
    warning = (
      <Alert color="warning">
        This class is best for child grades {props.klass.course.grades.join('-')}.
      </Alert>
    );

    if (isAgeEnforced(props.klass.course)) {
      disabled = true;
    }
  } else if (props.user.children.length > 1 && props.klass.seats === 1) {
    warning = (
      <Alert color="info">
        Last seat available. Choose another schedule if you have one more child to
        enroll.
      </Alert>
    );
  }

  return (
    <>
      {warning && <Box mt={3}>{warning}</Box>}
      <SelectStudent
        value={student.id}
        students={props.user.children}
        onChange={selectStudent}
      />
      <Box mt={3} display="flex" justifyContent="flex-end">
        <CLButton
          type="button"
          color="primary"
          variant="contained"
          className="enroll_next"
          onClick={() => props.onConfirmed(student)}
          disabled={disabled}
          loading={props.loading}
        >
          Next
        </CLButton>
      </Box>
    </>
  );
}
