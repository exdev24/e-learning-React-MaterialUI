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
  const result = useQuery<PartnerQueryResult, QueryArgs.Partner>(PartnerQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      code: props.code
    }
  });

  if (!result.data) {
    return <PreflightCheck loading={result.loading} error={result.error} />;
  }

  const { partner } = result.data;
  if (!partner) {
    return <PreflightCheck statusCode={404} />;
  }

  return (
    <Layout basic title={partner.name} image={partner.bannerImage}>
      <Container maxWidth="lg">
        <div
          style={{
            backgroundImage: `url("${partner.bannerImage}")`,
            backgroundSize: 'cover',
            paddingTop: '40%'
          }}
        />
      </Container>

      <MainSection
        maxWidth="lg"
        header={
          <>
            <Typography variant="h4">{partner.slogan}</Typography>
            <Typography variant="subtitle2">{partner.summary}</Typography>
          </>
        }
      >
        {partner.courses.map(course => (
          <CourseDetails
            key={course.id}
            course={course}
            themeColor={partner.themeColor}
            klasses={course.upcomingClasses}
          />
        ))}
      </MainSection>
    </Layout>
  );
}
