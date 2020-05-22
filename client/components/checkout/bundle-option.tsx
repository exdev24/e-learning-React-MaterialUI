import {
  Checkbox,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { ClassWithCourse } from '../../graphql/data-models';
import ClassInfoSchedules from '../class-info/class-info-schedules';

interface Props {
  klass: ClassWithCourse;
  checked: boolean;
  onChange: (klass: ClassWithCourse, checked: boolean) => void;
}

function BundleOption(props: Props) {
  return (
    <ExpansionPanel square>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
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
            </>
          }
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: 'block' }}>
        <Typography color="textSecondary" gutterBottom>
          {props.klass.course.description}
        </Typography>
        <ClassInfoSchedules schedules={props.klass.schedules} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default React.memo(BundleOption);
