import { useQuery } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import { Topic } from 'cl-common';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import React from 'react';
import { AccountContext } from '../../context/account';
import {
  CourseWithSubject,
  CourseWithSubjectFragment,
  Subject,
  SubjectFragment
} from '../../graphql/data-models';
import { getTopicLink } from '../../lib/url-utils';
import ThumbnailNavItem from '../class-info/thumbnail-nav-item';
import PreflightCheck from '../preflight-check';

interface Props {
  courseIds: string[];
  cta: string;
}

const CourseListQuery = gql`
  ${SubjectFragment}
  ${CourseWithSubjectFragment}
  query($courseIds: [ID]!, $webinarId: ID!) {
    webinars: subject(id: $webinarId) {
      ...SubjectFragment
    }
    courses(ids: $courseIds) {
      ...CourseWithSubjectFragment
    }
  }
`;

export default function CourseListing(props: Props) {
  const account = React.useContext(AccountContext);
  const router = useRouter();

  const queryResult = useQuery<{ webinars: Subject; courses: CourseWithSubject[] }>(
    CourseListQuery,
    {
      variables: {
        courseIds: props.courseIds,
        webinarId: Topic.WEBINARS
      }
    }
  );

  if (!queryResult.data) {
    return (
      <PreflightCheck loading={queryResult.loading} error={queryResult.error} />
    );
  }

  const { webinars, courses } = queryResult.data;

  return (
    <Grid container justify="center" spacing={5}>
      {courses.map(course => (
        <Grid key={course.id} item xs={12} sm={6} md={4}>
          <ThumbnailNavItem
            thumbnail={course.thumbnail}
            title={course.name}
            grades={course.grades}
            subtitle={course.subject.headline}
            linkLabel={props.cta}
            linkProps={
              account.user
                ? getTopicLink(course.subjectId, {
                    courseId: course.id
                  })
                : {
                    href: {
                      pathname: router.pathname,
                      query: {
                        cid: course.id
                      }
                    }
                  }
            }
          />
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        <ThumbnailNavItem
          thumbnail={webinars.thumbnail}
          title={webinars.name}
          subtitle={webinars.headline}
          grades={webinars.grades}
          linkLabel="Signup for Free"
          linkProps={getTopicLink(webinars.id)}
        />
      </Grid>
    </Grid>
  );
}
