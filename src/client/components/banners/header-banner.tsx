import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { defaultBannerUrl } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import ResponsiveCTA from './responsive-cta';
import ResponsiveTitle from './responsive-title';
import Impression from '../about/impression';

const useStyles = makeStyles(theme => ({
  main: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundImage: `url(${defaultBannerUrl})`,
    backgroundSize: 'cover',
    height: '100%',
    color: theme.palette.common.white
  },
  bullets: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2)
    }
  }
}));

export default function HeaderBanner(props: { title: string }) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <ResponsiveTitle text={props.title} />
      <Typography variant="h5" className={classes.bullets}>
        {t('main_header.subtitle1')}
        <br />
        {t('main_header.subtitle2')}
        <br />
        {t('main_header.subtitle3')}
      </Typography>
      <ResponsiveCTA classList>{t('cta.claim_free')}</ResponsiveCTA>
      <Impression />
    </div>
  );
}
