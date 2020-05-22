import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { ReferralCredits, Topic } from 'common';
import Head from 'next/head';
import React from 'react';
import { CLASSES, routeIds, routePrefixes } from '../../shared/constants';
import { useTranslation } from '../../shared/i18n';
import { AccountContext } from '../context/account';
import { Course } from '../graphql/data-models';
import { logEvent } from '../lib/analytics';
import { getReferralUrl, getSiteUrl } from '../lib/url-utils';
import NextMUIButton from './next-mui-button';
import NextMUILink from './next-mui-link';
import SocialBar from './social-bar';
import TextToCopy from './text-to-copy';

const useStyles = makeStyles(theme => ({
  image: {
    width: '100%',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },

  headline: {
    fontFamily: "'Caveat', cursive",
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(4, 0),
    textAlign: 'center'
  },

  hero: {
    fontWeight: theme.typography.fontWeightBold,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(4)
  }
}));

const creditText = '$' + ReferralCredits.signup / 100;
const shareAction = 'PostClass';

interface Props {
  course: Course;
}

export default function PostEnrollmentShare({ course }: Props) {
  const classes = useStyles({});
  const { user } = React.useContext(AccountContext);
  const { t } = useTranslation();

  const shareUrl = user
    ? getReferralUrl(user.referralCode)
    : getSiteUrl(routePrefixes.topic + course.subjectId);

  const shareCopy = `I just signed up ${course.name}. I'm sharing a ${creditText} credit so you can try it too.`;

  return (
    <>
      <Head>
        <link
          key="font-Caveat"
          href="https://fonts.googleapis.com/css?family=Caveat&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box textAlign="center" px={4} py={2}>
        <Typography variant="h4" gutterBottom>
          A Confirmation Message Just Arrived to Your Inbox
        </Typography>
        <Typography variant="subtitle1">
          <NextMUILink next={{ href: routeIds.account }} color="secondary">
            Click here
          </NextMUILink>
          {' to view your account page and scheduling details.'}
        </Typography>
      </Box>
      {course.subjectId === Topic.WEBINARS ? (
        <Grid
          container
          alignItems="center"
          spacing={6}
          style={{ marginTop: 32, marginBottom: 32 }}
        >
          <Grid item xs={12} sm={6}>
            <Box textAlign="center">
              <Typography variant="h4">
                Check Out Out Online Small Group Fun Coding Classes
              </Typography>

              <SocialBar
                url={shareUrl}
                placeholder={shareCopy}
                avatarSize={40}
                actionLabel={shareAction}
                justify="center"
                style={{ margin: '16px 0' }}
              />

              <NextMUIButton
                variant="contained"
                color="primary"
                size="large"
                next={{ href: { pathname: '/', hash: CLASSES } }}
              >
                Try For Free
              </NextMUIButton>
            </Box>
          </Grid>
          <Grid item md={6}>
            <img className={classes.image} src="/images/k12-logo1.png" />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          alignItems="center"
          style={{ marginTop: 32, marginBottom: 32 }}
        >
          <Grid item md={5}>
            <img
              className={classes.image}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Box px={4}>
              <div className={classes.hero}>
                <Typography
                  variant="h6"
                  color="textPrimary"
                  style={{ fontWeight: 'inherit' }}
                >
                  {t('site_name')}
                </Typography>
                <Typography
                  variant="h3"
                  gutterBottom={true}
                  style={{
                    fontWeight: 'inherit',
                    color: 'red'
                  }}
                >
                  Share with Friends
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  style={{ fontWeight: 'inherit' }}
                >
                  GIVE {creditText} - GET {creditText}
                </Typography>
              </div>

              <SocialBar
                url={shareUrl}
                placeholder={shareCopy}
                avatarSize={48}
                actionLabel={shareAction}
                spacing={4}
                justify="center"
              />

              <Typography
                color="textPrimary"
                variant="h5"
                className={classes.headline}
              >
                Refer a friend with your personalized link
              </Typography>
              <TextToCopy
                content={shareUrl}
                onCopy={() => {
                  logEvent('Share', {
                    label: shareAction,
                    variant: 'CopyCode'
                  });
                }}
              />
            </Box>
            <Box mt={4} textAlign="center">
              <NextMUIButton
                variant="contained"
                color="primary"
                size="large"
                next={{ href: { pathname: '/', hash: CLASSES } }}
              >
                View More Classes
              </NextMUIButton>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
