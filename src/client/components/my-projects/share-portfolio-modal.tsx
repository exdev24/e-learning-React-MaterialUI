import { DialogContent } from '@material-ui/core';
import React from 'react';
import ModalWrapper from '../modal-wrapper';
import SocialBar from '../social-bar';
import { Student } from '../../graphql/data-models';
import { getSiteUrl } from '../../lib/url-utils';
import { routePrefixes } from '../../../shared/constants';

interface ModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export default function SharePortfolioModal(props: ModalProps) {
  const makerUrl = getSiteUrl(routePrefixes.maker + props.student.id);
  const placeholder = `Share ${props.student.name}'s portfolio on Create & Learn`;

  return (
    <ModalWrapper
      maxWidth="sm"
      fullWidth
      open={props.open}
      onClose={props.onClose}
      title="Share Maker Portfolio"
    >
      <DialogContent style={{ padding: 24 }}>
        <SocialBar
          url={makerUrl}
          placeholder={placeholder}
          actionLabel="portfolio"
          justify="space-around"
          avatarSize={60}
        />
      </DialogContent>
    </ModalWrapper>
  );
}
