import { useMutation } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import gql from 'graphql-tag';
import Router from 'next/router';
import React from 'react';
import CLButton from '../client/components/cl-button';
import CLTextInput from '../client/components/cl-text-input';
import Layout from '../client/components/layout';
import MainSection from '../client/components/main-section';
import { transformGraphqlError } from '../client/graphql/apollo';
import { emailProps } from '../client/lib/input-fields';
import { MutationArgs } from '../types';

const ForgotPasswordMutation = gql`
  mutation($email: String!) {
    forgotPassword(email: $email)
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const [handleSubmit, status] = useMutation<boolean, MutationArgs.ForgotPassword>(
    ForgotPasswordMutation,
    {
      variables: { email },
      onError(err) {
        setErrors(transformGraphqlError(err).details);
      },
      onCompleted() {
        Router.push({
          pathname: '/reset-password',
          query: {
            email
          }
        });
      }
    }
  );

  return (
    <Layout basic title="Recover Password">
      <MainSection
        maxWidth="sm"
        header={<Typography variant="h5">Forgot Password</Typography>}
      >
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
            onChange={evt => setEmail(evt.target.value)}
          />
          <Typography>
            Enter your registered email and we will send you password reset
            instructions.
          </Typography>
          <CLButton
            style={{ marginTop: 32 }}
            color="primary"
            variant="contained"
            fullWidth
            loading={status.loading}
          >
            Reset Password
          </CLButton>
        </form>
      </MainSection>
    </Layout>
  );
}
