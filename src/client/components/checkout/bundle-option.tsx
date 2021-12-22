import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { ClassWithCourse, Student } from '../../graphql/data-models';
import { isOldEnough } from '../../lib/checkout-helper';
import ClassInfoSchedules from '../class-info/class-info-schedules';

interface Props {
  klass: ClassWithCourse;
  checked: boolean;
  onChange: (klass: ClassWithCourse, checked: boolean) => void;
  student?: Student;
}

export default function BundleOption(props: Props) {
  let tooYoung = false;
  if (props.student && props.student.age) {
    tooYoung = !isOldEnough(props.klass.course, props.student);
  }

  return (
    <Accordion square>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <FormControlLabel
          onClick={evt => evt.stopPropagation()}
          onFocus={evt => evt.stopPropagation()}
          control={
            <Checkbox
              checked={props.checked}
              onChange={(evt, checked) => {
                props.onChange(props.klass, checked);
              }}
            />
          }
          label={
            <>
              Add matching <strong>{props.klass.course.name}</strong>
              {DateTime.fromISO(props.klass.startDate).toFormat(", 'starting' D")}
              {tooYoung && (
                <em
                  style={{
                    color: 'red',
                    paddingLeft: '1em'
                  }}
                >
                  ( Best for child grades {props.klass.course.grades.join('-')} )
                </em>
              )}
            </>
          }
        />
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>
        <Typography color="textSecondary" gutterBottom>
          {props.klass.course.description}
        </Typography>
        <ClassInfoSchedules schedules={props.klass.schedules} />
      </AccordionDetails>
    </Accordion>
  );
}
