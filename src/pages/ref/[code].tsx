import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@material-ui/core';
import { ReferralCredits } from 'cl-common';
import { useRouter } from 'next/router';
import React from 'react';
import CLButton from '../../client/components/cl-button';
import CLTextInput from '../../client/components/cl-text-input';
import Flash from '../../client/components/flash';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';
import NextMUIButton from '../../client/components/next-mui-button';
import NextMUILink from '../../client/components/next-mui-link';
import PreflightCheck from '../../client/components/preflight-check';
import { AccountContext } from '../../client/context/account';
import { transformGraphqlError } from '../../client/graphql/apollo';
import {
  RefererInfoData,
  RefererInfoQuery,
  SignUpMutation,
  UserChildrenResponse
} from '../../client/graphql/user-queries';
import { logPageView } from '../../client/lib/analytics';
import { emailProps, nameProps, passwordProps } from '../../client/lib/input-fields';
import { getTopicLink } from '../../client/lib/url-utils';
import { CLASSES, routeIds } from '../../shared/constants';
import { formatCents } from '../../shared/pricing';
import { MutationArgs, QueryArgs } from '../../types';

export default function RefLanding(props: { code: string }) {
  const router = useRouter();
  const account = React.useContext(AccountContext);

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState(null);

  React.useEffect(() => logPageView('ReferralLanding'), []);

  const { data, error, loading } = useQuery<RefererInfoData, QueryArgs.Referer>(
    RefererInfoQuery,
    {
      variables: {
        code: props.code
      }
    }
  );

  const [handleSignup, signupResult] = useMutation<
    UserChildrenResponse,
    MutationArgs.SignUp
  >(SignUpMutation, {
    onCompleted(data) {
      account.setUser(data.user);
      router.replace({ pathname: '/', hash: CLASSES });
    },
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    }
  });

  if (!data) {
    return <PreflightCheck error={error} loading={loading} />;
  }

  const { subjects, firstName } = data.referer;
  const signupCredit = formatCents(ReferralCredits.signup);
  const title = `${firstName} Sent You ${signupCredit}!`;

  return (
    <Layout title={title}>
      <Flash title={title} />
      <MainSection maxWidth="sm">
        <Typography variant="h5" align="center">
          {"Let's get started"}
        </Typography>
        <Stepper activeStep={0}>
          <Step>
            <StepLabel>Create an Account</StepLabel>
          </Step>
          <Step>
            <StepLabel>Claim Your {signupCredit}</StepLabel>
          </Step>
        </Stepper>
        <form
          onSubmit={evt => {
            evt.preventDefault();
            setErrors(null);
            return handleSignup({
              variables: {
                email,
                name,
                password,
                source: 'Referral',
                inviter: props.code,
                timezone: account.localZone
              }
            });
          }}
        >
          <CLTextInput
            {...emailProps}
            required={true}
            value={email}
            errors={errors}
            onChange={evt => setEmail(evt.target.value)}
          />
          <CLTextInput
            {...nameProps}
            required={true}
            value={name}
            errors={errors}
            onChange={evt => setName(evt.target.value)}
          />
          <CLTextInput
            {...passwordProps}
            required={true}
            value={password}
            errors={errors}
            onChange={evt => setPassword(evt.target.value)}
          />
          <Box my={2}>
            <CLButton
              color="primary"
              variant="contained"
              fullWidth
              loading={signupResult.loading}
            >
              Continue
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
        </form>
      </MainSection>
      <MainSection>
        <Typography variant="h5" align="center" style={{ marginBottom: 24 }}>
          Courses Recommended by {firstName}
        </Typography>
        <Grid container justify="center" spacing={4}>
          {subjects.map(subject => (
            <Grid key={subject.id} item xs={12} sm={4}>
              <Card>
                <CardMedia
                  image={subject.thumbnail}
                  style={{ height: 0, paddingTop: '62.5%' }}
                />
                <CardHeader title={subject.name} />
                <Divider />
                <CardContent>{subject.headline}</CardContent>
                <CardActions>
                  <NextMUIButton
                    color="primary"
                    variant="contained"
                    fullWidth
                    next={getTopicLink(subject.id)}
                  >
                    Check Out the class
                  </NextMUIButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainSection>
    </Layout>
  );
}
