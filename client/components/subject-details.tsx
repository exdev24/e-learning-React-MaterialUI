import { useQuery } from '@apollo/react-hooks';
import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { QueryArgs } from '../../types';
import { ClassListResult, GetUpcomingClassesQuery } from '../graphql/class-queries';
import { SubjectWithCourses } from '../graphql/data-models';
import CourseDetails from './class-info/course-details';
import CourseDetailsPackage from './class-info/course-details-package';
import ContainerWrapper from './container-wrapper';

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
    <ContainerWrapper>
      <img src={subject.banner} alt={subject.name} />
      <header style={{ margin: '2rem 0', textAlign: 'center' }}>
        <Typography variant="h4">{subject.name}</Typography>
        <Typography variant="h6" color="textSecondary">
          {subject.headline}
        </Typography>
        {trials.length > 0 && (
          <Button
            href={'#' + trials[0].id}
            color="primary"
            variant="contained"
            size="large"
            style={{ marginTop: 24 }}
          >
            Try for Free
          </Button>
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
    </ContainerWrapper>
  );
}
