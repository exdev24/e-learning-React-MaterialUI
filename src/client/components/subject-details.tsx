import { useQuery } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import { QueryArgs } from '../../types';
import { ClassListResult, GetUpcomingClassesQuery } from '../graphql/class-queries';
import { SubjectWithCourses } from '../graphql/data-models';
import ResonsiveCTA from './banners/responsive-cta';
import CourseDetails from './class-info/course-details';
import CourseDetailsPackage from './class-info/course-details-package';

interface Props {
  subject: SubjectWithCourses;
}

export default function SubjectDetails({ subject }: Props) {
  const classResult = useQuery<ClassListResult, QueryArgs.Classes>(
    GetUpcomingClassesQuery,
    {
      variables: { subjectId: subject.id },
      fetchPolicy: 'cache-and-network',
      ssr: false
    }
  );

  if (subject.courses.length === 0) {
    return null;
  }

  const trials = subject.courses.filter(c => c.isTrial);
  const others =
    trials.length > 0 ? subject.courses.slice(trials.length) : subject.courses;

  return (
    <Container style={{ margin: '2rem auto' }}>
      <img src={subject.banner} alt={subject.name} />
      <header style={{ textAlign: 'center', margin: '2rem 0' }}>
        <Typography variant="h4">{subject.name}</Typography>
        <Typography variant="h6" color="textSecondary">
          {subject.headline}
        </Typography>
        {trials.length > 0 && (
          <ResonsiveCTA href={'#' + trials[0].id}>Try for Free</ResonsiveCTA>
        )}
      </header>
      <Typography
        component="div"
        dangerouslySetInnerHTML={{ __html: subject.blurb }}
        style={{ marginBottom: '2rem' }}
      />
      {trials.map(course => (
        <CourseDetails
          key={course.id}
          course={course}
          klasses={classResult.data?.classes}
        />
      ))}
      {subject.exitLevel > 1 && (
        <CourseDetailsPackage
          subject={subject}
          klasses={classResult.data?.classes}
        />
      )}
      {others.map(course => (
        <CourseDetails
          key={course.id}
          course={course}
          klasses={classResult.data?.classes}
        />
      ))}
    </Container>
  );
}
