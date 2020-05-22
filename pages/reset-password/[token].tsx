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
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import React from 'react';
import CLButton from '../../client/components/button';
import CLTextInput from '../../client/components/text-input';
import Layout from '../../client/components/layout';
import NextMUILink from '../../client/components/next-mui-link';
import { AccountContext } from '../../client/context/account';
import { transformGraphqlError } from '../../client/graphql/apollo';
import { UserChildrenFragment } from '../../client/graphql/data-models';
import { UserChildrenResponse } from '../../client/graphql/user-queries';
import { emailProps, passwordProps } from '../../client/lib/input-fields';
import { passwordResetTokenTTL, routeIds } from '../../shared/constants';
import { MutationArgs } from '../../types';

const ResetPasswordMutation = gql`
  ${UserChildrenFragment}
  mutation($email: String!, $passwordResetToken: String!, $password: String!) {
    user: resetPassword(
      email: $email
      passwordResetToken: $passwordResetToken
      password: $password
    ) {
      ...UserChildrenFragment
    }
  }
`;

export default function ResetPasswordPage(props: { token: string }) {
  const account = React.useContext(AccountContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const router = useRouter();
  const [handleSubmit, status] = useMutation<
    UserChildrenResponse,
    MutationArgs.ResetPassword
  >(ResetPasswordMutation, {
    variables: { email, password, passwordResetToken: props.token },
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    },
    onCompleted(data) {
      account.setUser(data.user);
      router.replace('/');
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
              subheader={errors['message'] || ''}
              subheaderTypographyProps={{ color: 'error' }}
            />
            <CardContent>
              <CLTextInput
                {...emailProps}
                required={true}
                value={email}
                errors={errors}
                onChange={evt => {
                  setEmail(evt.target.value);
                  setErrors(omit(errors, 'email'));
                }}
              />
              <CLTextInput
                {...passwordProps}
                value={password}
                required={true}
                errors={errors}
                onChange={evt => {
                  setPassword(evt.target.value);
                  setErrors(omit(errors, 'password', 'confirm'));
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
                  setErrors(omit(errors, 'password', 'confirm'));
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
          {`This link expires after ${passwordResetTokenTTL} hours, `}
          <NextMUILink next={{ href: routeIds.forgotPassword }}>
            click here
          </NextMUILink>
          {' to request another one.'}
        </Typography>
      </Container>
    </Layout>
  );
}
