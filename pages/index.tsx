import { useQuery } from '@apollo/react-hooks';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import { Topic } from 'common';
import React from 'react';
import CustomerSays from '../client/components/about/customer-says';
import ExplainPricing from '../client/components/about/explain-pricing';
import Impression from '../client/components/about/impression';
import InSchools from '../client/components/about/in-schools';
import PromoBanner from '../client/components/about/promo-banner';
import WhatWeDo from '../client/components/about/what-we-do';
import ClassListingCTA from '../client/components/class-listing-cta';
import Layout from '../client/components/layout';
import MainHeader from '../client/components/main-header';
import MainSection from '../client/components/main-section';
import NextMUIButton from '../client/components/next-mui-button';
import NextMUILink from '../client/components/next-mui-link';
import PreflightCheck from '../client/components/preflight-check';
import {
  SubjectListQuery,
  SubjectListQueryResult
} from '../client/graphql/catalog-queries';
import { getTopicLink } from '../client/lib/url-utils';
import { CLASSES, routeIds } from '../shared/constants';
import { useTranslation } from '../shared/i18n';

const useStyles = makeStyles(theme => ({
  title: {
    color: 'inherit',
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(4)
  },

  subtitle: {
    color: 'inherit',
    fontSize: '1.75rem',
    whiteSpace: 'pre-wrap'
  },
  grid: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4)
  },

  thumbnail: {
    backgroundColor: theme.palette.grey[100],
    boxShadow: theme.shadows[2],
    borderRadius: 8,
    overflow: 'hidden',
    display: 'block'
  },

  summary: {
    ...theme.typography.subtitle1,
    color: theme.palette.text.secondary,
    margin: '10px 0'
  }
}));

export default function Home() {
  const classes = useStyles({});
  const { t } = useTranslation(['common', 'home']);

  const { data, loading, error } = useQuery<SubjectListQueryResult>(
    SubjectListQuery
  );

  return (
    <Layout>
      <MainHeader>
        <Typography variant="h3" className={classes.title}>
          {t('home:main_header.title')}
        </Typography>
        <Typography variant="h4" className={classes.subtitle}>
          {t('home:main_header.subtitle', { joinArrays: '\n\r' })}
        </Typography>
        <ClassListingCTA label={t('cta.claim_free')} />
        <Impression />
      </MainHeader>
      <WhatWeDo />
      <MainSection
        id={CLASSES}
        header={
          <>
            <Typography variant="h4" gutterBottom>
              Explore Our Interactive Online Classes
            </Typography>
            <Typography variant="h6" color="primary">
              Try for FREE (no credit card required)
            </Typography>
          </>
        }
      >
        <Grid container justify="center" spacing={5}>
          {data ? (
            data.subjects.map(subject => {
              const linkProps =
                subject.id === Topic.WEBINARS
                  ? { href: routeIds.webinars }
                  : getTopicLink(subject.id);

              return (
                <Grid
                  key={subject.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={classes.grid}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    style={{ color: pink.A700 }}
                    gutterBottom
                  >
                    {subject.name}
                  </Typography>
                  <NextMUILink className={classes.thumbnail} next={linkProps}>
                    <img src={subject.thumbnail} alt={subject.name} />
                  </NextMUILink>

                  <Typography className={classes.summary}>
                    {subject.headline}
                  </Typography>
                  <NextMUIButton
                    color="primary"
                    variant="contained"
                    className="learn_enroll"
                    fullWidth
                    next={linkProps}
                  >
                    {t('cta.learn_enroll')}
                  </NextMUIButton>
                </Grid>
              );
            })
          ) : (
            <PreflightCheck error={error} loading={loading} />
          )}
        </Grid>
      </MainSection>
      <PromoBanner />
      <ExplainPricing />
      <InSchools includeVideo />
      <CustomerSays />
      <MainSection maxWidth="md" style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ marginBottom: 24 }}>
          Like It or Not, Our Kids Will Grow Up
        </Typography>
        <Typography variant="h6" color="textSecondary">
          And, it is up to us, as parents, to make sure, even if it seems far in the
          future, that when they do grow up, they are equipped with the skills needed
          to be successful in this new and ever changing world. But will they? That
          depends on the decisions YOU make today.
        </Typography>
        <ClassListingCTA label={t('cta.claim_free')} />
      </MainSection>
    </Layout>
  );
}
