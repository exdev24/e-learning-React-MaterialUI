import { useMutation } from '@apollo/react-hooks';
import { Box, Card, CardContent } from '@material-ui/core';
import React from 'react';
import { MutationArgs } from '../../../types';
import { transformGraphqlError } from '../../graphql/apollo';
import { SignInMutation, UserChildrenResponse } from '../../graphql/user-queries';
import { passwordProps } from '../../lib/input-fields';
import CLButton from '../button';
import CLTextInput from '../text-input';

interface Props {
  email: string;
  setPasswordCheck: (flag: boolean) => void;
}

export default function PasswordCheck(props: Props) {
  const [errors, setErrors] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [handleSignIn, signInResult] = useMutation<
    UserChildrenResponse,
    MutationArgs.SignIn
  >(SignInMutation, {
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    },
    onCompleted() {
      props.setPasswordCheck(true);
    },
    variables: {
      email: props.email,
      password
    }
  });

  return (
    <Box
      component="form"
      style={{ padding: '1em 0' }}
      onSubmit={evt => {
        evt.preventDefault();
        setErrors(null);
        handleSignIn();
      }}
    >
      <Card style={{ width: '50%' }}>
        <CardContent>
          <CLTextInput
            {...passwordProps}
            label="Enter your password"
            helperText="To protect your payment method"
            required
            errors={errors}
            value={password}
            onChange={evt => {
              setPassword(evt.target.value);
              setErrors({});
            }}
          />
          <Box textAlign="center">
            <CLButton
              variant="contained"
              color="primary"
              type="submit"
              loading={signInResult.loading}
              fullWidth
            >
              Enter Password
            </CLButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
