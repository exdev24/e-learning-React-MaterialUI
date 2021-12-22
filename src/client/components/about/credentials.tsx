import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import MainSection from '../main-section';

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundImage: 'url(/images/celebrate.png)',
    backgroundPosition: 'top center',
    backgroundRepeat: 'repeat-x'
  },
  title: {
    fontFamily: "'Caveat', cursive",
    marginBottom: theme.spacing(3),
    color: 'rgb(237,168,7)'
  },
  bullets: {
    whiteSpace: 'pre-line'
  },
  logos: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    '&>div': {
      margin: theme.spacing(0, 1),
      '&>img': {
        height: 'auto',
        width: 'auto',
        maxHeight: '7vh',
        maxWidth: '18vw'
      }
    }
  }
}));

function Credentials() {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <MainSection
      className={classes.wrapper}
      header={
        <>
          <Typography variant="h2" className={classes.title}>
            {t('camp.headline')}
          </Typography>
          <Typography variant="h5" className={classes.bullets}>
            {t('credentials.bullets')}
          </Typography>
        </>
      }
    >
      <Typography variant="h5" align="center">
        {t('credentials.created_by')}
      </Typography>
      <div className={classes.logos}>
        <div style={{ padding: '4px 0' }}>
          <img
            src="https://cdn.create-learn.us/partners/google-logo-transparent.png"
            alt="Google"
          />
        </div>
        <div style={{ padding: '0 8px 8px 8px' }}>
          <img
            src="https://cdn.create-learn.us/partners/apple-logo-png-transparent.png"
            alt="Apple"
          />
        </div>
        <div>
          <img
            src="https://cdn.create-learn.us/partners/98cf7d6d899badc5d9752a12d6e97209.png"
            alt="Stanford University"
          />
        </div>
        <div style={{ padding: '0 8px' }}>
          <img
            src="https://cdn.create-learn.us/partners/harvard-logo-300x129.png"
            alt="Haravad University"
          />
        </div>
      </div>
    </MainSection>
  );
}

export default React.memo(Credentials);
