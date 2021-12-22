import { Grid, GridProps } from '@material-ui/core';
import React from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { twitterHandle } from '../../shared/constants';
import { logEvent } from '../lib/analytics';

interface Props extends GridProps {
  url: string;
  placeholder: string;
  actionLabel: string;
  avatarSize?: number;
  children?: React.ReactNode;
}

export default function SocialBar({
  children,
  url,
  placeholder,
  actionLabel,
  avatarSize,
  ...gridProps
}: Props) {
  const size = avatarSize || 32;

  return (
    <Grid spacing={2} container {...gridProps}>
      {children && (
        <Grid item xs="auto">
          {children}
        </Grid>
      )}
      <Grid item xs="auto">
        <FacebookShareButton
          url={url}
          quote={placeholder}
          onClick={() =>
            logEvent('Share', {
              label: actionLabel,
              variant: 'Facebook'
            })
          }
        >
          <FacebookIcon size={size} round />
        </FacebookShareButton>
      </Grid>
      <Grid item xs="auto">
        <TwitterShareButton
          url={url}
          title={placeholder}
          via={twitterHandle}
          onClick={() =>
            logEvent('Share', {
              label: actionLabel,
              variant: 'Twitter'
            })
          }
        >
          <TwitterIcon size={size} round />
        </TwitterShareButton>
      </Grid>
      <Grid item xs="auto">
        <WhatsappShareButton
          url={url}
          title={placeholder}
          onClick={() =>
            logEvent('Share', {
              label: actionLabel,
              variant: 'Whatsapp'
            })
          }
        >
          <WhatsappIcon size={size} round />
        </WhatsappShareButton>
      </Grid>
    </Grid>
  );
}
