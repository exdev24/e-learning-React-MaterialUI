import { DialogContent } from '@material-ui/core';
import React from 'react';
import ModalWrapper from '../modal-wrapper';
import SocialBar from '../social-bar';
import { Project } from '../../graphql/data-models';
import { getSiteUrl } from '../../lib/url-utils';
import { routePrefixes } from '../../../shared/constants';

interface ModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export default function SharePortfolioModal(props: ModalProps) {
  return (
    <ModalWrapper
      maxWidth="sm"
      fullWidth
      open={props.open}
      onClose={props.onClose}
      title="Share this Project"
    >
      <DialogContent style={{ padding: 24 }}>
        <SocialBar
          url={getSiteUrl(routePrefixes.project + props.project.id)}
          placeholder={`Checkout this cool project ${props.project.title}`}
          actionLabel="project"
          justify="space-around"
          avatarSize={60}
        />
      </DialogContent>
    </ModalWrapper>
  );
}
