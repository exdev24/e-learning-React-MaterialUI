import React from 'react';
import ResetPasswordPage from './index';

export default function ResetPasswordWithToken(props: { token: string }) {
  return <ResetPasswordPage token={props.token} />;
}
