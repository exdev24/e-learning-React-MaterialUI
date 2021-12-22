import React from 'react';
import MediaRect from './pictures/media-rect';

interface Props {
  src: string;
  ratio?: number;
}

const embedBase = 'https://www.youtube-nocookie.com/embed/';

function getId(src: string) {
  let str = src.split(`/`).pop();
  if (str.includes('?v=')) {
    str = str.split(`?v=`)[1];
  }
  str = str.split(`?`)[0];
  str = str.split(`&`)[0];
  return str;
}

export default function EmbedVideo(props: Props) {
  const embedLink = props.src.startsWith(embedBase)
    ? props.src
    : embedBase + getId(props.src);

  return (
    <MediaRect ratio={props.ratio} style={{ maxWidth: 640, margin: '0 auto' }}>
      <iframe
        src={embedLink}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </MediaRect>
  );
}
