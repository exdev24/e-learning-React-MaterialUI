import {
  Accordion,
  AccordionSummary,
  Container,
  Grid,
  Link,
  makeStyles,
  Typography
} from '@material-ui/core';
import { siteSquareLogoUrl, socialLinks } from 'cl-common';
import React from 'react';
import { contactEmail, routeIds } from '../../../shared/constants';
import { useTranslation } from '../../../shared/i18n';
import Blog from '../../social/blog';
import Facebook from '../../social/facebook';
import Twitter from '../../social/twitter';
import Youtube from '../../social/youtube';
import ExternalLink from '../external-link';
import HorizontalDivider from '../horizontal-divider';
import NextMUILink from '../next-mui-link';

const useStyles = makeStyles(theme => ({
  footer: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary[500],
    padding: theme.spacing(6, 0)
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
  },

  contact: {
    width: 320,
    height: 320,
    margin: 0,
    padding: 0
  }
}));

export default function SiteFooter() {
  const classes = useStyles();
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <footer className={classes.footer}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm="auto" className={classes.footLeft}>
            <Accordion
              elevation={0}
              expanded={expanded}
              onChange={(evt, value) => setExpanded(value)}
            >
              <AccordionSummary
                style={{ minHeight: 24, paddingLeft: 8, paddingRight: 8 }}
              >
                <Typography variant="subtitle1" align="center">
                  Keep in Touch
                </Typography>
              </AccordionSummary>
              <iframe
                frameBorder="0"
                onClick={() => setExpanded(true)}
                className={classes.contact}
                src="https://cdn.forms-content.sg-form.com/2dd247a7-b671-11ea-a35c-b6b786accf2b"
              />
            </Accordion>
          </Grid>
          <Grid item xs={12} sm className={classes.footRight}>
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} className={classes.footLeft}>
            <img height={28} src={siteSquareLogoUrl} alt={t('site_name')} />
          </Grid>
          <Grid item xs={12} md={8} className={classes.footRight}>
            <NextMUILink
              className={classes.footerLink}
              next={{ href: routeIds.tos }}
              title={t('menu.tos')}
            >
              {t('menu.tos')}
            </NextMUILink>

            <NextMUILink
              className={classes.footerLink}
              next={{ href: routeIds.privacy }}
              title={t('menu.privacy')}
            >
              {t('menu.privacy')}
            </NextMUILink>
            <NextMUILink
              className={classes.footerLink}
              next={{ href: routeIds.career }}
              title={t('menu.jobs')}
            >
              {t('menu.jobs')}
            </NextMUILink>
            <NextMUILink
              className={classes.footerLink}
              next={{ href: routeIds.about }}
              title={t('menu.about')}
            >
              {t('menu.about')}
            </NextMUILink>
            <Link className={classes.footerLink} href={`mailto:${contactEmail}`}>
              {contactEmail}
            </Link>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
