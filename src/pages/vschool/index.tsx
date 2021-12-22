import { Typography } from '@material-ui/core';
import React from 'react';
import InSchools from '../../client/components/about/in-schools';
import FooterBanner from '../../client/components/banners/footer-banner';
import HeaderBanner from '../../client/components/banners/header-banner';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';
import CourseListing from '../../client/components/squeeze/course-listing';
import ViewSchedule from '../../client/components/squeeze/view-schedule';
import { logPageView } from '../../client/lib/analytics';
import { CLASSES, trialList } from '../../shared/constants';
import { useTranslation } from '../../shared/i18n';

const title = "Power Up Your Child's Future";

export default function VSchool(props: { cid?: string }) {
  const { t } = useTranslation();

  React.useEffect(
    () =>
      logPageView('SqueezePage', {
        variant: 'school closure'
      }),
    []
  );

  if (props.cid) {
    return <ViewSchedule cid={props.cid} />;
  }

  return (
    <Layout basic title={title} chatWidget>
      <div style={{ height: '36vw', minHeight: 360, maxHeight: 480 }}>
        <HeaderBanner title={title} />
      </div>
      <MainSection
        id={CLASSES}
        header={
          <Typography variant="h5" color="textSecondary">
            {t('credentials.created_by')}
          </Typography>
        }
      >
        <CourseListing
          courseIds={trialList}
          cta={t('cta.check_schedule_enroll_trial')}
        />
      </MainSection>
      <InSchools stripe includeVideo={false} />
      <FooterBanner />
    </Layout>
  );
}
