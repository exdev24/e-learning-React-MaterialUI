import {
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import React from 'react';
import { ChildWithEnrollStats } from '../../graphql/enrollment-queries';

interface Props {
  value: string;
  students: ChildWithEnrollStats[];
  onChange: (val: ChildWithEnrollStats | null) => void;
}

function SelectStudent(props: Props) {
  return (
    <Box mt={4}>
      <FormLabel>Who is taking this class?</FormLabel>
      <RadioGroup
        value={props.value}
        onChange={evt =>
          props.onChange(
            evt.target.value
              ? props.students.find(s => s.id === evt.target.value)
              : null
          )
        }
      >
        {props.students.map(student =>
          student.enrollStats.hasEnrolled ? (
            <FormControlLabel
              key={student.id}
              value={student.id}
              control={<Radio />}
              disabled
              label={`${student.name} (Enrolled)`}
            />
          ) : (
            <FormControlLabel
              key={student.id}
              value={student.id}
              control={<Radio />}
              label={student.name}
            />
          )
        )}
        <FormControlLabel value="" control={<Radio />} label="Add a student" />
      </RadioGroup>
    </Box>
  );
}

export default React.memo(SelectStudent);
