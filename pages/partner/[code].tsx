import { useQuery } from '@apollo/react-hooks';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import CourseDetails from '../../client/components/class-info/course-details-3p';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';
import PreflightCheck from '../../client/components/preflight-check';
import {
  PartnerQuery,
  PartnerQueryResult
} from '../../client/graphql/catalog-queries';
import { QueryArgs } from '../../types';

export default function PartnerPage(props: { code: string }) {
  const { data, loading, error } = useQuery<PartnerQueryResult, QueryArgs.Partner>(
    PartnerQuery,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        code: props.code
      }
    }
  );

  if (!data || !data.partner) {
    return <PreflightCheck loading={loading} error={error} />;
  }

  return (
    <Layout basic title={data.partner.name} image={data.partner.bannerImage}>
      <Container maxWidth="lg">
        <div
          style={{
            backgroundImage: `url("${data.partner.bannerImage}")`,
            backgroundSize: 'cover',
            paddingTop: '40%'
          }}
        />
      </Container>

      <MainSection
        maxWidth="lg"
        header={
          <>
            <Typography variant="h4">{data.partner.slogan}</Typography>
            <Typography variant="subtitle2">{data.partner.summary}</Typography>
          </>
        }
      >
        {data.partner.courses.map(course => (
          <CourseDetails
            key={course.id}
            course={course}
            klasses={course.upcomingClasses}
          />
        ))}
      </MainSection>
    </Layout>
  );
}
