import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { ReferralCredits, Topic } from 'cl-common';
import React from 'react';
import { CLASSES, routePrefixes } from '../../shared/constants';
import { useTranslation } from '../../shared/i18n';
import { AccountContext } from '../context/account';
import { Course } from '../graphql/data-models';
import { logEvent } from '../lib/analytics';
import { getReferralUrl, getSiteUrl } from '../lib/url-utils';
import NextMUIButton from './next-mui-button';
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

const shareAction = 'PostClass';

interface Props {
  course: Course;
}

export default function PostEnrollmentShare({ course }: Props) {
  const classes = useStyles({});
  const { user } = React.useContext(AccountContext);
  const { t } = useTranslation(['checkout', 'common']);

  const shareUrl = user
    ? getReferralUrl(user.referralCode)
    : getSiteUrl(routePrefixes.topic + course.subjectId);

  const shareCopy = t('share.social', {
    name: course.name,
    credit: ReferralCredits.signup / 100
  });

  const cta = (
    <NextMUIButton
      variant="contained"
      color="primary"
      size="large"
      next={{ href: { pathname: '/', hash: CLASSES } }}
    >
      {t('common:cta.learn_more')}
    </NextMUIButton>
  );

  return (
    <>
      <Box textAlign="center" px={4} py={2}>
        <Typography variant="h4" gutterBottom>
          {t('confirmation.title')}
        </Typography>
        <Typography variant="subtitle1">{t('confirmation.subtitle')}</Typography>
      </Box>
      {course.subjectId === Topic.WEBINARS ? (
        <Grid
          container
          alignItems="center"
          spacing={6}
          style={{ marginTop: 32, marginBottom: 32 }}
        >
          <Grid item xs={12} sm={6}>
            <Typography align="center" variant="h4">
              {t('confirmation.upsale')}
            </Typography>
            <Box my={4} textAlign="center">
              {cta}
            </Box>

            <SocialBar
              url={shareUrl}
              placeholder={shareCopy}
              avatarSize={40}
              actionLabel={shareAction}
              justify="center"
            />
          </Grid>
          <Grid item md={6}>
            <img
              className={classes.image}
              src="/images/k12-logo1.png"
              alt="About Create and Learn"
            />
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
              src="https://cdn.create-learn.us/images/Share-with-friends-min.png"
              alt="Share with friends"
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
                  {t('common:site_name')}
                </Typography>
                <Typography
                  variant="h3"
                  gutterBottom={true}
                  style={{
                    fontWeight: 'inherit',
                    color: 'red'
                  }}
                >
                  {t('share.title')}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  style={{ fontWeight: 'inherit' }}
                >
                  {t('share.give_get', { credit: ReferralCredits.signup / 100 })}
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
                {t('share.refer')}
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
              {cta}
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
