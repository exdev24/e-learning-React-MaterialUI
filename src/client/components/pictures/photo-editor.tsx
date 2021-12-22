import { Box, Grid, Button, Slider, IconButton } from '@material-ui/core';
import { CloudUploadOutlined, RotateLeft, RotateRight } from '@material-ui/icons';
import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';

const fileInputId = 'cl-photo-input';

export default function PhotoEditor(props: {
  src?: string;
  width?: number;
  height?: number;
  editorRef: React.RefObject<ReactAvatarEditor>;
  onChange: () => void;
}) {
  const [scale, setScale] = React.useState(1);
  const [rotate, setRotate] = React.useState(0);
  const [image, setImage] = React.useState<File>();

  const photoWidth = props.width || 450;
  const photoHeight = props.height || 450;
  const placeholderImage = `https://place-hold.it/${photoWidth}x${photoHeight}`;
  const disabled = !image && !props.src;

  return (
    <div
      style={{
        maxWidth: photoWidth,
        margin: '0 auto'
      }}
    >
      <Box
        my={2}
        boxShadow={2}
        style={{
          height: 0,
          paddingTop: `${(photoHeight / photoWidth) * 100}%`,
          position: 'relative'
        }}
      >
        <ReactAvatarEditor
          ref={props.editorRef}
          image={image || props.src || placeholderImage}
          scale={scale}
          rotate={rotate}
          width={photoWidth}
          height={photoHeight}
          border={0}
          onImageChange={props.onChange}
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </Box>
      <Grid container alignItems="center">
        <Grid item xs="auto">
          <IconButton
            color="primary"
            disabled={disabled}
            onClick={() => setRotate((rotate - 90) % 360)}
          >
            <RotateLeft />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Slider
            defaultValue={1}
            step={0.1}
            min={1}
            max={2}
            disabled={disabled}
            onChange={(e, value) =>
              setScale(typeof value === 'number' ? value : value[0])
            }
          />
        </Grid>
        <Grid item xs="auto">
          <IconButton
            color="primary"
            disabled={disabled}
            onClick={() => setRotate((rotate + 90) % 360)}
          >
            <RotateRight />
          </IconButton>
        </Grid>
      </Grid>
      <label htmlFor={fileInputId} style={{ display: 'block', textAlign: 'center' }}>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={evt => {
            const image = evt.target.files[0];
            if (image) {
              setImage(image);
            }
          }}
        />
        <Button
          startIcon={<CloudUploadOutlined />}
          component="span"
          variant="contained"
          size="small"
        >
          Select a Photo
        </Button>
      </label>
    </div>
  );
}
