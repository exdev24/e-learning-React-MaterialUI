import { Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { siteSquareLogoUrl, socialLinks } from 'common';
import React from 'react';
import { contactEmail, routeIds } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import Blog from '../../social/blog';
import Facebook from '../../social/facebook';
import Twitter from '../../social/twitter';
import Youtube from '../../social/youtube';
import ContainerWrapper from '../container-wrapper';
import ExternalLink from '../external-link';
import HorizontalDivider from '../horizontal-divider';
import NextMUILink from '../next-mui-link';

const useStyles = makeStyles(theme => ({
  footer: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary[500]
  },

  footRight: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      textAlign: 'right'
    }
  },

  footLeft: {
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      textAlign: 'left'
    }
  },

  socialLink: {
    margin: '0 1em',
    color: theme.palette.common.white,
    '&>svg': {
      width: 20,
      height: 20
    }
  },

  footerLink: {
    ...theme.typography.body2,
    color: theme.palette.common.white,
    '&:after': {
      content: '"|"',
      margin: '0 10px'
    },
    '&:last-of-type:after': {
      display: 'none'
    }
  }
}));

export default function SiteFooter() {
  const classes = useStyles({});
  const { t } = useTranslation();

  return (
    <ContainerWrapper className={classes.footer}>
      <Grid container>
        <Grid item xs={4} className={classes.footLeft}>
          <img height={28} src={siteSquareLogoUrl} alt={t('site_name')} />
        </Grid>
        <Grid item xs={8} className={classes.footRight}>
          <ExternalLink href={socialLinks.facebook} className={classes.socialLink}>
            <Facebook />
          </ExternalLink>
          <ExternalLink href={socialLinks.twitter} className={classes.socialLink}>
            <Twitter />
          </ExternalLink>
          <ExternalLink href={socialLinks.youtube} className={classes.socialLink}>
            <Youtube />
          </ExternalLink>
          <ExternalLink href={socialLinks.blog} className={classes.socialLink}>
            <Blog />
          </ExternalLink>
        </Grid>
      </Grid>
      <HorizontalDivider />
      <Grid container>
        <Grid item xs={12} md={4} className={classes.footLeft}>
          <span className={classes.footerLink}>© 2020 {t('site_name')}</span>
        </Grid>
        <Grid item xs={12} md={8} className={classes.footRight}>
          <NextMUILink className={classes.footerLink} next={{ href: routeIds.tos }}>
            {t('menu.tos')}
          </NextMUILink>

          <NextMUILink
            className={classes.footerLink}
            next={{ href: routeIds.privacy }}
          >
            {t('menu.privacy')}
          </NextMUILink>
          <NextMUILink
            className={classes.footerLink}
            next={{ href: routeIds.career }}
          >
            {t('menu.jobs')}
          </NextMUILink>
          <NextMUILink
            className={classes.footerLink}
            next={{ href: routeIds.about }}
          >
            {t('menu.about')}
          </NextMUILink>
          <Link className={classes.footerLink} href={`mailto:${contactEmail}`}>
            {contactEmail}
          </Link>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
}
