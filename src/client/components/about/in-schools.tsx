import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import EmbedVideo from '../embed-video';
import ExternalLink from '../external-link';
import MainSection from '../main-section';

const schools = [
  {
    name: 'Lucille Nixon',
    shoutout: '#9 Elementary School in California',
    url: 'https://www.niche.com/k12/lucille-m-nixon-elementary-school-stanford-ca/',
    logo: 'https://cdn.create-learn.us/partners/nixontop.jpg'
  },
  {
    name: 'El Carmelo',
    shoutout: '#1 Elementary School in California',
    url: 'https://www.niche.com/k12/el-carmelo-elementary-school-palo-alto-ca/',
    logo: 'https://cdn.create-learn.us/partners/elcarmelologoweb.png'
  },
  {
    name: 'Escondido',
    shoutout: '#11 Elementary School in California',
    url: 'https://www.niche.com/k12/escondido-elementary-school-stanford-ca/',
    logo: 'https://cdn.create-learn.us/partners/escondido.jpg'
  },
  {
    name: 'Hoover',
    shoutout: '#8 Elementary School in California',
    url: 'https://www.niche.com/k12/herbert-hoover-elementary-school-palo-alto-ca/',
    logo: 'https://cdn.create-learn.us/partners/hoover.jpg'
  }
];

const useStyles = makeStyles(theme => ({
  logo: {
    overflow: 'hidden',
    '&>img': {
      width: '100%',
      maxHeight: '100%'
    }
  },

  squareBox: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 96,
    margin: '15px auto',
    '&:before': {
      content: '""',
      display: 'block',
      paddingTop: '100%'
    },
    '& $logo': {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },

  title: {
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: 'center',
    margin: theme.spacing(2, 0)
  },

  quote: {
    textAlign: 'center',
    color: theme.palette.text.hint
  }
}));

export default function InSchools(props: {
  includeVideo: boolean;
  stripe?: boolean;
}) {
  const { t } = useTranslation();
  const classes = useStyles();

  const items = schools.map((school, idx) => (
    <Grid item xs={6} sm={3} lg={props.includeVideo ? 6 : 3} key={idx}>
      <div className={classes.squareBox}>
        <ExternalLink className={classes.logo} href={school.url}>
          <img src={school.logo} alt={school.name} />
        </ExternalLink>
      </div>
      <blockquote className={classes.quote}>
        <ExternalLink
          variant="subtitle1"
          color="textPrimary"
          href={school.url}
          title={school.name}
          style={{
            display: 'block',
            whiteSpace: 'nowrap'
          }}
        >
          {school.name}
        </ExternalLink>
        <small>{school.shoutout}</small>
      </blockquote>
    </Grid>
  ));

  return (
    <MainSection
      stripe={props.stripe}
      header={
        <>
          <Typography variant="h4" gutterBottom>
            {t('schools.title')}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {t('schools.subtitle')}
          </Typography>
        </>
      }
    >
      {props.includeVideo ? (
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} lg={8}>
            <EmbedVideo src="https://www.youtube-nocookie.com/embed/3Ky275El3qo" />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container>{items}</Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={4}>
          {items}
        </Grid>
      )}
    </MainSection>
  );
}
