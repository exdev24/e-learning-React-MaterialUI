import { useMutation } from '@apollo/react-hooks';
import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import {
  blogUrlForYoungChild,
  routeIds,
  scratchJuniorId
} from '../../../shared/constants';
import { MutationArgs } from '../../../types';
import { AccountContext } from '../../context/account';
import { transformGraphqlError } from '../../graphql/apollo';
import { ClassLite, Course, UserWithChildren } from '../../graphql/data-models';
import { SignUpMutation, UserChildrenResponse } from '../../graphql/user-queries';
import { logEvent } from '../../lib/analytics';
import { isOldEnough } from '../../lib/checkout-helper';
import {
  birthYearProps,
  childNameProps,
  emailProps,
  nameProps,
  passwordProps
} from '../../lib/input-fields';
import { getUserTraits } from '../../lib/user-source';
import CLButton from '../cl-button';
import CLTextInput from '../cl-text-input';
import NextMUILink from '../next-mui-link';

interface Props {
  klass: ClassLite;
  course: Course;
  onAccountCreated: (user: UserWithChildren) => void;
}

export default function ExpressSignup(props: Props) {
  const account = React.useContext(AccountContext);

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [childName, setChildName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [year, setYear] = React.useState<number>();
  const [errors, setErrors] = React.useState({});

  const [handleSignup, signupResult] = useMutation<
    UserChildrenResponse,
    MutationArgs.SignUp
  >(SignUpMutation, {
    onError(err) {
      setErrors(transformGraphqlError(err).details);
    },
    onCompleted(data) {
      account.setUser(data.user);
      logEvent('CompleteRegistration', {
        variant: 'Express Signup'
      });
      logEvent('StartTrial', {
        content_name: props.course.name,
        content_ids: [props.course.id],
        content_type: 'product',
        subject: props.course.subjectId,
        variant: 'Express Signup',
        value: 0
      });
      props.onAccountCreated(data.user);
    }
  });

  const isTooYoung = !isOldEnough(props.course, { birthYear: year });
  const isScratchJunior = props.course.id === scratchJuniorId;

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault();
        const traits = getUserTraits();
        return handleSignup({
          variables: {
            password,
            name,
            email,
            year,
            childName,
            classId: props.klass.id,
            timezone: account.localZone,
            source: traits.initialSource,
            campaign: traits.initialCampaign,
            landing: traits.landing
          }
        });
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CLTextInput
            {...childNameProps}
            required
            value={childName}
            errors={errors}
            onChange={evt => setChildName(evt.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CLTextInput
            {...birthYearProps}
            value={year}
            errors={errors}
            onChange={evt => setYear(parseInt(evt.target.value, 10))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CLTextInput
            {...emailProps}
            required
            helperText="We will email you about how to join the class"
            value={email}
            errors={errors}
            onChange={evt => setEmail(evt.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CLTextInput
            {...passwordProps}
            required
            value={password}
            errors={errors}
            onChange={evt => setPassword(evt.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CLTextInput
            {...nameProps}
            required
            value={name}
            errors={errors}
            onChange={evt => setName(evt.target.value)}
          />
        </Grid>
      </Grid>
      {isTooYoung && (
        <Box my={2}>
          {isScratchJunior ? (
            <Typography variant="subtitle2" color="error">
              {'Your child is too young for our scratch class. '}
              <a href={blogUrlForYoungChild}>Check out these free resources</a>
              {' to get started.'}
            </Typography>
          ) : (
            <Typography variant="subtitle2" color="error">
              {`This class is best for child grades ${props.course.grades.join(
                ' - '
              )}, we recommend you start with our Scratch Ninja Junior Class.`}
            </Typography>
          )}
        </Box>
      )}
      <Box my={2}>
        <CLButton
          color="primary"
          variant="contained"
          className="enroll_free"
          fullWidth
          loading={signupResult.loading}
          disabled={isTooYoung}
        >
          Enroll for Free
        </CLButton>
        <Typography variant="caption">
          {"By signing up, you accept Create & Learn's "}
          <NextMUILink
            next={{ href: routeIds.tos }}
            color="secondary"
            title="Terms of Service"
          >
            Terms of Service
          </NextMUILink>
          {' and '}
          <NextMUILink
            next={{ href: routeIds.privacy }}
            color="secondary"
            title="Privacy Policy"
          >
            Privacy Policy
          </NextMUILink>
          .
        </Typography>
      </Box>
    </form>
  );
}
