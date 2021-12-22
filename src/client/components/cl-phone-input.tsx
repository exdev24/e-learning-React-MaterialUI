import { FormGroup, InputAdornment, TextField } from '@material-ui/core';
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumberFromString
} from 'libphonenumber-js/mobile';
import React from 'react';
import { countryList } from '../../shared/countries';
import { User } from '../graphql/data-models';

type FormProps = {
  name: string;
  countryCode: CountryCode;
  phoneNumber: string;
  onChange: (countryCode: CountryCode, phoneNumber: string) => void;
  errors?: { [name: string]: any };
};

export const defaultCountryCode: CountryCode = 'US';

export function getPhoneDefaults(user?: User) {
  let code: CountryCode;
  let phoneNumber = '';

  if (user && user.phoneNumber) {
    const data = parsePhoneNumberFromString(user.phoneNumber, defaultCountryCode);
    if (data && data.isValid) {
      code = data.country;
      phoneNumber = data.formatNational();
    }
  }

  return {
    countryCode: code || defaultCountryCode,
    phoneNumber
  };
}

export function CLPhoneInput(props: FormProps) {
  const asYouType = React.useMemo(() => new AsYouType(props.countryCode), [
    props.countryCode
  ]);

  const countries = React.useMemo(
    () =>
      countryList.sort((c1, c2) => c1.countryNameEn.localeCompare(c2.countryNameEn)),
    []
  );

  let error = false;
  let helperText = '';

  if (props.errors && props.errors[props.name]) {
    error = true;
    helperText = props.errors[props.name];
  }

  return (
    <FormGroup>
      <TextField
        margin="dense"
        fullWidth
        label="Country"
        value={props.countryCode}
        select
        SelectProps={{ native: true }}
        onChange={evt => {
          props.onChange(evt.target.value as CountryCode, '');
        }}
      >
        {countries.map(country => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.countryNameEn} {country.flag}
          </option>
        ))}
      </TextField>
      <TextField
        fullWidth
        margin="dense"
        type="tel"
        label="Phone Number"
        error={error}
        value={props.phoneNumber}
        helperText={helperText}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              (+{getCountryCallingCode(props.countryCode)})
            </InputAdornment>
          )
        }}
        onChange={evt => {
          asYouType.reset();
          props.onChange(props.countryCode, asYouType.input(evt.target.value));
        }}
      />
    </FormGroup>
  );
}
