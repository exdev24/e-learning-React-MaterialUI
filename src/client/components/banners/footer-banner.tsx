import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from '../../../shared/i18n';
import MainSection from '../main-section';
import ResponsiveCTA from './responsive-cta';

export default function FooterBanner(props: { stripe?: boolean }) {
  const { t } = useTranslation();

  return (
    <MainSection
      stripe={props.stripe}
      header={
        <>
          <Typography variant="h4" style={{ marginBottom: 24 }}>
            Like It or Not, Our Kids Will Grow Up
          </Typography>
          <Typography variant="h6" color="textSecondary">
            And, it is up to us, as parents, to make sure, even if it seems far in
            the future, that when they do grow up, they are equipped with the skills
            needed to be successful in this new and ever changing world. But will
            they? That depends on the decisions YOU make today.
          </Typography>
        </>
      }
    >
      <ResponsiveCTA classList>{t('cta.claim_free')}</ResponsiveCTA>
    </MainSection>
  );
}
