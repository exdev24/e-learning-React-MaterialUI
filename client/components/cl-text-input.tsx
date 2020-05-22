import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import React from 'react';

type FormProps = TextFieldProps & {
  name: string;
  errors?: { [name: string]: any };
};

export default function CLTextInput({ name, errors, ...inputProps }: FormProps) {
  if (!inputProps.value) {
    inputProps.value = '';
  }

  const error = errors && errors[name];
  if (error) {
    inputProps.error = true;
    if (typeof error === 'string') {
      inputProps.helperText = error;
    }
  }

  return <TextField fullWidth margin="dense" {...inputProps} name={name} />;
}
