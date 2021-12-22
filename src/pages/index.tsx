import { useQuery } from '@apollo/react-hooks';
import { Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import React from 'react';
import Credentials from '../client/components/about/credentials';
import CustomerSays from '../client/components/about/customer-says';
import InSchools from '../client/components/about/in-schools';
import WhatWeDo from '../client/components/about/what-we-do';
import FooterBanner from '../client/components/banners/footer-banner';
import MainCarousel from '../client/components/banners/main-carousel';
import ThumbnailNavItem from '../client/components/class-info/thumbnail-nav-item';
import Layout from '../client/components/layout';
import MainSection from '../client/components/main-section';
import {
  SubjectListQuery,
  SubjectListQueryResult
} from '../client/graphql/catalog-queries';
import { getTopicLink } from '../client/lib/url-utils';
import { CLASSES } from '../shared/constants';
import { useTranslation } from '../shared/i18n';

const gradeOptions: { [key: string]: [number, number] } = {
  all: [1, 12],
  sm: [2, 3],
  md: [4, 5],
  lg: [6, 9]
};

export default function Home() {
  const { t } = useTranslation();
  const [grades, setGrades] = React.useState(gradeOptions.all);

  const result = useQuery<SubjectListQueryResult>(SubjectListQuery);
  const subjects = result.data?.subjects.filter(
    item => item && item.grades[0] <= grades[1] && item.grades[1] >= grades[0]
  );

  return (
    <Layout>
      <MainCarousel />
      <Credentials />
      <MainSection
        id={CLASSES}
        stripe
        header={
          <>
            <Typography variant="h4" gutterBottom>
              {t('course_list.title')}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {t('course_list.subtitle')}
            </Typography>
            <TextField
              select
              variant="outlined"
              label="Filter by Grades"
              size="small"
              style={{ width: 240 }}
              defaultValue="all"
              onChange={evt => setGrades(gradeOptions[evt.target.value])}
            >
              <MenuItem value="all">&nbsp;</MenuItem>
              {['sm', 'md', 'lg'].map(val => (
                <MenuItem value={val} key={val}>
                  Grades {gradeOptions[val].join(' - ')}
                </MenuItem>
              ))}
            </TextField>
          </>
        }
      >
        <Grid container justify="center" spacing={5}>
          {subjects &&
            subjects.map(subject => (
              <Grid key={subject.id} item xs={12} sm={6} md={4}>
                <ThumbnailNavItem
                  title={subject.name}
                  subtitle={subject.headline}
                  grades={subject.grades}
                  thumbnail={subject.thumbnail}
                  linkLabel={t('cta.learn_enroll')}
                  linkProps={getTopicLink(subject.id)}
                />
              </Grid>
            ))}
        </Grid>
      </MainSection>
      <WhatWeDo />
      <CustomerSays stripe />
      <InSchools includeVideo />
      <FooterBanner stripe />
    </Layout>
  );
}
