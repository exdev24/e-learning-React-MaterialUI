import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import ResponsiveCTA from '../banners/responsive-cta';
import MainSection from '../main-section';

interface Highlight {
  title: string;
  icon: string;
  description: string;
}

function TalkingPoints() {
  const { t } = useTranslation(['squeeze', 'common']);

  const bullets: Highlight[] = [
    {
      title: t('highlights.state_of_art.title'),
      description: t('highlights.state_of_art.description'),
      icon: '/images/robot.jpg'
    },
    {
      title: t('highlights.real_world.title'),
      description: t('highlights.real_world.description'),
      icon: '/images/self-driving.jpg'
    },
    {
      title: t('highlights.life_skills.title'),
      description: t('highlights.life_skills.description'),
      icon: '/images/AdobeStock_167189088.jpeg'
    }
  ];

  return (
    <MainSection
      header={
        <Typography variant="h4" color="textPrimary">
          {t('highlights.headline')}
        </Typography>
      }
    >
      <Grid container spacing={4}>
        {bullets.map((bullet, idx) => (
          <Grid key={idx} item xs={12} md={4}>
            <div style={{ margin: '0 auto', maxWidth: 300 }}>
              <div style={{ backgroundColor: '#f4f4f4', padding: 8 }}>
                <img
                  style={{ width: '100%', border: '4px solid white' }}
                  src={bullet.icon}
                  alt={bullet.title}
                />
              </div>
              <Typography
                variant="h6"
                color="textPrimary"
                align="center"
                style={{ marginTop: 16, marginBottom: 8 }}
              >
                {bullet.title}
              </Typography>
              <Typography color="textSecondary" paragraph align="center">
                {bullet.description}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
      <ResponsiveCTA classList>{t('cta.claim_free')}</ResponsiveCTA>
    </MainSection>
  );
}

export default React.memo(TalkingPoints);
