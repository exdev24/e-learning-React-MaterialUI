import { useQuery } from '@apollo/react-hooks';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import React from 'react';
import {
  SubjectListQuery,
  SubjectListQueryResult
} from '../../graphql/catalog-queries';

interface InputProps extends Omit<StandardTextFieldProps, 'onChange'> {
  onChange: (subjectId: string) => void;
}

export default function SubjectSelector({ onChange, ...inputProps }: InputProps) {
  const result = useQuery<SubjectListQueryResult>(SubjectListQuery);
  const subjects = (result.data && result.data.subjects) || [];

  return (
    <TextField
      {...inputProps}
      select
      SelectProps={{ native: true }}
      onChange={evt => onChange(evt.target.value)}
      disabled={subjects.length === 0}
    >
      <option value="" disabled={inputProps.required} />
      {subjects.map(subject => (
        <option key={subject.id} value={subject.id}>
          {subject.name}
        </option>
      ))}
    </TextField>
  );
}
