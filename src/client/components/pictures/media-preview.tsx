import React from 'react';
import { mediaTypes } from '../../../shared/constants';
import MediaRect from './media-rect';

const imageExtensions: string[] = [];
Object.keys(mediaTypes).forEach(type => {
  if (type.startsWith('image/')) {
    imageExtensions.push(...mediaTypes[type]);
  }
});

export default function MediaPreview(props: { src: string }) {
  const fileExt = props.src.slice(props.src.lastIndexOf('.') + 1);
  if (imageExtensions.indexOf(fileExt.toLowerCase()) >= 0) {
    return (
      <MediaRect
        style={{ backgroundImage: `url(${props.src})`, backgroundSize: 'cover' }}
      />
    );
  }

  return (
    <MediaRect>
      <video src={props.src} autoPlay={false} controls={true} />
    </MediaRect>
  );
}
