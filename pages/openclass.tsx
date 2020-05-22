import { useQuery } from '@apollo/react-hooks';
import { Typography } from '@material-ui/core';
import { Topic } from 'common';
import gql from 'graphql-tag';
import React from 'react';
import PromoBanner from '../client/components/about/promo-banner';
import ClassListRow from '../client/components/class-info/class-listing-row';
import WebinarDetails from '../client/components/class-info/webinar-details';
import ContainerWrapper from '../client/components/container-wrapper';
import EmbedVideo from '../client/components/embed-video';
import Layout from '../client/components/layout';
import PreflightCheck from '../client/components/preflight-check';
import {
  ClassLite,
  ClassLiteFragment,
  SubjectWithCourses,
  SubjectWithCoursesFragment
} from '../client/graphql/data-models';
import { logPageView } from '../client/lib/analytics';
import { IDVars } from '../types';

const GetOpenClassesQuery = gql`
  ${SubjectWithCoursesFragment}
  ${ClassLiteFragment}
  query($id: ID!) {
    klasses: classes(subjectId: $id) {
      ...ClassLiteFragment
    }
    subject(id: $id) {
      ...SubjectWithCoursesFragment
    }
  }
`;

export default function OpenClassPage() {
  React.useEffect(
    () =>
      logPageView('OpenClass', {
        subject: Topic.WEBINARS
      }),
    []
  );

  const { data, loading, error } = useQuery<
    { subject: SubjectWithCourses; klasses: ClassLite[] },
    IDVars
  >(GetOpenClassesQuery, {
    variables: { id: Topic.WEBINARS }
  });

  if (!data || !data.subject) {
    return <PreflightCheck loading={loading} error={error} />;
  }

  return (
    <Layout
      title={data.subject.name}
      description={data.subject.headline}
      image={data.subject.thumbnail}
    >
      <ContainerWrapper>
        <img src={data.subject.banner} alt={data.subject.name} />
        <header style={{ margin: '2rem 0', textAlign: 'center' }}>
          <Typography variant="h4">{data.subject.name} - Special!</Typography>
          <Typography variant="h6" color="textSecondary">
            {data.subject.headline}
          </Typography>
        </header>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: data.subject.blurb }}
          style={{ marginBottom: '2rem' }}
        />
        {data.subject.courses.map(course => (
          <WebinarDetails key={course.id} course={course}>
            {course.recording && <EmbedVideo src={course.recording} />}
            {data.klasses.map(k =>
              k.courseId === course.id ? <ClassListRow key={k.id} klass={k} /> : null
            )}
          </WebinarDetails>
        ))}
      </ContainerWrapper>
      <PromoBanner />
    </Layout>
  );
}
