import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Topic } from 'common';
import React from 'react';
import { Student } from '../../graphql/data-models';
import { GetUserWithClassResponse } from '../../graphql/enrollment-queries';
import { isKidOldEnough } from '../../lib/class-time-helper';
import CLButton from '../button';
import AddStudentForm from '../user-info/add-student-form';

interface Props extends GetUserWithClassResponse {
  isSubmitting?: boolean;
  selected: Student | null;
  selectStudent: (student: Student) => void;
  handleStudentAdded: (student: Student) => void;
  handleStudentConfirmed: () => void;
}

export default function ConfirmStudent({
  klass,
  user,
  isSubmitting,
  selected,
  selectStudent,
  handleStudentAdded,
  handleStudentConfirmed
}: Props) {
  let disabled = klass.isFull;
  let tooYoung = false;

  if (selected) {
    tooYoung = !isKidOldEnough(klass.course, selected);
  }

  if (tooYoung && klass.course.subjectId === Topic.SN && klass.course.level <= 1) {
    disabled = true;
  }

  return (
    <>
      <FormLabel>Who is taking this class?</FormLabel>
      <RadioGroup
        value={selected ? selected.id : ''}
        onChange={evt =>
          selectStudent(user.children.find(child => child.id === evt.target.value))
        }
      >
        {user.children.map(child =>
          klass.studentIds.includes(child.id) ? (
            <FormControlLabel
              key={child.id}
              value={child.id}
              control={<Radio />}
              disabled
              label={`${child.name} (Enrolled)`}
            />
          ) : (
            <FormControlLabel
              key={child.id}
              value={child.id}
              control={<Radio />}
              label={child.name}
            />
          )
        )}
        <FormControlLabel value="" control={<Radio />} label="Add a student" />
      </RadioGroup>
      {selected ? (
        <Box mt={3} display="flex" justifyContent="flex-end">
          {tooYoung && (
            <Alert color="info">
              {`This class is best for child grades ${klass.course.grades.join(
                ' - '
              )}.`}
            </Alert>
          )}
          <CLButton
            type="button"
            color="primary"
            variant="contained"
            onClick={handleStudentConfirmed}
            className="next_btn"
            disabled={disabled}
            loading={isSubmitting}
          >
            {klass.isFull ? 'Class is Full' : 'Next'}
          </CLButton>
        </Box>
      ) : (
        <AddStudentForm
          onCompleted={data => handleStudentAdded(data.student)}
          submitLabel="Next"
        />
      )}
    </>
  );
}
