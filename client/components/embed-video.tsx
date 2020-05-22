import React from 'react';
import MediaRect from './pictures/media-rect';

interface Props {
  src: string;
  ratio?: number;
}

export default function EmbedVideo(props: Props) {
  return (
    <MediaRect ratio={props.ratio} style={{ maxWidth: 640, margin: '0 auto' }}>
      <iframe
        src={props.src}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </MediaRect>
  );
}
