import { useMutation } from '@apollo/react-hooks';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Typography
} from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import { useAlert } from 'react-alert';
import CLButton from '../../client/components/cl-button';
import CLTextInput from '../../client/components/cl-text-input';
import Layout from '../../client/components/layout';
import NextMUILink from '../../client/components/next-mui-link';
import { transformGraphqlError } from '../../client/graphql/apollo';
import { UserChildrenResponse } from '../../client/graphql/user-queries';
import { emailProps, passwordProps } from '../../client/lib/input-fields';
import { passwordResetTokenTTL, routeIds } from '../../shared/constants';
import { MutationArgs } from '../../types';

const ResetPasswordMutation = gql`
  mutation($email: String!, $passwordResetToken: String!, $password: String!) {
    user: resetPassword(
      email: $email
      passwordResetToken: $passwordResetToken
      password: $password
    ) {
      id
    }
  }
`;

export default function ResetPasswordPage(props: {
  token?: string;
  email?: string;
}) {
  const alert = useAlert();

  const [email, setEmail] = React.useState(props.email || '');
  const [passwordResetToken, setToken] = React.useState(props.token || '');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const [handleSubmit, status] = useMutation<
    UserChildrenResponse,
    MutationArgs.ResetPassword
  >(ResetPasswordMutation, {
    variables: { email, password, passwordResetToken },
    onError(err) {
      const { message, details } = transformGraphqlError(err);
      setErrors(details);
      alert.error(message, { timeout: 10000 });
    },
    onCompleted() {
      document.location.assign('/');
    }
  });

  return (
    <Layout basic title="Reset Password">
      <Container maxWidth="sm" style={{ marginTop: 64 }}>
        <form
          onSubmit={evt => {
            evt.preventDefault();
            if (!password || !confirm || password !== confirm) {
              return setErrors({
                confirm: "These passwords don't match. Try again?"
              });
            }

            handleSubmit();
          }}
        >
          <Card>
            <CardHeader
              title="Reset password"
              subheader="Use the one-time password reset token we sent you"
            />
            <CardContent>
              {props.email ? null : (
                <CLTextInput
                  {...emailProps}
                  required={true}
                  value={email}
                  errors={errors}
                  onChange={evt => {
                    setEmail(evt.target.value);
                    setErrors({});
                  }}
                />
              )}
              {props.token ? null : (
                <CLTextInput
                  name="token"
                  label="One-time Password Reset Token"
                  required={true}
                  value={passwordResetToken}
                  errors={errors}
                  onChange={evt => {
                    setToken(evt.target.value);
                  }}
                />
              )}
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
                color="primary"
                variant="contained"
                fullWidth
                loading={status.loading}
              >
                Change Password
              </CLButton>
            </CardActions>
          </Card>
        </form>
        <Typography variant="subtitle2" align="center" style={{ marginTop: 32 }}>
          {`Password reset token expires after ${passwordResetTokenTTL} minutes, `}
          <NextMUILink next={{ href: routeIds.forgotPassword }}>
            click here
          </NextMUILink>
          {' to request another one.'}
        </Typography>
      </Container>
    </Layout>
  );
}
