import { useMutation } from '@apollo/react-hooks';
import {
  Container,
  GridListTileBar,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@material-ui/core';
import { Star } from '@material-ui/icons';
import gql from 'graphql-tag';
import NextLink from 'next/link';
import React from 'react';
import { useAlert } from 'react-alert';
import CLButton from '../../client/components/cl-button';
import Layout from '../../client/components/layout';
import { Course, CourseFragment } from '../../client/graphql/data-models';
import { getTopicLink } from '../../client/lib/url-utils';
import { MutationArgs } from '../../types';

const GenerateCertificateMutation = gql`
  ${CourseFragment}
  mutation($classId: ID!, $studentId: ID!, $studentName: String!) {
    recommendations: generateCertificate(
      classId: $classId
      studentId: $studentId
      studentName: $studentName
    ) {
      ...CourseFragment
    }
  }
`;

const useStyles = makeStyles(theme => ({
  star: {
    color: '#FEDD16',
    fontSize: '3.5rem'
  },
  mainStar: {
    color: '#FEDD16',
    fontSize: '5rem'
  },
  header: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'capitalize',
    textAlign: 'center',
    margin: theme.spacing(2, 0),
    fontSize: '1.85rem'
  },
  subHeader: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '1.3rem',
    lineHeight: '1.5rem'
  },
  carousel: {
    display: 'flex',
    overflow: 'auto',
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    justifyContent: 'center',
    '&>a': {
      flexShrink: 0,
      width: 280,
      marginRight: theme.spacing(1),
      boxShadow: theme.shadows[2],
      position: 'relative',
      display: 'block',
      cursor: 'pointer',
      '&:last-of-type': {
        marginRight: 0
      }
    }
  }
}));

export default function CourseCertificate(
  props: MutationArgs.GenerateCertification
) {
  const alert = useAlert();
  const classes = useStyles({});

  const [studentName, setStudentName] = React.useState(props.studentName);
  const [activeStep, setActiveStep] = React.useState(0);

  const [generateCertificate, generateCertificateState] = useMutation<
    { recommendations: Course[] },
    MutationArgs.GenerateCertification
  >(GenerateCertificateMutation, {
    onCompleted() {
      setActiveStep(1);
    },
    onError() {
      alert.error('Fail to send request certificate');
    },
    variables: {
      studentId: props.studentId,
      classId: props.classId,
      studentName
    }
  });

  const stepper = (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      style={{ marginTop: 24, marginBottom: 32 }}
    >
      <Step completed={activeStep === 1}>
        <StepLabel>Confirm Student</StepLabel>
      </Step>
      <Step>
        <StepLabel>Complete</StepLabel>
      </Step>
    </Stepper>
  );

  if (activeStep === 0) {
    return (
      <Layout basic title="Request course certificate">
        {stepper}
        <Container maxWidth="md" style={{ textAlign: 'center' }}>
          <Typography variant="h5">
            {"Please confirm your child's name on the certificate"}
          </Typography>
          <div style={{ marginTop: 32, marginBottom: 32 }}>
            <TextField
              label="Student Name"
              name="studentName"
              value={studentName}
              onChange={evt => setStudentName(evt.target.value)}
              variant="outlined"
              required
              helperText="Want to change the name? Please type the new name"
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <CLButton
            color="primary"
            variant="contained"
            size="large"
            loading={generateCertificateState.loading}
            onClick={() => generateCertificate()}
          >
            Confirm Name and Request for Certificate
          </CLButton>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout basic title="Request course certificate">
      {stepper}
      <Container maxWidth="md" style={{ textAlign: 'center' }}>
        <Star className={classes.star} />
        <Star className={classes.mainStar} />
        <Star className={classes.star} />
        <Typography variant="h4" className={classes.header}>
          Certificate of achievement
        </Typography>
        <Typography variant="h6" className={classes.subHeader}>
          Will be emailed to you in a couple days
        </Typography>
        <Typography variant="h6" color="primary" style={{ marginBottom: 32 }}>
          What other students are learning:
        </Typography>
        <div className={classes.carousel}>
          {generateCertificateState.data.recommendations.map(course => (
            <NextLink
              key={course.id}
              passHref
              {...getTopicLink(course.subjectId, {
                courseId: course.id
              })}
            >
              <a>
                <img src={course.thumbnail} alt={course.name} />
                <GridListTileBar title={course.name} />
              </a>
            </NextLink>
          ))}
        </div>
      </Container>
    </Layout>
  );
}
