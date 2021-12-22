import { useQuery } from '@apollo/react-hooks';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import React from 'react';
import { getPackagePrice, savingPercentageInPackage } from '../../shared/pricing';
import { QueryArgs } from '../../types';
import { ClassListResult, GetUpcomingClassesQuery } from '../graphql/class-queries';
import { Course, SubjectWithCourses } from '../graphql/data-models';
import CourseConcept from './class-info/course-concept';
import CourseDetails from './class-info/course-details';
import CourseDetailsPackage from './class-info/course-details-package';
import ContainerWrapper from './container-wrapper';
import SubjectConcepts from './subject-concepts';
import SubjectTip from './subject-tip';

const heroImage = '/images/scratch-hero-image.png';
const useStyles = makeStyles(theme => ({
  header: {
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(8)
  },
  headerGridItem: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      flexBasis: '100%',
      '&:first-child': {
        display: 'none'
      }
    }
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#BD8950',
    color: 'white'
  },
  blurb: {
    backgroundColor: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 47px 67px rgba(103, 103, 103, 0.25)',
    marginTop: '6em',
    zIndex: 1,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '50px',
      top: '-40px',
      right: 0,
      bottom: 0,
      backgroundColor: 'inherit',
      left: 0,
      borderRadius: '6px',
      transformOrigin: 'top right',
      transform: 'skewY(-1deg)'
    }
  },
  bar: {
    backgroundImage: 'url("/images/bar.png")',
    backgroundRepeat: 'repeat-y',
    width: '100%',
    backgroundSize: 'contain',
    padding: theme.spacing(2, 4),
    marginBottom: theme.spacing(4)
  },
  insideBar: {
    backgroundColor: 'rgb(3, 102, 255)',
    borderRadius: theme.spacing(1),
    color: 'white',
    padding: theme.spacing(1),
    textAlign: 'center'
  }
}));

interface Props {
  subject: SubjectWithCourses;
}

interface ChipData {
  key: number;
  label: string;
}

export default function SubjectDetailsScratch({ subject }: Props) {
  const classes = useStyles({});
  const classResult = useQuery<ClassListResult, QueryArgs.Classes>(
    GetUpcomingClassesQuery,
    {
      variables: { subjectId: subject.id },
      fetchPolicy: 'cache-and-network',
      ssr: false
    }
  );
  const contents1 = [
    'Learn basic concepts such as loop, events, conditional, motion, and sensing.',
    'Work on a project in each session ranging from animation, games, to graphic design and storytelling.',
    'Get knowledge such as what is in a computer and the history of computers'
  ];
  const contents2 = [
    'Learn more concept such as variables, multimedia messaging, and clone.',
    'Be challenged to come up with creative solutions to solve problems and build more complicated projects.',
    'WIP'
  ];
  const contents3 = [
    'Master the most advanced concepts in Scratch such as arrays and functions.',
    'Design and deliver personal projects on their own to complete projects successfully from end to end.',
    'WIP'
  ];
  const chipData: ChipData[] = [
    { key: 0, label: 'Grade 2-4' },
    { key: 1, label: 'Beginner' },
    { key: 2, label: '12 Sessions' }
  ];

  const courses = subject.courses.filter(
    c => c.level > 0 && c.level <= subject.exitLevel
  );
  if (courses.length === 0 || courses[0].level !== 1) {
    return null;
  }
  const [listingPrice, promoPrice] = getPackagePrice(courses);

  let trial: Course = null;
  let regular = subject.courses;
  if (subject.courses[0].price === 0 && subject.courses[0].level === 0) {
    trial = subject.courses[0];
    regular = subject.courses.slice(1);
  }

  //Get sub-header and subtext form subject.headline
  const boundaryIndex =
    subject.headline.lastIndexOf('-') ||
    subject.headline.indexOf('.') ||
    subject.headline.indexOf(',');
  const subHeader =
    boundaryIndex != -1
      ? subject.headline.slice(0, boundaryIndex)
      : subject.headline;
  const subHeaderText =
    boundaryIndex != -1
      ? subject.headline.slice(boundaryIndex + 1, subject.headline.length)
      : ' ';
  return (
    <ContainerWrapper>
      <header className={classes.header}>
        <Grid container>
          <Grid item xs={6} className={classes.headerGridItem}></Grid>
          <Grid
            item
            xs={6}
            className={classes.headerGridItem}
            style={{ marginTop: '4em', textAlign: 'center' }}
          >
            <Typography variant="h4" style={{ color: 'white', fontWeight: 'bold' }}>
              {subHeader}
            </Typography>
            <Typography variant="h6" style={{ color: 'white', marginBottom: '1em' }}>
              {subHeaderText}
            </Typography>
            {chipData.map(data => (
              <Chip key={data.key} label={data.label} className={classes.chip} />
            ))}
          </Grid>
        </Grid>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: subject.blurb }}
          className={classes.blurb}
        />
      </header>
      <SubjectConcepts>
        <Grid container spacing={3}>
          <CourseConcept
            image={subject.courses[1].thumbnail}
            index={1}
            contents={contents1}
          />
          <CourseConcept
            image={subject.courses[2].thumbnail}
            index={2}
            contents={contents2}
          />
          <CourseConcept
            image={subject.courses[3].thumbnail}
            index={3}
            contents={contents3}
          />
        </Grid>
      </SubjectConcepts>

      <Box className={classes.bar}>
        <Card variant="outlined" className={classes.insideBar}>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            Complete Course Learning Plan (Recommended)
          </Typography>
          <Typography variant="h6">
            {`12 Sessions for ${
              courses.length * 4
            } Weeks | $${promoPrice}($95/Unit)`}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              style={{ marginLeft: '16px', fontWeight: 'bold' }}
            >
              Enroll Now
            </Button>
          </Typography>
        </Card>
      </Box>

      <SubjectTip
        firstOrder
        header="How It Works?"
        subheader="Watch the Video or Join Our Free Intro Class"
        tips={[
          { fWord: 'No More than 5', sWord: 'Students PerClass' },
          { fWord: 'Interactive Online Class', sWord: 'with Real Teachers' },
          { fWord: 'Create Personal', sWord: 'Projects' }
        ]}
      />

      {trial && <CourseDetails course={trial} klasses={classResult.data?.classes} />}

      {trial && (
        <SubjectTip
          header="To Be A Scratch Ninja?"
          subheader="Choose Our Complete Course Learning Plan"
          tips={[
            {
              fWord: `$${promoPrice} For ${subject.exitLevel} Units`,
              sWord: `With ${savingPercentageInPackage}% Discount`
            },
            { fWord: '12 Sessions for', sWord: `${courses.length * 4} Weeks` },
            { fWord: '55 Minutes Per', sWord: 'Session' }
          ]}
        />
      )}

      <CourseDetailsPackage subject={subject} klasses={classResult.data?.classes} />

      <SubjectTip
        header="Still Not Sure About it?"
        subheader="No Worries, You Can Start Learning by Unit"
        tips={[
          { fWord: '$129 Per Unit', sWord: ' ' },
          { fWord: '4 Sessions for', sWord: '4 Weeks' },
          { fWord: '55 Minutes Per', sWord: 'Session' }
        ]}
      />

      {regular.map(course => (
        <CourseDetails
          key={course.id}
          course={course}
          klasses={classResult.data?.classes}
        />
      ))}
    </ContainerWrapper>
  );
}
