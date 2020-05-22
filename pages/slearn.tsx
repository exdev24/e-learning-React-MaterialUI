import { Typography } from '@material-ui/core';
import React from 'react';
import Impression from '../client/components/about/impression';
import InSchools from '../client/components/about/in-schools';
import ClassListingCTA from '../client/components/class-listing-cta';
import Layout from '../client/components/layout';
import MainHeader from '../client/components/main-header';
import MainSection from '../client/components/main-section';
import CourseListing from '../client/components/squeeze/course-listing';
import Membership from '../client/components/squeeze/memebership';
import ViewSchedule from '../client/components/squeeze/view-schedule';
import { logPageView } from '../client/lib/analytics';
import { CLASSES, trialList } from '../shared/constants';
import { useTranslation } from '../shared/i18n';

const title = "Power Up Your Child's Future";

export default function Slearn(props: { cid?: string }) {
  const { t } = useTranslation(['common', 'squeeze']);

  React.useEffect(
    () =>
      logPageView('SqueezePage', {
        variant: 'free trial'
      }),
    []
  );

  if (props.cid) {
    return <ViewSchedule cid={props.cid} />;
  }

  return (
    <Layout basic title={title}>
      <MainHeader>
        <Typography variant="h3" color="inherit" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" color="inherit">
          Explore Latest Technologies
          <br />
          See Real World Applications
          <br />
          Develop Creativity
        </Typography>
        <ClassListingCTA label={t('cta.claim_free')} />
        <Impression />
      </MainHeader>
      <MainSection
        id={CLASSES}
        header={
          <Typography variant="h5" color="textSecondary">
            {t('squeeze:credentials_headline')}
          </Typography>
        }
      >
        <CourseListing
          courseIds={trialList}
          cta="Check Schedule & Enroll for Free"
        />
      </MainSection>
      <Membership />
      <InSchools includeVideo={false} />
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
