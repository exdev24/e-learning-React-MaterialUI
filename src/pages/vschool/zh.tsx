import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import Credentials from '../../client/components/about/credentials';
import CustomerSays from '../../client/components/about/customer-says';
import InSchools from '../../client/components/about/in-schools';
import HeaderBanner from '../../client/components/banners/header-banner';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';
import CourseListing from '../../client/components/squeeze/course-listing';
import ViewSchedule from '../../client/components/squeeze/view-schedule';
import { logPageView } from '../../client/lib/analytics';
import { CLASSES, trialList } from '../../shared/constants';

export default function VSchoolZH(props: { cid?: string }) {
  React.useEffect(
    () =>
      logPageView('SqueezePage', {
        variant: 'China Promo'
      }),
    []
  );

  if (props.cid) {
    return <ViewSchedule cid={props.cid} />;
  }

  return (
    <Layout title="来自硅谷的免费计算机课程">
      <div style={{ height: '36vw', minHeight: 360, maxHeight: 480 }}>
        <HeaderBanner title="新一代计算机课程" />
      </div>
      <Credentials />
      <MainSection
        id={CLASSES}
        header={
          <Typography variant="h4" color="textPrimary">
            请根据年龄兴趣，即刻选择免费体验课程
          </Typography>
        }
      >
        <CourseListing courseIds={trialList} cta="选择课程时间" />
      </MainSection>
      <InSchools stripe includeVideo={false} />
      <MainSection>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
              获取最新信息可扫码关注
            </Typography>
            <img
              style={{ width: 256, display: 'block', margin: '0 auto' }}
              src="/images/wxqr.jpeg"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              {
                '硅谷科创营由Google(谷歌)，Uber(优步)早期技术和产品高管创办，团队成员毕业于斯坦福大学。学生已经遍布美国，加拿大。新春之际，因国内走亲访友不便，特意增加了面向中国的免费课程。希望我们的课程能给许多小朋友增加春节的快乐'
              }
            </Typography>
          </Grid>
        </Grid>
      </MainSection>
      <CustomerSays stripe />
    </Layout>
  );
}
