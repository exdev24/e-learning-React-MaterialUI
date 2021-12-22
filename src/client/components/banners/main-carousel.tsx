import { makeStyles, Typography } from '@material-ui/core';
import { Topic } from 'cl-common';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { routeIds } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import { getTopicLink } from '../../lib/url-utils';
import HeaderBanner from './header-banner';
import ResponsiveCTA from './responsive-cta';
import ResponsiveTitle from './responsive-title';

const useStyles = makeStyles(theme => ({
  wrapper: {
    '& ul.control-dots': {
      padding: 0,
      '&>.dot': {
        width: 10,
        height: 10
      }
    },
    '& li.slide': {
      backgroundColor: theme.palette.background.default,
      height: 320,
      [theme.breakpoints.up('md')]: {
        height: '40vw',
        maxHeight: 540
      },
      '&>div': {
        color: theme.palette.common.white,
        padding: theme.spacing(3),
        height: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    }
  },

  camp: {
    backgroundImage: 'url(https://cdn.create-learn.us/images/hero-summer-camp.png)',
    backgroundSize: 'cover',
    position: 'relative'
  },

  campContent: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      paddingRight: '10vw'
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: '25vw'
    }
  },

  open: {
    backgroundImage: 'url(https://cdn.create-learn.us/images/hero-open-class.png)',
    backgroundSize: 'cover'
  },

  openContent: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
    [theme.breakpoints.up('sm')]: {
      paddingRight: '10vw'
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: '25vw'
    }
  },

  openSubheader: {
    backgroundColor: 'rgb(31,100,195)',
    borderRadius: 5,
    marginTop: 16,
    padding: '0 8px'
  }
}));

export default function MainHeaderCarousel() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Carousel
      className={classes.wrapper}
      showThumbs={false}
      showStatus={false}
      autoPlay
      infiniteLoop
    >
      <HeaderBanner title={t('main_header.title')} />
      <div className={classes.camp}>
        <div className={classes.campContent}>
          <Typography
            variant="h3"
            style={{
              fontFamily: "'Caveat', cursive",
              color: 'rgb(254,217,72)'
            }}
          >
            {t('camp.headline')}
          </Typography>
          <ResponsiveTitle text={t('camp.promo')} />
          <Typography variant="h5" style={{ marginTop: 24 }}>
            {t('camp.sale')}
          </Typography>
          <ResponsiveCTA next={{ href: routeIds.camp }}>
            {t('cta.learn_more')}
          </ResponsiveCTA>
        </div>
      </div>
      <div className={classes.open}>
        <div className={classes.openContent}>
          <ResponsiveTitle text="Online Open Classes" />
          <div className={classes.openSubheader}>
            <Typography variant="h6">Fun Events with Tech Experts</Typography>
          </div>
          <ResponsiveCTA next={getTopicLink(Topic.WEBINARS)}>
            {t('cta.learn_more')}
          </ResponsiveCTA>
        </div>
      </div>
    </Carousel>
  );
}
