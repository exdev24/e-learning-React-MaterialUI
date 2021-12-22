import { StandardTextFieldProps } from '@material-ui/core/TextField';

interface FieldProps extends StandardTextFieldProps {
  name: string;
}

export const emailProps: FieldProps = {
  name: 'email',
  type: 'email',
  label: 'Enter your email'
};

export const passwordProps: FieldProps = {
  name: 'password',
  type: 'password',
  label: 'Create a password',
  inputProps: {
    minLength: 6,
    maxLength: 64,
    placeholder: 'At least 6 characters long'
  }
};

export const nameProps: FieldProps = {
  name: 'name',
  label: 'Your name'
};

export const childNameProps: FieldProps = {
  name: 'childName',
  label: 'Child Name'
};

export const birthYearProps: FieldProps = {
  name: 'year',
  label: 'Year of birth',
  type: 'number',
  inputProps: {
    placeholder: 'yyyy',
    min: 1970,
    max: new Date().getFullYear() - 6
  }
};
