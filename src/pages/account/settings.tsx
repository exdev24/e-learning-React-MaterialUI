import { useMutation } from '@apollo/react-hooks';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField
} from '@material-ui/core';
import { ApolloError } from 'apollo-client';
import { getTimezonesForCountry } from 'countries-and-timezones';
import React from 'react';
import { useAlert } from 'react-alert';
import AccountNavs from '../../client/components/account-navs';
import CLButton from '../../client/components/cl-button';
import {
  CLPhoneInput,
  getPhoneDefaults
} from '../../client/components/cl-phone-input';
import CLTextInput from '../../client/components/cl-text-input';
import { AccountContext } from '../../client/context/account';
import { transformGraphqlError } from '../../client/graphql/apollo';
import { EditProfileMutation } from '../../client/graphql/user-queries';
import { emailProps, passwordProps } from '../../client/lib/input-fields';
import { MutationArgs } from '../../types';

function getCountryTimezones(country: string) {
  return getTimezonesForCountry(country).filter(zone => !zone.aliasOf);
}

export default function AccountSettings() {
  const alert = useAlert();
  const { user, localZone } = React.useContext(AccountContext);

  const [password, setPassword] = React.useState('');
  const [previous, setPrevious] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [email, setEmail] = React.useState(user?.email);
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [referralCode, setReferralCode] = React.useState(user?.referralCode);

  const [timezone, setTimezone] = React.useState(user?.timezone || localZone);

  const defaults = getPhoneDefaults(user);
  const [countryCode, setCountryCode] = React.useState(defaults.countryCode);
  const [phoneNumber, setPhoneNumber] = React.useState(defaults.phoneNumber);
  const [errors, setErrors] = React.useState({});

  const onError = (err: ApolloError) => {
    setErrors(transformGraphqlError(err).details);
  };

  const [editProfile, profileState] = useMutation<
    any,
    Pick<
      MutationArgs.EditProfile,
      | 'email'
      | 'firstName'
      | 'lastName'
      | 'referralCode'
      | 'timezone'
      | 'countryCode'
      | 'phoneNumber'
    >
  >(EditProfileMutation, {
    onError,
    onCompleted() {
      alert.success('Updated', {
        timeout: 5000
      });
    }
  });

  const [editPassword, passwordState] = useMutation<
    any,
    Pick<MutationArgs.EditProfile, 'password' | 'previous'>
  >(EditProfileMutation, {
    onError,
    onCompleted() {
      setPassword('');
      setPrevious('');
      setConfirm('');
      alert.success('Updated', {
        timeout: 5000
      });
    }
  });

  const timezones = React.useMemo(() => getCountryTimezones(countryCode), [
    countryCode
  ]);

  return (
    <AccountNavs>
      <Box my={4}>
        <Card
          component="form"
          onSubmit={evt => {
            evt.preventDefault();
            setErrors(null);
            editProfile({
              variables: {
                email,
                firstName,
                lastName,
                referralCode,
                timezone,
                phoneNumber,
                countryCode
              }
            });
          }}
        >
          <CardHeader title="Account Settings" />
          <CardContent>
            <CLTextInput
              {...emailProps}
              required={true}
              value={email}
              errors={errors}
              onChange={evt => {
                setEmail(evt.target.value);
                setErrors(null);
              }}
            />
            <CLTextInput
              name="firstName"
              label="First Name"
              value={firstName}
              required={true}
              errors={errors}
              onChange={evt => {
                setFirstName(evt.target.value);
                setErrors(null);
              }}
            />
            <CLTextInput
              name="lastName"
              label="Last Name"
              value={lastName}
              errors={errors}
              onChange={evt => {
                setLastName(evt.target.value);
                setErrors(null);
              }}
            />

            <CLPhoneInput
              name="phoneNumber"
              errors={errors}
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onChange={(countryCode, phoneNumber) => {
                setCountryCode(countryCode);
                setPhoneNumber(phoneNumber);
              }}
            />

            {timezones.length > 0 && (
              <TextField
                value={timezone}
                onChange={evt => setTimezone(evt.target.value)}
                label="Your Timezone"
                helperText="We will send you email reminders using this setting"
                fullWidth
                margin="dense"
                select
                SelectProps={{
                  native: true
                }}
              >
                {timezones.map(tz => (
                  <option key={tz.name} value={tz.name}>
                    {tz.name}
                  </option>
                ))}
              </TextField>
            )}

            <CLTextInput
              name="referralCode"
              label="Referral Code"
              helperText="Refer your friend and earn credits"
              required
              value={referralCode}
              errors={errors}
              inputProps={{
                minLength: 4,
                maxLength: 20
              }}
              onChange={evt => {
                setReferralCode(evt.target.value);
                setErrors(null);
              }}
            />
          </CardContent>
          <CardActions>
            <CLButton
              loading={profileState.loading}
              color="primary"
              variant="contained"
            >
              Save
            </CLButton>
          </CardActions>
        </Card>
      </Box>

      <Box my={4}>
        <Card
          component="form"
          onSubmit={evt => {
            evt.preventDefault();
            if (!password || !confirm || password !== confirm) {
              return setErrors({
                confirm: "These passwords don't match. Try again?"
              });
            }

            setErrors({});
            editPassword({
              variables: {
                password,
                previous
              }
            });
          }}
        >
          <CardHeader title="Password Settings" />
          <CardContent>
            <CLTextInput
              {...passwordProps}
              name="previous"
              label="Your old password"
              helperText="To prevent unauthorized change"
              required={true}
              value={previous}
              errors={errors}
              onChange={evt => {
                setPrevious(evt.target.value);
                setErrors({});
              }}
            />
            <CLTextInput
              {...passwordProps}
              value={password}
              required={true}
              errors={errors}
              onChange={evt => {
                setPassword(evt.target.value);
                setErrors({});
              }}
            />
            <CLTextInput
              {...passwordProps}
              name="confirm"
              label="Confirm your password"
              value={confirm}
              required
              errors={errors}
              onChange={evt => {
                setConfirm(evt.target.value);
                setErrors({});
              }}
            />
          </CardContent>
          <CardActions>
            <CLButton
              loading={passwordState.loading}
              color="primary"
              variant="contained"
            >
              Save
            </CLButton>
          </CardActions>
        </Card>
      </Box>
    </AccountNavs>
  );
}
