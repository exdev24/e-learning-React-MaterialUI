import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import { DateTime } from 'luxon';
import React from 'react';
import { contactEmail } from '../../../shared/constants';
import { Registration } from '../../graphql/data-models';
import ModalWrapper from '../modal-wrapper';
import { RescheduleClass, RescheduleSession } from './reschedule-modal-content';

interface ModalProps {
  registration: Registration;
  studentId: string;
  onClose: () => void;
}

const all = 'all';

export default function RescheduleModal({
  registration,
  onClose,
  studentId
}: ModalProps) {
  const [classId, setClassId] = React.useState(registration.class.id);
  const [idx, setIdx] = React.useState<number>();
  const [preference, setPreference] = React.useState('');

  const modalProps = {
    title: `Reschedule ${registration.class.course.name}`,
    open: true,
    onClose
  };

  if (registration.class.course.price === 0 || idx === -1) {
    // reschedule entire class
    return (
      <ModalWrapper {...modalProps}>
        <RescheduleClass
          classId={classId}
          studentId={studentId}
          registration={registration}
          onClose={onClose}
          onSelected={(evt, checked) => {
            if (checked) {
              setClassId(evt.target.value);
            }
          }}
        />
      </ModalWrapper>
    );
  }

  if (idx >= 0) {
    // reschedule a session
    return (
      <ModalWrapper
        {...modalProps}
        title={`Reschedule ${registration.class.course.name} session ${idx + 1}`}
      >
        <RescheduleSession
          classId={classId}
          idx={idx}
          studentId={studentId}
          registration={registration}
          onClose={onClose}
          onSelected={(evt, checked) => {
            if (checked) {
              setClassId(evt.target.value);
            }
          }}
        />
      </ModalWrapper>
    );
  }

  const insideCutoff =
    DateTime.fromISO(registration.class.endDate).plus({ week: 1 }).toMillis() >
    Date.now();

  if (registration.seats.length > 1 && insideCutoff) {
    return (
      <ModalWrapper {...modalProps}>
        <DialogContent>
          <DialogContentText>
            Select the session you want to reschedule, or you can reschedule the
            entire class.
          </DialogContentText>
          <FormControl component="fieldset">
            <RadioGroup
              defaultValue={preference}
              onChange={(evt, value) => setPreference(value)}
            >
              <FormControlLabel
                value={all}
                control={<Radio />}
                label={
                  <Typography variant="subtitle1">
                    Reschedule Class&nbsp;
                    <small>(all {registration.seats.length} sessions)</small>
                  </Typography>
                }
              />
              {registration.seats.map(seat => {
                return (
                  <FormControlLabel
                    key={seat.id}
                    value={seat.idx.toString()}
                    disabled={seat.attended}
                    control={<Radio />}
                    label={
                      <Typography variant="subtitle1">
                        Session {seat.idx + 1}&nbsp;
                        <small>
                          ({DateTime.fromISO(seat.startDate).toFormat('ff')})
                        </small>
                      </Typography>
                    }
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            color="primary"
            variant="contained"
            disabled={!preference}
            onClick={() => {
              setIdx(preference === all ? -1 : parseInt(preference, 10));
            }}
          >
            Next
          </Button>
        </DialogActions>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper {...modalProps}>
      <DialogContent>
        <DialogContentText>
          Your <strong>{registration.class.course.name}</strong> has already ended,
          please contact us at {contactEmail} if you have any issue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </ModalWrapper>
  );
}
