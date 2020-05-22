import { useMutation } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import React from 'react';
import CLButton from '../client/components/button';
import CLTextInput from '../client/components/text-input';
import { transformGraphqlError } from '../client/graphql/apollo';
import { emailProps } from '../client/lib/input-fields';
import { MutationArgs } from '../types';
import Layout from '../client/components/layout';

const ForgotPasswordMutation = gql`
  mutation($email: String!) {
    forgotPassword(email: $email)
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isDone, setIsDone] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [handleSubmit, status] = useMutation<boolean, MutationArgs.ForgotPassword>(
    ForgotPasswordMutation,
    {
      variables: { email },
      onError(err) {
        setErrors(transformGraphqlError(err).details);
      },
      onCompleted() {
        setIsDone(true);
      }
    }
  );

  return (
    <Layout basic title="Recover Password">
      <Container maxWidth="sm" style={{ marginTop: 64 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <form
          onSubmit={evt => {
            evt.preventDefault();
            handleSubmit();
          }}
        >
          <CLTextInput
            {...emailProps}
            required={true}
            value={email}
            errors={errors}
            disabled={isDone}
            onChange={evt => setEmail(evt.target.value)}
          />
          {isDone ? (
            <Typography color="secondary">
              We have sent an email to {email} on how to reset the password. Please
              check your email for details. Thanks.
            </Typography>
          ) : (
            <Typography>
              Enter your registered email and we will send you password reset
              instructions.
            </Typography>
          )}
          <CLButton
            style={{ marginTop: 32 }}
            color="primary"
            variant="contained"
            fullWidth
            disabled={isDone}
            loading={status.loading}
          >
            Reset Password
          </CLButton>
        </form>
      </Container>
    </Layout>
  );
}
