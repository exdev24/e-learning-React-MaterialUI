import { useMutation } from '@apollo/react-hooks';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  Typography
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { UrlObject } from 'url';
import { CLASSES, routeIds } from '../../shared/constants';
import { useTranslation } from '../../shared/i18n';
import { MutationArgs } from '../../types';
import { AccountContext } from '../context/account';
import { transformGraphqlError } from '../graphql/apollo';
import {
  SignInMutation,
  SignUpMutation,
  UserChildrenResponse
} from '../graphql/user-queries';
import { logEvent } from '../lib/analytics';
import {
  childNameProps,
  emailProps,
  nameProps,
  passwordProps
} from '../lib/input-fields';
import { getUserTraits } from '../lib/user-source';
import CLButton from './cl-button';
import { CLPhoneInput, defaultCountryCode } from './cl-phone-input';
import CLTextInput from './cl-text-input';
import NextMUILink from './next-mui-link';

export default function UserLogin(props: { signup: boolean }) {
  const router = useRouter();
  const account = React.useContext(AccountContext);
  const traits = getUserTraits();
  const { t } = useTranslation();

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [inviter, setInviter] = React.useState('');
  const [source, setSource] = React.useState(traits.initialSource || '');
  const [childName, setChildName] = React.useState('');
  const [errors, setErrors] = React.useState(null);

  const [countryCode, setCountryCode] = React.useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = React.useState('');

  let redirect: UrlObject = {
    pathname: '/',
    hash: CLASSES
  };

  if (typeof router.query.next === 'string') {
    redirect = {
      pathname: router.query.next
    };
  }

  const [handleSignIn, signInResult] = useMutation<
    UserChildrenResponse,
    MutationArgs.SignIn
  >(SignInMutation, {
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    },
    onCompleted(data) {
      account.setUser(data.user);
      router.replace(redirect);
    },
    variables: {
      email,
      password
    }
  });

  const [handleSignup, signupResult] = useMutation<
    UserChildrenResponse,
    MutationArgs.SignUp
  >(SignUpMutation, {
    onCompleted(data) {
      logEvent('CompleteRegistration', {
        variant: 'Regular Signup'
      });
      account.setUser(data.user);
      router.replace(redirect);
    },
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    }
  });

  if (props.signup) {
    return (
      <Box
        mb={6}
        component="form"
        onSubmit={evt => {
          evt.preventDefault();
          setErrors(null);
          handleSignup({
            variables: {
              email,
              name,
              inviter,
              password,
              childName,
              source,
              countryCode,
              phoneNumber,
              timezone: account.localZone,
              campaign: traits.initialCampaign,
              landing: traits.landing
            }
          });
        }}
      >
        <Card>
          <CardHeader title={t('cta.signup')} subheader={t('cta.signup_alt')} />
          <CardContent>
            <CLTextInput
              {...emailProps}
              required={true}
              value={email}
              errors={errors}
              autoComplete="new-username"
              onChange={evt => setEmail(evt.target.value)}
            />
            <CLTextInput
              {...passwordProps}
              required={true}
              autoComplete="new-password"
              value={password}
              errors={errors}
              onChange={evt => setPassword(evt.target.value)}
            />

            <CLTextInput
              {...nameProps}
              required={true}
              value={name}
              errors={errors}
              onChange={evt => setName(evt.target.value)}
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

            <CLTextInput
              {...childNameProps}
              value={childName}
              errors={errors}
              onChange={evt => setChildName(evt.target.value)}
            />

            <CLTextInput
              value={inviter}
              errors={errors}
              onChange={evt => setInviter(evt.target.value)}
              name="inviter"
              helperText="Are you referred by a friend?"
              inputProps={{
                placeholder: "Referral code or friends' email"
              }}
            />

            {!traits.initialSource && (
              <FormControl margin="dense" fullWidth>
                <InputLabel>How did you hear about us?</InputLabel>
                <Select
                  value={source}
                  onChange={evt => setSource(evt.target.value as string)}
                  native
                >
                  <option value="" />
                  <option value="Search">Search</option>
                  <option value="Friends">Friends</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="School">Teacher/School</option>
                </Select>
              </FormControl>
            )}

            <Box my={2}>
              <CLButton
                color="primary"
                variant="contained"
                className="btn-signup"
                fullWidth
                loading={signupResult.loading}
              >
                {t('cta.signup')}
              </CLButton>
            </Box>
            <Typography variant="subtitle2" align="center">
              {"By signing up, you accept Create & Learn's "}
              <NextMUILink
                color="secondary"
                next={{ href: routeIds.tos }}
                title="Terms of Use"
              >
                Terms of Use
              </NextMUILink>
              {' and '}
              <NextMUILink
                color="secondary"
                next={{ href: routeIds.privacy }}
                title="Privacy Policy"
              >
                Privacy Policy
              </NextMUILink>
              .
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      mb={6}
      component="form"
      onSubmit={evt => {
        evt.preventDefault();
        setErrors(null);
        handleSignIn();
      }}
    >
      <Card>
        <CardHeader title={t('cta.signin')} subheader={t('cta.signin_alt')} />
        <CardContent>
          <CLTextInput
            {...emailProps}
            helperText="Same email you used to signup for class"
            autoFocus
            required
            errors={errors}
            value={email}
            onChange={evt => {
              setEmail(evt.target.value);
              setErrors({});
            }}
          />

          <CLTextInput
            {...passwordProps}
            label="Enter your password"
            required
            errors={errors}
            value={password}
            onChange={evt => {
              setPassword(evt.target.value);
              setErrors({});
            }}
          />
          <NextMUILink
            color="secondary"
            next={{ href: routeIds.forgotPassword }}
            title={t('cta.forgot')}
          >
            {t('cta.forgot')}
          </NextMUILink>
        </CardContent>
        <Box textAlign="right" p={2}>
          <CLButton
            variant="contained"
            color="primary"
            type="submit"
            className="btn-signin"
            fullWidth
            loading={signInResult.loading}
          >
            {t('cta.signin')}
          </CLButton>
        </Box>
      </Card>
    </Box>
  );
}
