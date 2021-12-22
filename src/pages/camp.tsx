import { useQuery } from '@apollo/react-hooks';
import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Credentials from '../client/components/about/credentials';
import CustomerSays from '../client/components/about/customer-says';
import InSchools from '../client/components/about/in-schools';
import ResponsiveCTA from '../client/components/banners/responsive-cta';
import CourseDetailsCamp from '../client/components/class-info/course-details-camp';
import Layout from '../client/components/layout';
import MainSection from '../client/components/main-section';
import PreflightCheck from '../client/components/preflight-check';
import Membership from '../client/components/squeeze/memebership';
import {
  CourseListQuery,
  CourseListResult
} from '../client/graphql/catalog-queries';
import { logPageView } from '../client/lib/analytics';
import { CLASSES, salesList } from '../shared/constants';
import { useTranslation } from '../shared/i18n';
import { QueryArgs } from '../types';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('xs')]: {
      backgroundImage: 'url(https://cdn.create-learn.us/images/camp-mobile.png)',
      height: '75vw'
    },
    [theme.breakpoints.only('sm')]: {
      backgroundImage: 'url(https://cdn.create-learn.us/images/camp-mobile.png)',
      paddingTop: 450
    },
    [theme.breakpoints.up('md')]: {
      backgroundImage: 'url(https://cdn.create-learn.us/images/camp.png)',
      paddingTop: '30%'
    }
  },
  upper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  lower: {
    position: 'absolute',
    left: 0,
    right: 0,
    [theme.breakpoints.only('xs')]: {
      bottom: theme.spacing(3)
    },
    [theme.breakpoints.only('sm')]: {
      bottom: theme.spacing(4)
    },
    [theme.breakpoints.up('md')]: {
      right: '38%',
      bottom: theme.spacing(5)
    }
  }
}));

const title = 'Fun Interactive Online Camps';

export default function CampPage() {
  const classes = useStyles();
  const { t } = useTranslation();

  React.useEffect(() => logPageView('Camp'), []);

  const { data, loading, error } = useQuery<
    CourseListResult,
    QueryArgs.Courses & { camps: boolean }
  >(CourseListQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      ids: salesList,
      camps: true
    }
  });

  if (!data) {
    return <PreflightCheck loading={loading} error={error} />;
  }

  return (
    <Layout
      title={title}
      image="https://d5i19g0fn6omf.cloudfront.net/uploads/blog-post/fxqrEP7Z.png"
    >
      <header className={classes.header}>
        <div className={classes.upper}>
          <Typography variant="h2">Fun Online Camps</Typography>
        </div>
        <div className={classes.lower}>
          <ResponsiveCTA classList>{t('camp.sale')}</ResponsiveCTA>
        </div>
      </header>
      <Credentials />
      <MainSection
        id={CLASSES}
        header={
          <>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="h6" color="textSecondary">
              Top-quality Curriculum, Experienced Teachers, Small 2-4 Student Class
            </Typography>
            <Typography variant="subtitle2">
              {
                'Online camps meet multiple times a week via video conferencing. We offer satisfaction guarantees. Additional discounts are available for groups of 3 or more.'
              }
            </Typography>
            <Typography variant="subtitle1" color="primary">
              New camps will be added twice a week.
            </Typography>
          </>
        }
      >
        {data.courses.map(course => (
          <CourseDetailsCamp key={course.id} course={course} />
        ))}
      </MainSection>
      <Membership />
      <CustomerSays stripe />
      <InSchools includeVideo={false} />
    </Layout>
  );
}
