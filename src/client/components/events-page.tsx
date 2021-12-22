import { useQuery } from '@apollo/react-hooks';
import { Topic } from 'cl-common';
import { Grid, Typography, Avatar, makeStyles } from '@material-ui/core';
import { Carousel } from 'react-responsive-carousel';
import { useRouter } from 'next/router';
import React from 'react';
import VideoCourseCard from './class-info/video-course-card';
import WebinarDetails from './class-info/webinar-details';
import Layout from './layout';
import MainSection from './main-section';
import {
  ClassesWithProjectListResult,
  GetClassesWithProjectsQuery
} from '../graphql/class-queries';
import { ClassLite, SubjectWithCourses } from '../../client/graphql/data-models';
import { QueryArgs } from '../../types';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& ul.control-dots': {
      padding: 0,
      margin: '3px 0',
      '&>.dot': {
        width: 10,
        height: 10
      }
    },
    '& li.slide': {
      backgroundColor: theme.palette.background.default,
      height: 280,
      '&>div': {
        position: 'relative',
        color: theme.palette.common.white,
        height: '100%',
        cursor: 'pointer'
      }
    }
  },
  avatar: {
    marginLeft: theme.spacing(2),
    width: '50px',
    height: '50px'
  },
  preview: {
    height: '200px',
    width: '100%'
  },
  projectTitle: {
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: 80,
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold'
  }
}));

export default function EventsPage(props: SubjectWithCourses) {
  const classes = useStyles();
  const router = useRouter();

  const result = useQuery<
    ClassesWithProjectListResult,
    QueryArgs.Classes & QueryArgs.ListProjectVars
  >(GetClassesWithProjectsQuery, {
    variables: { subjectId: props.id, limit: 10 }
  });

  const klassesMap: Record<string, ClassLite[]> = {};
  result.data?.classes.forEach(k => {
    if (klassesMap[k.courseId]) {
      klassesMap[k.courseId].push(k);
    } else {
      klassesMap[k.courseId] = [k];
    }
  });

  const liveEvents: React.ReactNodeArray = [];
  const recordedEvents: React.ReactNodeArray = [];

  props.courses.forEach(course => {
    const klasses = klassesMap[course.id];

    if (course.recording) {
      recordedEvents.push(
        <Grid id={course.id} key={course.id} item xs={12} md={6}>
          <VideoCourseCard course={course} />
        </Grid>
      );
    }

    if (klasses) {
      liveEvents.push(
        <WebinarDetails key={course.id} course={course} klasses={klasses} />
      );
    }
  });

  const goToProjectPage = (id: string) => {
    router.push('/project/[id]', `/project/${id}`);
  };

  const firstEventId = result.data?.classes[0]?.courseId;
  const firstEvent = firstEventId
    ? props.courses.find(c => c.id === firstEventId)
    : null;

  return (
    <Layout
      title={firstEvent ? firstEvent.name : props.name}
      description={firstEvent ? firstEvent.description : props.headline}
      image={firstEvent ? firstEvent.thumbnail : props.thumbnail}
    >
      <MainSection>
        <img src={props.banner} alt={props.name} />
        <header style={{ margin: '2rem 0', textAlign: 'center' }}>
          <Typography variant="h4">{props.name} - Free Events!</Typography>
          <Typography variant="h6" color="textSecondary">
            {props.headline}
          </Typography>
        </header>
        {props.id === Topic.FAIR &&
          result.data?.projects &&
          result.data.projects.length > 0 && (
            <Carousel
              className={classes.wrapper}
              showThumbs={false}
              showStatus={false}
              // autoPlay
              infiniteLoop
            >
              {result.data.projects.map(project => (
                <div key={project.id} onClick={() => goToProjectPage(project.id)}>
                  <div
                    style={{ backgroundImage: `url(${project.preview})` }}
                    className={classes.preview}
                  />
                  <div className={classes.projectTitle}>
                    <Avatar
                      src={project.student.avatar}
                      className={classes.avatar}
                    />
                    <Grid
                      container
                      direction="column"
                      style={{ textAlign: 'left', marginLeft: '20px' }}
                    >
                      <Typography>{project.title}</Typography>
                      <Typography>{project.student.name}</Typography>
                    </Grid>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: props.blurb }}
          style={{ marginBottom: '2rem' }}
        />
        {liveEvents}
      </MainSection>

      {recordedEvents.length > 0 && (
        <MainSection
          header={<Typography variant="h4">Recordings of Past Events</Typography>}
        >
          <Grid container spacing={4}>
            {recordedEvents}
          </Grid>
        </MainSection>
      )}
    </Layout>
  );
}
